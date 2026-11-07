use axum::{
    Extension, Json,
    extract::{
        Query, State,
        ws::{CloseFrame, Message, WebSocket, WebSocketUpgrade},
    },
    http::HeaderMap,
    response::{IntoResponse, Response},
};
use futures_util::{SinkExt, StreamExt};
use nix::{
    ifaddrs::getifaddrs,
    net::if_::InterfaceFlags,
    pty::{ForkptyResult, Winsize, forkpty},
    sys::{
        signal::{Signal, kill},
        wait::waitpid,
    },
    unistd::Pid,
};
use serde::{Deserialize, Serialize};
use std::{
    collections::HashSet,
    fs::{self, File},
    io::{Read, Write},
    os::fd::AsRawFd,
    path::Path,
    ptr,
    time::{Duration, Instant as StdInstant},
};
use tokio::{sync::mpsc, task, time};
use tracing::{debug, info, warn};

use crate::{
    AppError, Result,
    api::{
        account::{require_second_factor, verify_password_limited},
        storage, stream,
    },
    config::Config,
    error::ApiResponse,
    ffi::kvm,
    hdmi_idle,
    http::{middleware::CurrentSession, proxy::ClientInfo},
    state::{AppState, is_allowed_session_lock_duration},
    system::command::{AllowedCommand, run_allowed},
    ws::{hid as hid_ws, origin::validate_ws_origin},
};

const BOOT_VERSION_FILE: &str = "/boot/ver";
const APP_VERSION_FILE: &str = "/kvmapp/version";
const DEVICE_KEY_FILE: &str = "/device_key";
const PROC_UPTIME_FILE: &str = "/proc/uptime";
const HARDWARE_VERSION_FILE: &str = "/etc/kvm/hw";
const ETC_HOSTNAME_FILE: &str = "/etc/hostname";
const BOOT_HOSTNAME_FILE: &str = "/boot/hostname";
// Volatile, so a reboot clears it: the name the services started with.
const HOSTNAME_BOOT_NAME_FILE: &str = "/tmp/hardened-hostname-boot-name";
const ETC_HOSTS_FILE: &str = "/etc/hosts";
const WEB_TITLE_FILE: &str = "/etc/kvm/web-title";
const HDMI_DISABLE_FILE: &str = "/etc/kvm/hdmi_disable";
const SSH_STOP_FLAG: &str = "/etc/kvm/ssh_stop";
const SSH_PROCESS_NAME: &str = "sshd";
const OLED_EXIST_FILE: &str = "/etc/kvm/oled_exist";
const OLED_SLEEP_FILE: &str = "/etc/kvm/oled_sleep";
const GO_MEM_LIMIT_FILE: &str = "/etc/kvm/GOMEMLIMIT";
const SWAP_FILE: &str = "/swapfile";
const INITTAB_PATH: &str = "/etc/inittab";
const TEMP_INITTAB_PATH: &str = "/etc/.inittab.tmp";
const SWAP_INITTAB_LINE: &str = "si11::sysinit:/sbin/swapon /swapfile";
const AVAHI_DAEMON_PID: &str = "/run/avahi-daemon/pid";
const AVAHI_DAEMON_SCRIPT: &str = "/etc/init.d/S50avahi-daemon";
const AVAHI_DAEMON_BACKUP_SCRIPT: &str = "/kvmapp/system/init.d/S50avahi-daemon";
const VIRTUAL_NETWORK_FLAG: &str = "/boot/usb.rndis0";
const VIRTUAL_DISK_FLAG: &str = "/boot/usb.disk0";
const VIRTUAL_NETWORK_CONFIG: &str = "/sys/kernel/config/usb_gadget/g0/configs/c.1/rndis.usb0";
const VIRTUAL_DISK_CONFIG: &str = "/sys/kernel/config/usb_gadget/g0/configs/c.1/mass_storage.disk0";
const TERMINAL_MAX_MESSAGE_SIZE: usize = 1024;
const TERMINAL_DEFAULT_ROWS: u16 = 24;
const TERMINAL_DEFAULT_COLS: u16 = 80;
const TERMINAL_TICKET_TTL_SECS: u64 = 120;

#[derive(Debug, Serialize)]
pub struct IpInfo {
    pub name: String,
    pub addr: String,
    pub version: String,
    #[serde(rename = "type")]
    pub kind: String,
}

#[derive(Debug, Serialize)]
pub struct InfoRsp {
    pub ips: Vec<IpInfo>,
    pub mdns: String,
    pub image: String,
    pub application: String,
    pub uptime: u64,
    #[serde(rename = "deviceKey")]
    pub device_key: String,
}

#[derive(Debug, Serialize)]
pub struct HardwareRsp {
    pub version: String,
    /// Looks like a NanoKVM Lite: no OLED, no Wi-Fi and so most likely no ATX board.
    pub lite: bool,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct HostnameRsp {
    pub hostname: String,
    /// The name changed since boot, so the services still run under the old one.
    pub reboot_required: bool,
}

#[derive(Debug, Deserialize)]
struct TerminalWinSize {
    rows: u16,
    cols: u16,
}

struct TerminalPty {
    master: File,
    child: Pid,
}

#[derive(Debug, Deserialize)]
pub struct SetHostnameReq {
    pub hostname: String,
}

#[derive(Debug, Deserialize)]
pub struct SetScreenReq {
    #[serde(rename = "type")]
    pub kind: String,
    pub value: i32,
}

#[derive(Debug, Serialize)]
pub struct WebTitleRsp {
    pub title: String,
}

#[derive(Debug, Deserialize)]
pub struct SetWebTitleReq {
    pub title: String,
}

#[derive(Debug, Deserialize)]
pub struct SetTlsReq {
    pub enabled: bool,
}

#[derive(Debug, Deserialize)]
pub struct SetTerminalReq {
    pub enabled: bool,
}

#[derive(Debug, Deserialize)]
pub struct TerminalUnlockReq {
    pub username: String,
    pub password: String,
    /// Second factor, needed when the account has one.
    #[serde(default)]
    pub code: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct TerminalUnlockRsp {
    pub ticket: String,
    #[serde(rename = "expiresAt")]
    pub expires_at: u64,
}

#[derive(Debug, Deserialize)]
pub struct TerminalConnectQuery {
    pub ticket: String,
}

#[derive(Debug, Serialize)]
pub struct SessionLockRsp {
    pub duration: u64,
    #[serde(rename = "expiresAt", skip_serializing_if = "Option::is_none")]
    pub expires_at: Option<u64>,
    #[serde(rename = "logoutOnBrowserClose")]
    pub logout_on_browser_close: bool,
}

#[derive(Debug, Deserialize)]
pub struct SetSessionLockReq {
    pub duration: Option<u64>,
    #[serde(rename = "logoutOnBrowserClose")]
    pub logout_on_browser_close: Option<bool>,
}

#[derive(Debug, Deserialize)]
pub struct SetGpioReq {
    #[serde(rename = "type")]
    pub kind: String,
    #[serde(default)]
    pub duration: u64,
}

#[derive(Debug, Serialize)]
pub struct GpioRsp {
    pub pwr: bool,
    pub hdd: bool,
}

#[derive(Debug, Serialize)]
pub struct EnabledRsp {
    pub enabled: bool,
}

#[derive(Debug, Serialize)]
pub struct HdmiStateRsp {
    pub enabled: bool,
    pub signal: bool,
    #[serde(rename = "idleTimeout")]
    pub idle_timeout: u32,
}

#[derive(Debug, Deserialize)]
pub struct SetHdmiIdleTimeoutReq {
    pub minutes: u32,
}

#[derive(Debug, Serialize)]
pub struct OledRsp {
    pub exist: bool,
    pub sleep: i32,
}

#[derive(Debug, Deserialize)]
pub struct SetOledReq {
    pub sleep: i32,
}

#[derive(Debug, Serialize)]
pub struct VirtualDeviceRsp {
    pub network: bool,
    pub media: bool,
    pub disk: bool,
}

#[derive(Debug, Deserialize)]
pub struct UpdateVirtualDeviceReq {
    pub device: String,
}

#[derive(Debug, Serialize)]
pub struct UpdateVirtualDeviceRsp {
    pub on: bool,
}

#[derive(Debug, Serialize)]
pub struct MemoryLimitRsp {
    pub enabled: bool,
    pub limit: i64,
}

#[derive(Debug, Deserialize)]
pub struct SetMemoryLimitReq {
    #[serde(default)]
    pub enabled: bool,
    #[serde(default)]
    pub limit: i64,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SwapRsp {
    pub size: i64,
    /// What a swap file may take: the free space of the root filesystem plus the current file.
    pub available_mb: i64,
}

#[derive(Debug, Deserialize)]
pub struct SetSwapReq {
    #[serde(default)]
    pub size: i64,
}

#[derive(Debug, Serialize)]
pub struct MouseJigglerRsp {
    pub enabled: bool,
    pub mode: String,
}

#[derive(Debug, Deserialize)]
pub struct SetMouseJigglerReq {
    #[serde(default)]
    pub enabled: bool,
    #[serde(default)]
    pub mode: String,
}

pub async fn get_info() -> Result<impl IntoResponse> {
    Ok(Json(ApiResponse::ok(InfoRsp {
        ips: get_ips(),
        mdns: get_mdns(),
        image: get_image_version(),
        application: read_trimmed(APP_VERSION_FILE).unwrap_or_else(|| "1.0.0".to_string()),
        uptime: get_uptime_seconds(),
        device_key: read_trimmed(DEVICE_KEY_FILE).unwrap_or_default(),
    })))
}

pub async fn get_hardware() -> Result<impl IntoResponse> {
    Ok(Json(ApiResponse::ok(HardwareRsp {
        version: get_hardware_version(),
        lite: looks_like_lite(
            read_trimmed(HARDWARE_VERSION_FILE).as_deref(),
            Path::new(OLED_EXIST_FILE).exists(),
            Path::new(crate::api::network::WIFI_EXIST_FILE).exists(),
        ),
    })))
}

#[derive(Debug, Serialize)]
pub struct RebootPendingRsp {
    /// What waits for a reboot: `hostname`, `overdrive`, `systemUpdate`.
    pub reasons: Vec<&'static str>,
}

/// The changes that only take effect after the next reboot, from the state each one keeps.
pub async fn get_reboot_pending() -> Result<impl IntoResponse> {
    let reasons = task::spawn_blocking(|| {
        let mut reasons = Vec::new();
        if hostname_reboot_pending() {
            reasons.push("hostname");
        }
        if crate::api::cpu_clock::reboot_pending() {
            reasons.push("overdrive");
        }
        if crate::api::system_update::reboot_pending() {
            reasons.push("systemUpdate");
        }
        reasons
    })
    .await
    .map_err(|err| AppError::Internal(format!("reboot check task failed: {err}")))?;

    Ok(Json(ApiResponse::ok(RebootPendingRsp { reasons })))
}

fn hostname_reboot_pending() -> bool {
    let hostname = read_trimmed(ETC_HOSTNAME_FILE).unwrap_or_default();
    hostname_reboot_required(read_trimmed(HOSTNAME_BOOT_NAME_FILE).as_deref(), &hostname)
}

pub async fn get_hostname() -> Result<impl IntoResponse> {
    let hostname = read_trimmed(ETC_HOSTNAME_FILE).unwrap_or_default();
    let reboot_required =
        hostname_reboot_required(read_trimmed(HOSTNAME_BOOT_NAME_FILE).as_deref(), &hostname);
    Ok(Json(ApiResponse::ok(HostnameRsp {
        hostname,
        reboot_required,
    })))
}

/// A reboot is needed while the name differs from the one in effect at boot.
fn hostname_reboot_required(boot_name: Option<&str>, current: &str) -> bool {
    boot_name.is_some_and(|boot| boot != current)
}

// Remember the name the services run under; changing it back clears the need to reboot.
fn track_hostname_change(old_hostname: &str, new_hostname: &str) {
    let boot_name =
        read_trimmed(HOSTNAME_BOOT_NAME_FILE).unwrap_or_else(|| old_hostname.to_string());
    if boot_name == new_hostname || boot_name.is_empty() {
        let _ = remove_file_if_exists(HOSTNAME_BOOT_NAME_FILE);
    } else {
        let _ = fs::write(HOSTNAME_BOOT_NAME_FILE, boot_name.as_bytes());
    }
}

pub async fn set_hostname(Json(req): Json<SetHostnameReq>) -> Result<impl IntoResponse> {
    validate_hostname(&req.hostname)?;
    let old_hostname = read_trimmed(ETC_HOSTNAME_FILE).unwrap_or_default();

    // replacing an empty name would insert the new one between every character
    if !old_hostname.is_empty()
        && old_hostname != req.hostname
        && let Ok(hosts) = fs::read_to_string(ETC_HOSTS_FILE)
    {
        fs::write(
            ETC_HOSTS_FILE,
            replace_host_name(&hosts, &old_hostname, &req.hostname),
        )?;
    }

    fs::write(BOOT_HOSTNAME_FILE, req.hostname.as_bytes())?;
    fs::write(ETC_HOSTNAME_FILE, req.hostname.as_bytes())?;
    track_hostname_change(&old_hostname, &req.hostname);
    let _ = run_allowed(
        AllowedCommand::Hostname,
        ["-F", ETC_HOSTNAME_FILE],
        Duration::from_secs(2),
    )
    .await;

    Ok(Json(ApiResponse::<()>::ok_empty()))
}

pub async fn set_screen(Json(req): Json<SetScreenReq>) -> Result<impl IntoResponse> {
    let (kind, value) = (req.kind.clone(), req.value);
    stream::libkvm(move || stream::set_screen_value(&kind, value)).await?;
    info!(kind = %req.kind, value = req.value, "updated screen setting");
    Ok(Json(ApiResponse::<()>::ok_empty()))
}

pub async fn get_web_title() -> Result<impl IntoResponse> {
    Ok(Json(ApiResponse::ok(WebTitleRsp {
        title: read_trimmed(WEB_TITLE_FILE).unwrap_or_default(),
    })))
}

pub async fn set_web_title(Json(req): Json<SetWebTitleReq>) -> Result<impl IntoResponse> {
    if req.title.is_empty() || req.title == "NanoKVM" {
        match fs::remove_file(WEB_TITLE_FILE) {
            Ok(()) => {}
            Err(err) if err.kind() == std::io::ErrorKind::NotFound => {}
            Err(err) => return Err(err.into()),
        }
    } else {
        if req.title.len() > 128 || req.title.contains(['\n', '\r']) {
            return Err(AppError::BadRequest("invalid web title".to_string()));
        }
        fs::write(WEB_TITLE_FILE, req.title.as_bytes())?;
    }

    Ok(Json(ApiResponse::<()>::ok_empty()))
}

pub async fn get_gpio() -> Result<impl IntoResponse> {
    let gpio = hardware_gpio();
    let pwr = read_gpio(&gpio.power_led)?;
    let hdd = gpio
        .hdd_led
        .as_deref()
        .map(read_gpio)
        .transpose()?
        .unwrap_or(false);

    Ok(Json(ApiResponse::ok(GpioRsp { pwr, hdd })))
}

pub async fn set_gpio(Json(req): Json<SetGpioReq>) -> Result<impl IntoResponse> {
    let gpio = hardware_gpio();
    let device = match req.kind.as_str() {
        "power" => gpio.power,
        "reset" => gpio.reset,
        _ => return Err(AppError::BadRequest("invalid power event".to_string())),
    };
    let duration = if req.duration == 0 {
        Duration::from_millis(800)
    } else {
        Duration::from_millis(req.duration.clamp(50, 5_000))
    };

    write_gpio_pulse(&device, duration).await?;
    Ok(Json(ApiResponse::<()>::ok_empty()))
}

pub async fn get_hdmi_state() -> Result<impl IntoResponse> {
    let enabled = !Path::new(HDMI_DISABLE_FILE).exists();
    Ok(Json(ApiResponse::ok(HdmiStateRsp {
        enabled,
        signal: enabled && kvm::hdmi_signal_active(),
        idle_timeout: hdmi_idle::idle_timeout_minutes(),
    })))
}

pub async fn set_hdmi_idle_timeout(
    Json(req): Json<SetHdmiIdleTimeoutReq>,
) -> Result<impl IntoResponse> {
    hdmi_idle::set_idle_timeout(req.minutes)?;
    Ok(Json(ApiResponse::<()>::ok_empty()))
}

pub async fn enable_hdmi() -> Result<impl IntoResponse> {
    stream::libkvm(|| kvm::set_hdmi(true)).await?;
    persist_hdmi_enabled()?;
    hdmi_idle::capture_enabled();
    Ok(Json(ApiResponse::<()>::ok_empty()))
}

pub async fn disable_hdmi() -> Result<impl IntoResponse> {
    stream::libkvm(|| kvm::set_hdmi(false)).await?;
    persist_hdmi_disabled()?;
    hdmi_idle::capture_disabled();
    Ok(Json(ApiResponse::<()>::ok_empty()))
}

pub async fn reset_hdmi() -> Result<impl IntoResponse> {
    // A capture the user turned off stays off: a reset must not persist "enabled" over it.
    if Path::new(HDMI_DISABLE_FILE).exists() {
        return Err(AppError::BadRequest("HDMI capture is disabled".to_string()));
    }
    // A lost client must not leave HDMI capture switched off.
    stream::owned_interval(
        || kvm::set_hdmi(false).map(drop),
        Duration::from_secs(1),
        || {
            kvm::set_hdmi(true)?;
            persist_hdmi_enabled()?;
            hdmi_idle::capture_enabled();
            Ok(())
        },
    )
    .await?;
    Ok(Json(ApiResponse::<()>::ok_empty()))
}

pub async fn get_ssh_state() -> Result<impl IntoResponse> {
    Ok(Json(ApiResponse::ok(EnabledRsp {
        enabled: ssh_enabled().await,
    })))
}

pub async fn enable_ssh() -> Result<impl IntoResponse> {
    if ssh_enabled().await {
        return Ok(Json(ApiResponse::ok(EnabledRsp { enabled: true })));
    }

    let result = run_checked(
        AllowedCommand::ServiceSshd,
        ["permanent_on"],
        Duration::from_secs(5),
        "enable ssh failed",
    )
    .await;
    wait_for_ssh_state(true, Duration::from_secs(3)).await;
    let enabled = ssh_enabled().await;
    if let Err(err) = result
        && !enabled
    {
        return Err(err);
    }
    Ok(Json(ApiResponse::ok(EnabledRsp { enabled })))
}

pub async fn disable_ssh() -> Result<impl IntoResponse> {
    if ssh_stop_requested() && !sshd_is_running().await {
        return Ok(Json(ApiResponse::ok(EnabledRsp { enabled: false })));
    }

    let result = run_checked(
        AllowedCommand::ServiceSshd,
        ["permanent_off"],
        Duration::from_secs(5),
        "disable ssh failed",
    )
    .await;
    wait_for_ssh_state(false, Duration::from_secs(3)).await;
    let enabled = ssh_enabled().await;
    if let Err(err) = result
        && (enabled || !ssh_stop_requested())
    {
        return Err(err);
    }
    Ok(Json(ApiResponse::ok(EnabledRsp { enabled })))
}

async fn ssh_enabled() -> bool {
    !ssh_stop_requested() && sshd_is_running().await
}

fn ssh_stop_requested() -> bool {
    Path::new(SSH_STOP_FLAG).exists()
}

async fn sshd_is_running() -> bool {
    match run_allowed(
        AllowedCommand::Pidof,
        [SSH_PROCESS_NAME],
        Duration::from_secs(2),
    )
    .await
    {
        Ok(output) => output.status == 0 && !output.stdout.is_empty(),
        Err(err) => {
            debug!(error = %err, "failed to check sshd process");
            false
        }
    }
}

async fn wait_for_ssh_state(enabled: bool, timeout: Duration) {
    let deadline = StdInstant::now() + timeout;
    loop {
        if ssh_enabled().await == enabled {
            return;
        }
        if StdInstant::now() >= deadline {
            return;
        }
        time::sleep(Duration::from_millis(200)).await;
    }
}

pub async fn get_mdns_state() -> Result<impl IntoResponse> {
    Ok(Json(ApiResponse::ok(EnabledRsp {
        enabled: avahi_daemon_pid().is_some(),
    })))
}

pub async fn enable_mdns() -> Result<impl IntoResponse> {
    if avahi_daemon_pid().is_some() {
        return Ok(Json(ApiResponse::<()>::ok_empty()));
    }

    if Path::new(AVAHI_DAEMON_BACKUP_SCRIPT).exists() {
        fs::copy(AVAHI_DAEMON_BACKUP_SCRIPT, AVAHI_DAEMON_SCRIPT)?;
    }
    run_checked(
        AllowedCommand::ServiceAvahiDaemon,
        ["start"],
        Duration::from_secs(5),
        "enable mdns failed",
    )
    .await?;
    Ok(Json(ApiResponse::<()>::ok_empty()))
}

pub async fn disable_mdns() -> Result<impl IntoResponse> {
    let Some(pid) = avahi_daemon_pid() else {
        return Ok(Json(ApiResponse::<()>::ok_empty()));
    };
    if !valid_pid(&pid) {
        return Err(AppError::Internal("invalid avahi pid".to_string()));
    }

    run_checked(
        AllowedCommand::Kill,
        ["-9", pid.as_str()],
        Duration::from_secs(2),
        "disable mdns failed",
    )
    .await?;
    remove_file_if_exists(AVAHI_DAEMON_PID)?;
    remove_file_if_exists(AVAHI_DAEMON_SCRIPT)?;
    Ok(Json(ApiResponse::<()>::ok_empty()))
}

pub async fn get_oled() -> Result<impl IntoResponse> {
    if !Path::new(OLED_EXIST_FILE).exists() {
        return Ok(Json(ApiResponse::ok(OledRsp {
            exist: false,
            sleep: 0,
        })));
    }

    let sleep = read_trimmed(OLED_SLEEP_FILE)
        .and_then(|value| value.parse::<i32>().ok())
        .unwrap_or(0);
    Ok(Json(ApiResponse::ok(OledRsp { exist: true, sleep })))
}

pub async fn set_oled(Json(req): Json<SetOledReq>) -> Result<impl IntoResponse> {
    if req.sleep < 0 || req.sleep > 24 * 60 * 60 {
        return Err(AppError::BadRequest("invalid OLED sleep".to_string()));
    }
    fs::write(OLED_SLEEP_FILE, req.sleep.to_string().as_bytes())?;
    Ok(Json(ApiResponse::<()>::ok_empty()))
}

pub async fn get_virtual_device() -> Result<impl IntoResponse> {
    Ok(Json(ApiResponse::ok(VirtualDeviceRsp {
        network: Path::new(VIRTUAL_NETWORK_FLAG).exists(),
        media: false,
        disk: disk_attached(),
    })))
}

/// Whether the virtual disk is enabled and /data is currently shared with the
/// host. A disk that serves an image, or nothing at all, counts as off.
fn disk_attached() -> bool {
    Path::new(VIRTUAL_DISK_FLAG).exists() && storage::data_disk_attached()
}

/// An empty disk flag makes the gadget serve /data; a non-empty one names another disk.
fn disk_flag_serves_data(flag: &Path) -> bool {
    fs::metadata(flag).is_ok_and(|meta| meta.len() == 0)
}

pub async fn update_virtual_device(
    Json(req): Json<UpdateVirtualDeviceReq>,
) -> Result<impl IntoResponse> {
    let (flag, config_dir) = match req.device.as_str() {
        "network" => (VIRTUAL_NETWORK_FLAG, VIRTUAL_NETWORK_CONFIG),
        "disk" => (VIRTUAL_DISK_FLAG, VIRTUAL_DISK_CONFIG),
        _ => return Err(AppError::BadRequest("invalid virtual device".to_string())),
    };
    if crate::api::hid::is_hid_only_mode() {
        return Err(AppError::Conflict(
            "virtual devices are not available in HID-only mode".to_string(),
        ));
    }

    // Also covers the gadget restart below: nothing may remount the media meanwhile.
    let _gadget = storage::lock_gadget().await;
    let is_disk = req.device == "disk";
    let exists = if is_disk {
        disk_attached()
    } else {
        Path::new(flag).exists()
    };

    // A gadget restart serves /data again whenever the disk is on, whichever device is toggled.
    let handing_over_disk = if is_disk {
        !exists
    } else {
        disk_flag_serves_data(Path::new(VIRTUAL_DISK_FLAG)) && !disk_attached()
    };
    if handing_over_disk {
        storage::ensure_no_transfer()?;
    }

    run_usbdev("stop").await?;
    if handing_over_disk && let Err(err) = release_data_for_host().await {
        if let Err(restart) = run_usbdev("start").await {
            warn!(error = %restart, "failed to restart the USB gadget after a failed handover");
        }
        return Err(err);
    }
    if exists {
        remove_dir_if_exists(config_dir)?;
        remove_file_if_exists(flag)?;
    } else {
        // Keep the content: a non-empty flag names the disk to serve.
        fs::OpenOptions::new()
            .create(true)
            .append(true)
            .open(flag)?;
    }
    run_usbdev("start").await?;

    // The disk is gone from the host, so the KVM writes /data itself again.
    if is_disk
        && !disk_attached()
        && let Err(err) = storage::set_data_writable(true).await
    {
        warn!(error = %err, "failed to make /data writable after disabling the virtual disk");
    }

    let on = if is_disk {
        disk_attached()
    } else {
        Path::new(flag).exists()
    };
    Ok(Json(ApiResponse::ok(UpdateVirtualDeviceRsp { on })))
}

pub async fn reboot() -> Result<impl IntoResponse> {
    run_checked(
        AllowedCommand::Reboot,
        std::iter::empty::<&str>(),
        Duration::from_secs(2),
        "reboot failed",
    )
    .await?;
    Ok(Json(ApiResponse::<()>::ok_empty()))
}

/// Answers first and powers off a second later, so the browser gets its response.
pub async fn poweroff() -> Result<impl IntoResponse> {
    tokio::spawn(async {
        time::sleep(Duration::from_millis(1000)).await;
        if let Err(err) = run_allowed(
            AllowedCommand::Poweroff,
            std::iter::empty::<&str>(),
            Duration::from_secs(2),
        )
        .await
        {
            tracing::error!(error = %err, "failed to power off");
        }
    });
    Ok(Json(ApiResponse::<()>::ok_empty()))
}

pub async fn terminal(
    State(state): State<AppState>,
    client: ClientInfo,
    Extension(CurrentSession(session)): Extension<CurrentSession>,
    Query(query): Query<TerminalConnectQuery>,
    headers: HeaderMap,
    ws: WebSocketUpgrade,
) -> Result<Response> {
    if state.config.auth_disabled() || !state.terminal_enabled() {
        return Err(AppError::Forbidden("terminal is disabled".to_string()));
    }
    if !validate_ws_origin(&headers, &state.config, &client) {
        return Err(AppError::Forbidden("invalid websocket origin".to_string()));
    }
    if !state
        .terminal_tickets
        .consume(&query.ticket, &session)
        .await
    {
        return Err(AppError::Forbidden(
            "terminal unlock is required".to_string(),
        ));
    }

    Ok(ws
        .max_message_size(TERMINAL_MAX_MESSAGE_SIZE)
        .on_upgrade(move |socket| handle_terminal_socket(socket, session.expires_at))
        .into_response())
}

async fn handle_terminal_socket(mut socket: WebSocket, expires_at: StdInstant) {
    let terminal = match spawn_terminal_pty() {
        Ok(terminal) => terminal,
        Err(err) => {
            warn!(error = ?err, "failed to start terminal pty");
            let _ = socket
                .send(Message::Close(Some(CloseFrame {
                    code: 1011,
                    reason: "failed to start terminal".into(),
                })))
                .await;
            return;
        }
    };

    let TerminalPty { master, child } = terminal;
    let mut pty_reader = match master.try_clone() {
        Ok(file) => file,
        Err(err) => {
            warn!(error = ?err, "failed to clone terminal pty");
            cleanup_terminal_process_blocking(child);
            return;
        }
    };
    let mut pty_writer = master;
    let (pty_tx, mut pty_rx) = mpsc::channel::<Vec<u8>>(16);
    let reader_task = task::spawn_blocking(move || {
        let mut buffer = [0_u8; TERMINAL_MAX_MESSAGE_SIZE];
        loop {
            match pty_reader.read(&mut buffer) {
                Ok(0) => break,
                Ok(n) => {
                    if pty_tx.blocking_send(buffer[..n].to_vec()).is_err() {
                        break;
                    }
                }
                Err(_) => break,
            }
        }
    });

    let (mut ws_tx, mut ws_rx) = socket.split();
    debug!("terminal websocket connected");
    let session_deadline = time::sleep(expires_at.saturating_duration_since(StdInstant::now()));
    tokio::pin!(session_deadline);

    loop {
        tokio::select! {
            _ = &mut session_deadline => {
                let _ = ws_tx.send(Message::Close(Some(CloseFrame {
                    code: 1008,
                    reason: "terminal session expired".into(),
                }))).await;
                break;
            }
            data = pty_rx.recv() => {
                let Some(data) = data else {
                    break;
                };
                if ws_tx.send(Message::Binary(data.into())).await.is_err() {
                    break;
                }
            }
            message = ws_rx.next() => {
                let message = match message {
                    Some(Ok(message)) => message,
                    Some(Err(err)) => {
                        debug!(error = ?err, "terminal websocket read failed");
                        break;
                    }
                    None => break,
                };

                match message {
                    Message::Text(text) => {
                        if pty_writer.write_all(text.as_bytes()).is_err() {
                            break;
                        }
                    }
                    Message::Binary(data) => {
                        if let Some(size) = parse_terminal_winsize(&data) {
                            set_terminal_winsize(&pty_writer, &size);
                        }
                    }
                    Message::Ping(data) => {
                        if ws_tx.send(Message::Pong(data)).await.is_err() {
                            break;
                        }
                    }
                    Message::Pong(_) => {}
                    Message::Close(_) => break,
                }
            }
        }
    }

    drop(pty_writer);
    let _ = task::spawn_blocking(move || cleanup_terminal_process_blocking(child)).await;
    let _ = reader_task.await;
    debug!("terminal websocket disconnected");
}

pub async fn unlock_terminal(
    State(state): State<AppState>,
    Extension(CurrentSession(session)): Extension<CurrentSession>,
    client: ClientInfo,
    Json(req): Json<TerminalUnlockReq>,
) -> Result<impl IntoResponse> {
    if state.config.auth_disabled() || !state.terminal_enabled() {
        return Err(AppError::Forbidden("terminal is disabled".to_string()));
    }
    if req.username != session.username {
        return Err(AppError::InvalidCredentials);
    }

    let source_ip = client.source_ip();
    verify_password_limited(&state, &source_ip, &session.username, &req.password).await?;
    require_second_factor(&state, &session.username, &source_ip, req.code.as_deref()).await?;

    let ticket = state
        .terminal_tickets
        .issue(&session, TERMINAL_TICKET_TTL_SECS)
        .await;

    Ok(Json(ApiResponse::ok(TerminalUnlockRsp {
        ticket: ticket.token,
        expires_at: ticket.expires_at_unix,
    })))
}

pub async fn get_terminal_enabled(State(state): State<AppState>) -> Result<impl IntoResponse> {
    Ok(Json(ApiResponse::ok(EnabledRsp {
        enabled: state.terminal_enabled(),
    })))
}

pub async fn set_terminal_enabled(
    State(state): State<AppState>,
    Json(req): Json<SetTerminalReq>,
) -> Result<impl IntoResponse> {
    let mut config = Config::read()?;
    config.security.allow_terminal = req.enabled;
    config.write()?;
    state.set_terminal_enabled(req.enabled);
    Ok(Json(ApiResponse::<()>::ok_empty()))
}

pub async fn get_session_lock(State(state): State<AppState>) -> Result<impl IntoResponse> {
    Ok(Json(ApiResponse::ok(SessionLockRsp {
        duration: state.session_lock_duration(),
        expires_at: None,
        logout_on_browser_close: state.logout_on_browser_close(),
    })))
}

/// Called by the web UI while the user is at the page, so the lock counts idle time
/// rather than time since login.
pub async fn touch_session_lock(
    State(state): State<AppState>,
    client: ClientInfo,
    session: Option<Extension<CurrentSession>>,
) -> Result<impl IntoResponse> {
    let duration = state.session_lock_duration();
    let mut headers = HeaderMap::new();

    // Without authentication there is no session to slide.
    let Some(Extension(CurrentSession(session))) = session else {
        return Ok((
            headers,
            Json(ApiResponse::ok(SessionLockRsp {
                duration,
                expires_at: None,
                logout_on_browser_close: state.logout_on_browser_close(),
            })),
        ));
    };

    let session = state
        .sessions
        .touch(&session.token, duration)
        .await
        .ok_or(AppError::Unauthorized)?;
    headers.insert(
        axum::http::header::SET_COOKIE,
        state.session_cookie(&session.token, duration, client.secure)?,
    );

    Ok((
        headers,
        Json(ApiResponse::ok(SessionLockRsp {
            duration,
            expires_at: Some(session.expires_at_unix),
            logout_on_browser_close: state.logout_on_browser_close(),
        })),
    ))
}

pub async fn set_session_lock(
    State(state): State<AppState>,
    client: ClientInfo,
    Extension(CurrentSession(session)): Extension<CurrentSession>,
    Json(req): Json<SetSessionLockReq>,
) -> Result<impl IntoResponse> {
    if let Some(duration) = req.duration
        && !is_allowed_session_lock_duration(duration)
    {
        return Err(AppError::BadRequest(
            "unsupported session lock duration".to_string(),
        ));
    }

    let mut config = Config::read()?;
    if let Some(duration) = req.duration {
        config.security.access_token_duration = duration;
    }
    if let Some(enabled) = req.logout_on_browser_close {
        config.security.logout_on_browser_close = enabled;
    }
    config.write()?;
    if let Some(duration) = req.duration {
        state.set_session_lock_duration(duration);
    }
    if let Some(enabled) = req.logout_on_browser_close {
        state.set_logout_on_browser_close(enabled);
    }

    let duration = state.session_lock_duration();
    let session = state.sessions.retime(&session.token, duration).await;
    let mut headers = HeaderMap::new();
    if let Some(session) = &session {
        headers.insert(
            axum::http::header::SET_COOKIE,
            state.session_cookie(&session.token, duration, client.secure)?,
        );
    }

    Ok((
        headers,
        Json(ApiResponse::ok(SessionLockRsp {
            duration,
            expires_at: session.map(|session| session.expires_at_unix),
            logout_on_browser_close: state.logout_on_browser_close(),
        })),
    ))
}

fn spawn_terminal_pty() -> std::io::Result<TerminalPty> {
    let winsize = Winsize {
        ws_row: TERMINAL_DEFAULT_ROWS,
        ws_col: TERMINAL_DEFAULT_COLS,
        ws_xpixel: 0,
        ws_ypixel: 0,
    };

    match unsafe { forkpty(Some(&winsize), None) }
        .map_err(|err| std::io::Error::other(format!("forkpty failed: {err}")))?
    {
        ForkptyResult::Child => exec_terminal_shell(),
        ForkptyResult::Parent { child, master } => Ok(TerminalPty {
            master: File::from(master),
            child,
        }),
    }
}

fn exec_terminal_shell() -> ! {
    let shell = b"/bin/sh\0";
    let login_flag = b"-l\0";
    let home = b"/root\0";
    unsafe {
        // Best effort: a missing /root must not stop the shell from starting.
        nix::libc::chdir(home.as_ptr().cast());
        nix::libc::execl(
            shell.as_ptr().cast(),
            shell.as_ptr().cast(),
            login_flag.as_ptr().cast::<nix::libc::c_char>(),
            ptr::null::<nix::libc::c_char>(),
        );
        nix::libc::_exit(127);
    }
}

fn parse_terminal_winsize(data: &[u8]) -> Option<Winsize> {
    let win_size: TerminalWinSize = serde_json::from_slice(data).ok()?;
    if win_size.rows == 0 || win_size.cols == 0 {
        return None;
    }
    Some(Winsize {
        ws_row: win_size.rows,
        ws_col: win_size.cols,
        ws_xpixel: 0,
        ws_ypixel: 0,
    })
}

fn set_terminal_winsize(pty: &File, winsize: &Winsize) {
    let result = unsafe { nix::libc::ioctl(pty.as_raw_fd(), nix::libc::TIOCSWINSZ, winsize) };
    if result < 0 {
        debug!(
            error = ?std::io::Error::last_os_error(),
            "failed to resize terminal pty"
        );
    }
}

fn cleanup_terminal_process_blocking(child: Pid) {
    let _ = kill(child, Signal::SIGTERM);
    std::thread::sleep(Duration::from_millis(50));
    let _ = kill(child, Signal::SIGKILL);
    let _ = waitpid(child, None);
}

pub async fn get_memory_limit() -> Result<impl IntoResponse> {
    if !Path::new(GO_MEM_LIMIT_FILE).exists() {
        return Ok(Json(ApiResponse::ok(MemoryLimitRsp {
            enabled: false,
            limit: 0,
        })));
    }

    let limit = read_memory_limit()?;
    Ok(Json(ApiResponse::ok(MemoryLimitRsp {
        enabled: true,
        limit,
    })))
}

pub async fn set_memory_limit(Json(req): Json<SetMemoryLimitReq>) -> Result<impl IntoResponse> {
    if req.enabled {
        let limit = normalize_memory_limit(req.limit)?;
        fs::write(GO_MEM_LIMIT_FILE, limit.to_string().as_bytes())?;
    } else {
        remove_file_if_exists(GO_MEM_LIMIT_FILE)?;
    }

    Ok(Json(ApiResponse::<()>::ok_empty()))
}

pub async fn get_swap() -> Result<impl IntoResponse> {
    Ok(Json(ApiResponse::ok(SwapRsp {
        size: get_swap_size(),
        available_mb: swap_available_mb(),
    })))
}

pub async fn set_swap(Json(req): Json<SetSwapReq>) -> Result<impl IntoResponse> {
    validate_swap_size(req.size)?;
    let current = get_swap_size();
    if req.size == current {
        return Ok(Json(ApiResponse::<()>::ok_empty()));
    }

    if req.size == 0 {
        disable_swap().await?;
        disable_swap_inittab()?;
        write_swap_flag(0);
    } else {
        if !swap_fits(req.size, swap_available_mb()) {
            return Err(AppError::BadRequest(
                "not enough free space for the swap file".to_string(),
            ));
        }
        enable_swap(req.size).await?;
        enable_swap_inittab()?;
        write_swap_flag(req.size);
    }

    Ok(Json(ApiResponse::<()>::ok_empty()))
}

pub async fn get_mouse_jiggler() -> Result<impl IntoResponse> {
    let (enabled, mode) = hid_ws::mouse_jiggler_snapshot()?;
    Ok(Json(ApiResponse::ok(MouseJigglerRsp { enabled, mode })))
}

pub async fn set_mouse_jiggler(Json(req): Json<SetMouseJigglerReq>) -> Result<impl IntoResponse> {
    hid_ws::set_mouse_jiggler(req.enabled, &req.mode)?;
    Ok(Json(ApiResponse::<()>::ok_empty()))
}

pub async fn set_tls(Json(req): Json<SetTlsReq>) -> Result<Json<ApiResponse<()>>> {
    crate::api::tls_switch::apply(req.enabled).await?;
    Ok(Json(ApiResponse::<()>::ok_empty()))
}

fn get_ips() -> Vec<IpInfo> {
    let mut ips = Vec::new();
    let mut seen = HashSet::new();
    let Ok(addrs) = getifaddrs() else {
        return ips;
    };

    for iface in addrs {
        if !iface.flags.contains(InterfaceFlags::IFF_UP) {
            continue;
        }
        let Some(kind) = interface_type(&iface.interface_name) else {
            continue;
        };
        let Some(address) = iface.address else {
            continue;
        };
        let Some(ipv4) = address.as_sockaddr_in().map(|addr| addr.ip()) else {
            if let Some(ipv6) = address.as_sockaddr_in6().map(|addr| addr.ip()) {
                if ipv6.is_loopback() {
                    continue;
                }
                if !seen.insert(format!("{}-ipv6-{ipv6}", iface.interface_name)) {
                    continue;
                }
                ips.push(IpInfo {
                    name: iface.interface_name,
                    addr: ipv6.to_string(),
                    version: "IPv6".to_string(),
                    kind: kind.to_string(),
                });
            }
            continue;
        };

        if !seen.insert(format!("{}-ipv4-{ipv4}", iface.interface_name)) {
            continue;
        }
        ips.push(IpInfo {
            name: iface.interface_name,
            addr: ipv4.to_string(),
            version: "IPv4".to_string(),
            kind: kind.to_string(),
        });
    }

    ips
}

fn interface_type(name: &str) -> Option<&'static str> {
    if name.starts_with("eth") || name.starts_with("en") {
        Some("Wired")
    } else if name.starts_with("wlan") || name.starts_with("wl") {
        Some("Wireless")
    } else {
        None
    }
}

/// mDNS names the device by the first label of its host name, so host.network.net is host.local.
fn get_mdns() -> String {
    read_trimmed(ETC_HOSTNAME_FILE)
        .map(|hostname| format!("{}.local", hostname.split('.').next().unwrap_or_default()))
        .unwrap_or_default()
}

fn get_image_version() -> String {
    let image = read_trimmed(BOOT_VERSION_FILE).unwrap_or_default();
    match image.as_str() {
        "2024-06-23-20-59-2d2bfb.img" => "v1.0.0".to_string(),
        "2024-07-23-20-18-587710.img" => "v1.1.0".to_string(),
        "2024-08-08-19-44-bef2ca.img" => "v1.2.0".to_string(),
        "2024-11-13-09-59-9c961a.img" => "v1.3.0".to_string(),
        "2025-02-17-19-08-3649fe.img" => "v1.4.0".to_string(),
        "2025-04-17-14-21-98d17d.img" => "v1.4.1".to_string(),
        "2026-01-05-1_4_1.img" => "v1.4.2".to_string(),
        _ => image,
    }
}

fn get_uptime_seconds() -> u64 {
    read_trimmed(PROC_UPTIME_FILE)
        .and_then(|uptime| {
            uptime
                .split_whitespace()
                .next()
                .and_then(|seconds| seconds.split('.').next())
                .and_then(|seconds| seconds.parse::<u64>().ok())
        })
        .unwrap_or_default()
}

/// The boot detection files a Lite under `beta`, as it has no OLED to tell the other boards by.
/// Neither it nor the Full lists Wi-Fi, so a missing Wi-Fi chip only rules out a Full whose OLED
/// failed. The ATX board, the thing the web UI cares about, cannot be detected.
fn looks_like_lite(hardware: Option<&str>, has_oled: bool, has_wifi: bool) -> bool {
    hardware == Some("beta") && !has_oled && !has_wifi
}

fn get_hardware_version() -> String {
    match read_trimmed(HARDWARE_VERSION_FILE).as_deref() {
        Some("beta") => "Beta",
        Some("pcie") => "PCIE",
        Some("alpha") | None => "Alpha",
        Some(_) => "Alpha",
    }
    .to_string()
}

/// The longest host name the kernel keeps.
const HOSTNAME_MAX_LEN: usize = 64;

/// A host name, or a fully-qualified one such as host.network.net: dot-separated labels of
/// letters, digits and hyphens.
fn validate_hostname(hostname: &str) -> Result<()> {
    if hostname.is_empty()
        || hostname.len() > HOSTNAME_MAX_LEN
        || !hostname.split('.').all(valid_hostname_label)
    {
        return Err(AppError::BadRequest("invalid hostname".to_string()));
    }
    Ok(())
}

/// `hosts` with every name field equal to `old` changed to `new`. Addresses, comments and other
/// names that merely contain `old` stay as they are.
fn replace_host_name(hosts: &str, old: &str, new: &str) -> String {
    let mut out = String::with_capacity(hosts.len());
    for line in hosts.split_inclusive('\n') {
        let (entry, comment) = line.split_at(line.find('#').unwrap_or(line.len()));
        let mut rest = entry;
        let mut fields = 0;
        while !rest.is_empty() {
            let token_len = rest.find(char::is_whitespace).unwrap_or(rest.len());
            let (token, after) = rest.split_at(token_len);
            if !token.is_empty() {
                fields += 1;
            }
            let is_name = fields > 1 && token.eq_ignore_ascii_case(old);
            out.push_str(if is_name { new } else { token });
            let space_len = after
                .find(|c: char| !c.is_whitespace())
                .unwrap_or(after.len());
            out.push_str(&after[..space_len]);
            rest = &after[space_len..];
        }
        out.push_str(comment);
    }
    out
}

fn valid_hostname_label(label: &str) -> bool {
    !label.is_empty()
        && label.len() <= 63
        && !label.starts_with('-')
        && !label.ends_with('-')
        && label
            .bytes()
            .all(|byte| byte.is_ascii_alphanumeric() || byte == b'-')
}

fn read_trimmed(path: &str) -> Option<String> {
    if !Path::new(path).exists() {
        return None;
    }
    fs::read_to_string(path)
        .ok()
        .map(|value| value.trim().to_string())
        .filter(|value| !value.is_empty())
}

fn read_memory_limit() -> Result<i64> {
    let value = read_trimmed(GO_MEM_LIMIT_FILE)
        .ok_or_else(|| AppError::Internal("memory limit file is empty".to_string()))?;
    value
        .parse::<i64>()
        .map_err(|_| AppError::Internal("invalid memory limit".to_string()))
}

fn normalize_memory_limit(limit: i64) -> Result<i64> {
    if !(1..=4096).contains(&limit) {
        return Err(AppError::BadRequest("invalid memory limit".to_string()));
    }
    Ok(limit.max(50))
}

fn get_swap_size() -> i64 {
    fs::metadata(SWAP_FILE)
        .map(|metadata| (metadata.len() / 1024 / 1024) as i64)
        .unwrap_or(0)
}

// The swap file and its inittab line live on the root filesystem, which a raw system update
// replaces. The size kept on /boot, which the update carries over, is what S01fs makes the swap
// file from again.
const SWAP_FLAG: &str = "/boot/swap.size";

fn write_swap_flag(size: i64) {
    let result = if size > 0 {
        fs::write(SWAP_FLAG, format!("{size}\n"))
    } else {
        match fs::remove_file(SWAP_FLAG) {
            Err(err) if err.kind() != std::io::ErrorKind::NotFound => Err(err),
            _ => Ok(()),
        }
    };
    match result {
        // SAFETY: sync() takes no arguments and has no failure mode.
        Ok(()) => unsafe { nix::libc::sync() },
        Err(err) => tracing::warn!(error = %err, "failed to record the swap size on /boot"),
    }
}

/// Swap switched on before this was recorded keeps working across the next update.
pub fn record_swap_at_startup() {
    tokio::task::spawn_blocking(|| {
        let size = get_swap_size();
        // size 0 may only mean the swap file is not back yet after a boot, so it never removes
        if validate_swap_size(size).is_ok()
            && size > 0
            && fs::read_to_string(SWAP_FLAG).ok().as_deref().map(str::trim)
                != Some(size.to_string().as_str())
        {
            write_swap_flag(size);
        }
    });
}

// Free space the root filesystem keeps after the swap file is made.
const SWAP_FREE_MARGIN_MB: i64 = 32;

fn swap_fits(size: i64, available_mb: i64) -> bool {
    size + SWAP_FREE_MARGIN_MB <= available_mb
}

fn swap_available_mb() -> i64 {
    let free = nix::sys::statvfs::statvfs("/")
        .map(|stat| (stat.blocks_available() * stat.fragment_size()) >> 20)
        .unwrap_or(0) as i64;
    free + get_swap_size()
}

fn validate_swap_size(size: i64) -> Result<()> {
    match size {
        0 | 64 | 128 | 256 => Ok(()),
        _ => Err(AppError::BadRequest("invalid swap size".to_string())),
    }
}

async fn enable_swap(size: i64) -> Result<()> {
    if get_swap_size() > 0 {
        disable_swap().await?;
    }

    run_checked(
        AllowedCommand::Fallocate,
        vec!["-l".to_string(), format!("{size}M"), SWAP_FILE.to_string()],
        Duration::from_secs(15),
        "create swap file failed",
    )
    .await?;
    #[cfg(unix)]
    {
        use std::os::unix::fs::PermissionsExt;
        fs::set_permissions(SWAP_FILE, fs::Permissions::from_mode(0o600))?;
    }
    run_checked(
        AllowedCommand::Mkswap,
        [SWAP_FILE],
        Duration::from_secs(10),
        "format swap failed",
    )
    .await?;
    run_checked(
        AllowedCommand::Swapon,
        [SWAP_FILE],
        Duration::from_secs(10),
        "enable swap failed",
    )
    .await
}

async fn disable_swap() -> Result<()> {
    if is_swap_active() {
        run_checked(
            AllowedCommand::Swapoff,
            [SWAP_FILE],
            Duration::from_secs(10),
            "disable swap failed",
        )
        .await?;
    }
    remove_file_if_exists(SWAP_FILE)
}

fn is_swap_active() -> bool {
    fs::read_to_string("/proc/swaps")
        .ok()
        .map(|content| {
            content
                .lines()
                .skip(1)
                .filter_map(|line| line.split_whitespace().next())
                .any(|path| path == SWAP_FILE)
        })
        .unwrap_or(false)
}

fn enable_swap_inittab() -> Result<()> {
    let input = fs::read_to_string(INITTAB_PATH)?;
    let mut output = remove_swap_inittab_lines(&input);
    if !output.is_empty() {
        output.push('\n');
    }
    output.push_str(SWAP_INITTAB_LINE);
    output.push('\n');
    write_inittab(&output)
}

fn disable_swap_inittab() -> Result<()> {
    let input = fs::read_to_string(INITTAB_PATH)?;
    let output = remove_swap_inittab_lines(&input);
    write_inittab(&output)
}

fn remove_swap_inittab_lines(input: &str) -> String {
    input
        .lines()
        .filter(|line| !line.trim_end().ends_with(SWAP_FILE))
        .collect::<Vec<_>>()
        .join("\n")
}

fn write_inittab(content: &str) -> Result<()> {
    fs::write(TEMP_INITTAB_PATH, content.as_bytes())?;
    fs::rename(TEMP_INITTAB_PATH, INITTAB_PATH)?;
    Ok(())
}

#[derive(Debug, Clone)]
struct HardwareGpio {
    reset: String,
    power: String,
    power_led: String,
    hdd_led: Option<String>,
}

fn hardware_gpio() -> HardwareGpio {
    match read_trimmed(HARDWARE_VERSION_FILE).as_deref() {
        Some("beta") | Some("pcie") => HardwareGpio {
            reset: "/sys/class/gpio/gpio505/value".to_string(),
            power: "/sys/class/gpio/gpio503/value".to_string(),
            power_led: "/sys/class/gpio/gpio504/value".to_string(),
            hdd_led: None,
        },
        _ => HardwareGpio {
            reset: "/sys/class/gpio/gpio507/value".to_string(),
            power: "/sys/class/gpio/gpio503/value".to_string(),
            power_led: "/sys/class/gpio/gpio504/value".to_string(),
            hdd_led: Some("/sys/class/gpio/gpio505/value".to_string()),
        },
    }
}

fn read_gpio(path: &str) -> Result<bool> {
    let value = fs::read_to_string(path)?;
    let value = value.trim().parse::<i32>().map_err(|_| {
        AppError::Internal(format!(
            "invalid gpio value in {}",
            Path::new(path).display()
        ))
    })?;
    Ok(value == 0)
}

/// Lines with a pulse in progress. A second pulse on the same line would cut
/// the first one short, or turn one long press into two.
static PULSING: std::sync::Mutex<Vec<String>> = std::sync::Mutex::new(Vec::new());

/// Press a power or reset line for `duration`, then release it. The pulse runs
/// in its own task, so a lost client cannot leave the button pressed. If that
/// task is dropped, as at backend shutdown, its guard still releases the line.
async fn write_gpio_pulse(path: &str, duration: Duration) -> Result<()> {
    let line = PulseLine::claim(path)?;
    let (reply, done) = tokio::sync::oneshot::channel();
    tokio::spawn(async move {
        drop(reply.send(pulse(line, duration).await));
    });
    done.await
        .map_err(|_| AppError::Internal("gpio pulse ended without a result".to_string()))?
}

async fn pulse(line: PulseLine, duration: Duration) -> Result<()> {
    let pressed = Pressed::press(line)?;
    time::sleep(duration).await;
    pressed.release()
}

/// Exclusive use of one GPIO line until dropped.
struct PulseLine(String);

impl PulseLine {
    fn claim(path: &str) -> Result<Self> {
        let mut pulsing = PULSING
            .lock()
            .unwrap_or_else(|poisoned| poisoned.into_inner());
        if pulsing.iter().any(|line| line == path) {
            return Err(AppError::Conflict(
                "a power or reset pulse is already in progress".to_string(),
            ));
        }
        pulsing.push(path.to_string());
        Ok(Self(path.to_string()))
    }
}

impl Drop for PulseLine {
    fn drop(&mut self) {
        let mut pulsing = PULSING
            .lock()
            .unwrap_or_else(|poisoned| poisoned.into_inner());
        pulsing.retain(|line| line != &self.0);
    }
}

/// A pressed line. Dropped without `release`, it still writes 0.
struct Pressed(Option<PulseLine>);

impl Pressed {
    fn press(line: PulseLine) -> Result<Self> {
        if let Err(error) = fs::write(&line.0, b"1") {
            // The line state is unknown after a failed write: release it.
            let _ = fs::write(&line.0, b"0");
            return Err(error.into());
        }
        Ok(Self(Some(line)))
    }

    fn release(mut self) -> Result<()> {
        match self.0.take() {
            Some(line) => release(&line.0),
            None => Ok(()),
        }
    }
}

impl Drop for Pressed {
    fn drop(&mut self) {
        if let Some(line) = self.0.take() {
            let _ = release(&line.0);
        }
    }
}

fn release(path: &str) -> Result<()> {
    fs::write(path, b"0").map_err(|error| {
        tracing::error!(%error, "gpio line release failed; the button may stay pressed");
        AppError::from(error)
    })
}

fn persist_hdmi_enabled() -> Result<()> {
    remove_file_if_exists(HDMI_DISABLE_FILE)
}

fn persist_hdmi_disabled() -> Result<()> {
    fs::write(HDMI_DISABLE_FILE, b"")?;
    Ok(())
}

fn avahi_daemon_pid() -> Option<String> {
    read_trimmed(AVAHI_DAEMON_PID).filter(|pid| valid_pid(pid))
}

fn valid_pid(pid: &str) -> bool {
    !pid.is_empty() && pid.bytes().all(|byte| byte.is_ascii_digit())
}

/// The host writes the partition from now on. Stopping the gadget dropped any lock the host
/// held on a mounted image, so release it: /data cannot go read-only while the LUN holds a
/// file on it open.
async fn release_data_for_host() -> Result<()> {
    storage::release_lun().await?;
    storage::set_data_writable(false).await
}

async fn run_usbdev(action: &'static str) -> Result<()> {
    run_checked(
        AllowedCommand::ServiceUsbDev,
        [action],
        Duration::from_secs(10),
        "usb gadget update failed",
    )
    .await
}

async fn run_checked<I, S>(
    command: AllowedCommand,
    args: I,
    timeout: Duration,
    message: &'static str,
) -> Result<()>
where
    I: IntoIterator<Item = S>,
    S: AsRef<std::ffi::OsStr>,
{
    let output = run_allowed(command, args, timeout).await?;
    if output.status != 0 {
        return Err(AppError::Internal(format!(
            "{message}: {}",
            String::from_utf8_lossy(&output.stderr).trim()
        )));
    }
    Ok(())
}

fn remove_file_if_exists(path: &str) -> Result<()> {
    match fs::remove_file(path) {
        Ok(()) => Ok(()),
        Err(err) if err.kind() == std::io::ErrorKind::NotFound => Ok(()),
        Err(err) => Err(err.into()),
    }
}

fn remove_dir_if_exists(path: &str) -> Result<()> {
    match fs::remove_dir_all(path) {
        Ok(()) => Ok(()),
        Err(err) if err.kind() == std::io::ErrorKind::NotFound => Ok(()),
        Err(err) => Err(err.into()),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn gpio_line(dir: &tempfile::TempDir, name: &str) -> (std::path::PathBuf, String) {
        let line = dir.path().join(name);
        fs::write(&line, b"0").unwrap();
        let path = line.to_str().unwrap().to_string();
        (line, path)
    }

    async fn pressed_within(line: &Path, limit: Duration) -> bool {
        let started = StdInstant::now();
        while started.elapsed() < limit {
            if fs::read(line).unwrap() == b"1" {
                return true;
            }
            time::sleep(Duration::from_millis(5)).await;
        }
        false
    }

    #[tokio::test(flavor = "multi_thread", worker_threads = 2)]
    async fn a_pulse_is_released_even_when_its_client_goes_away() {
        let dir = tempfile::tempdir().unwrap();
        let (line, path) = gpio_line(&dir, "power");
        let request = tokio::spawn({
            let path = path.clone();
            async move { write_gpio_pulse(&path, Duration::from_millis(300)).await }
        });
        assert!(pressed_within(&line, Duration::from_secs(1)).await);
        // An overlapping pulse on the same line is refused, not queued.
        assert!(matches!(
            write_gpio_pulse(&path, Duration::from_millis(50)).await,
            Err(AppError::Conflict(_))
        ));
        // The HTTP handler's future is dropped when its client goes away.
        request.abort();
        assert!(request.await.unwrap_err().is_cancelled());
        time::sleep(Duration::from_millis(500)).await;
        assert_eq!(fs::read(&line).unwrap(), b"0");
        // The line is free again once the pulse has ended.
        write_gpio_pulse(&path, Duration::from_millis(50))
            .await
            .unwrap();
        assert_eq!(fs::read(&line).unwrap(), b"0");
    }

    #[tokio::test(flavor = "multi_thread", worker_threads = 2)]
    async fn pulses_on_different_lines_overlap() {
        let dir = tempfile::tempdir().unwrap();
        let (power, power_path) = gpio_line(&dir, "power");
        let (reset, reset_path) = gpio_line(&dir, "reset");
        let first =
            tokio::spawn(
                async move { write_gpio_pulse(&power_path, Duration::from_millis(300)).await },
            );
        assert!(pressed_within(&power, Duration::from_secs(1)).await);
        write_gpio_pulse(&reset_path, Duration::from_millis(50))
            .await
            .unwrap();
        assert_eq!(fs::read(&reset).unwrap(), b"0");
        first.await.unwrap().unwrap();
        assert_eq!(fs::read(&power).unwrap(), b"0");
    }

    #[test]
    fn a_pulse_dropped_at_shutdown_still_releases_its_line() {
        let dir = tempfile::tempdir().unwrap();
        let (line, path) = gpio_line(&dir, "reset");
        let runtime = tokio::runtime::Builder::new_multi_thread()
            .worker_threads(1)
            .enable_time()
            .build()
            .unwrap();
        runtime.spawn({
            let path = path.clone();
            async move { write_gpio_pulse(&path, Duration::from_secs(30)).await }
        });
        let started = StdInstant::now();
        while fs::read(&line).unwrap() != b"1" {
            assert!(started.elapsed() < Duration::from_secs(1));
            std::thread::sleep(Duration::from_millis(5));
        }
        // Dropping the runtime drops the pulse task in the middle of its press.
        drop(runtime);
        assert_eq!(fs::read(&line).unwrap(), b"0");
        drop(PulseLine::claim(&path).unwrap());
    }

    #[test]
    fn a_reboot_is_needed_only_while_the_name_differs_from_the_boot_name() {
        assert!(!hostname_reboot_required(None, "kvm-1"));
        assert!(!hostname_reboot_required(Some("kvm-1"), "kvm-1"));
        assert!(hostname_reboot_required(Some("kvm-1"), "kvm-2"));
    }

    #[test]
    fn accepts_plain_and_fully_qualified_hostnames() {
        for name in [
            "kvm",
            "kvm-1",
            "KVM",
            "host.network.net",
            "a.b",
            "h1.n-2.net",
        ] {
            assert!(validate_hostname(name).is_ok(), "{name}");
        }
        // 64 bytes in all is the most the kernel keeps
        assert!(validate_hostname(&format!("{}.{}", "a".repeat(30), "b".repeat(33))).is_ok());
    }

    #[test]
    fn rejects_malformed_hostnames() {
        for name in [
            "",
            ".",
            ".host",
            "host.",
            "host..net",
            "-host",
            "host-",
            "host.-net",
            "host-.net",
            "ho_st",
            "host name",
            "host.net/x",
            "hôst",
        ] {
            assert!(validate_hostname(name).is_err(), "{name:?}");
        }
        // one label over 63 bytes, and a name over the kernel's 64
        assert!(validate_hostname(&"a".repeat(64)).is_err());
        assert!(validate_hostname(&format!("{}.{}", "a".repeat(64), "b")).is_err());
        assert!(validate_hostname(&format!("{}.{}", "a".repeat(40), "b".repeat(30))).is_err());
    }

    #[test]
    fn host_name_is_replaced_as_a_whole_field_only() {
        let hosts = "127.0.0.1\tlocalhost\n127.0.1.1 local local.lan # local box\n\n  ::1 localhost local\r\n";
        assert_eq!(
            replace_host_name(hosts, "local", "kvm"),
            "127.0.0.1\tlocalhost\n127.0.1.1 kvm local.lan # local box\n\n  ::1 localhost kvm\r\n"
        );
        assert_eq!(
            replace_host_name("127.0.1.1 KVM\n", "kvm", "desk"),
            "127.0.1.1 desk\n"
        );
        // the address column is never a name
        assert_eq!(
            replace_host_name("1.2.3.4 1.2.3.4\n", "1.2.3.4", "kvm"),
            "1.2.3.4 kvm\n"
        );
        assert_eq!(replace_host_name("", "kvm", "desk"), "");
    }

    #[test]
    fn validates_numeric_pids_only() {
        assert!(valid_pid("12345"));
        assert!(!valid_pid(""));
        assert!(!valid_pid("12x45"));
        assert!(!valid_pid("1;reboot"));
    }

    #[test]
    fn lite_is_a_beta_board_without_oled_and_wifi() {
        assert!(looks_like_lite(Some("beta"), false, false));
        assert!(!looks_like_lite(Some("beta"), true, false));
        assert!(!looks_like_lite(Some("beta"), false, true));
        assert!(!looks_like_lite(Some("alpha"), false, false));
        assert!(!looks_like_lite(Some("pcie"), false, false));
        assert!(!looks_like_lite(None, false, false));
    }

    #[test]
    fn beta_gpio_omits_hdd_led() {
        let gpio = HardwareGpio {
            reset: "/sys/class/gpio/gpio505/value".to_string(),
            power: "/sys/class/gpio/gpio503/value".to_string(),
            power_led: "/sys/class/gpio/gpio504/value".to_string(),
            hdd_led: None,
        };
        assert_eq!(gpio.reset, "/sys/class/gpio/gpio505/value");
        assert!(gpio.hdd_led.is_none());
    }

    #[test]
    fn normalizes_memory_limit() {
        assert_eq!(normalize_memory_limit(75).unwrap(), 75);
        assert_eq!(normalize_memory_limit(1).unwrap(), 50);
        assert!(normalize_memory_limit(0).is_err());
        assert!(normalize_memory_limit(4097).is_err());
    }

    #[test]
    fn validates_swap_sizes() {
        assert!(validate_swap_size(0).is_ok());
        assert!(validate_swap_size(64).is_ok());
        assert!(validate_swap_size(256).is_ok());
        assert!(validate_swap_size(512).is_err());
        assert!(validate_swap_size(123).is_err());
    }

    #[test]
    fn a_swap_file_leaves_free_space_behind() {
        assert!(swap_fits(128, 200));
        assert!(swap_fits(128, 160));
        assert!(!swap_fits(128, 159));
        assert!(!swap_fits(256, 110));
    }

    #[test]
    fn parses_terminal_resize_messages() {
        let size = parse_terminal_winsize(br#"{"rows":40,"cols":120}"#).unwrap();
        assert_eq!(size.ws_row, 40);
        assert_eq!(size.ws_col, 120);
        assert!(parse_terminal_winsize(br#"{"rows":0,"cols":120}"#).is_none());
        assert!(parse_terminal_winsize(b"not json").is_none());
    }

    #[test]
    fn empty_disk_flag_serves_data() {
        let dir = tempfile::tempdir().unwrap();
        let flag = dir.path().join("usb.disk0");
        assert!(!disk_flag_serves_data(&flag));
        fs::write(&flag, b"").unwrap();
        assert!(disk_flag_serves_data(&flag));
        fs::write(&flag, b"/data/image.iso").unwrap();
        assert!(!disk_flag_serves_data(&flag));
    }

    #[test]
    fn removes_swap_inittab_lines() {
        let input = "tty::respawn:/bin/login\nsi11::sysinit:/sbin/swapon /swapfile\n";
        assert_eq!(remove_swap_inittab_lines(input), "tty::respawn:/bin/login");
    }
}
