use axum::{
    extract::State,
    http::{HeaderMap, StatusCode, Uri, header},
    response::{IntoResponse, Redirect, Response},
};
use nanokvm_rust_server::{
    api::{compatibility, cpu_clock, monitor, picoclaw, system_firewall, tls_switch, vm},
    config::Config,
    ffi::kvm,
    hdmi_idle,
    http::{
        cert_manager, routes,
        tls::{self, ClientAddr},
    },
    state::AppState,
    update::keys::install_bundled_update_trust,
    ws::hid as hid_ws,
};
use std::{
    fs, io,
    net::Ipv6Addr,
    os::unix::fs::PermissionsExt,
    path::{Path, PathBuf},
    process,
};
use tokio::{
    net::TcpListener,
    time::{self, Duration},
};
use tracing::{info, warn};
use tracing_subscriber::{EnvFilter, fmt};

const BOOT_INIT_SCRIPTS: &[&str] = &[
    "S00kmod",
    "S01fs",
    "S01syslogd",
    "S02klogd",
    "S02watchdog",
    "S03usbdev",
    "S15kvmhwd",
    "S30eth",
    "S30wifi",
    "S40firewall",
    "S45wireguard",
    "S49ntp",
    "S50avahi-daemon",
    "S50sshd",
    "S80dnsmasq",
    "S95nanokvm",
];
#[cfg(all(target_arch = "riscv64", target_env = "musl"))]
#[global_allocator]
static GLOBAL: mimalloc::MiMalloc = mimalloc::MiMalloc;

const KVM_SHUTDOWN_TIMEOUT: Duration = Duration::from_secs(4);
const BUNDLED_UPDATE_TRUST_DIR: &str = "/kvmapp/system/keys";

// One worker on the one core. Timers and sockets are otherwise checked only every 61 task
// turns while tasks stay ready, so a busy upload held the video's frame timer for seconds.
const RUNTIME_EVENT_INTERVAL: u32 = 2;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    tokio::runtime::Builder::new_multi_thread()
        .worker_threads(1)
        .event_interval(RUNTIME_EVENT_INTERVAL)
        .enable_all()
        .build()?
        .block_on(run())
}

async fn run() -> Result<(), Box<dyn std::error::Error>> {
    init_tracing();
    tls::install_crypto_provider();

    let config = Config::load()?;
    config.log_runtime_warnings();
    install_runtime_boot_scripts();
    install_runtime_update_trust(&config);
    picoclaw::enforce_policy_at_start();
    cpu_clock::reconcile_at_startup();
    vm::record_swap_at_startup();
    monitor::start_sampler();
    initialize_kvm();
    hdmi_idle::start();
    hid_ws::start_keyboard_led_reader();
    hid_ws::start_persisted_mouse_jiggler();
    install_shutdown_signal_handler();

    tls_switch::resume_at_startup();
    system_firewall::roll_back_unconfirmed_at_start().await;

    if config.proto == "https" {
        run_https(config).await?;
    } else {
        run_http(config).await?;
    }

    Ok(())
}

fn install_runtime_update_trust(config: &Config) {
    match install_bundled_update_trust(
        Path::new(BUNDLED_UPDATE_TRUST_DIR),
        &config.paths.system_update_public_key,
    ) {
        Ok(0) => {}
        Ok(changed) => info!(changed, "installed bundled system update trust"),
        Err(err) => warn!(error = %err, "failed to install bundled system update trust"),
    }
}

fn install_shutdown_signal_handler() {
    tokio::spawn(async {
        shutdown_signal().await;
        warn!("shutdown signal received; deinitializing NanoKVM video backend");

        match time::timeout(
            KVM_SHUTDOWN_TIMEOUT,
            tokio::task::spawn_blocking(kvm::shutdown),
        )
        .await
        {
            Ok(Ok(Ok(()))) => info!("deinitialized NanoKVM video backend"),
            Ok(Ok(Err(err))) => warn!(error = ?err, "NanoKVM video backend deinit failed"),
            Ok(Err(err)) => warn!(error = ?err, "NanoKVM video backend deinit task failed"),
            Err(_) => warn!("NanoKVM video backend deinit timed out"),
        }

        process::exit(0);
    });
}

async fn shutdown_signal() {
    let ctrl_c = async {
        if let Err(err) = tokio::signal::ctrl_c().await {
            warn!(error = ?err, "failed to listen for Ctrl-C");
        }
    };

    #[cfg(unix)]
    {
        let terminate = async {
            match tokio::signal::unix::signal(tokio::signal::unix::SignalKind::terminate()) {
                Ok(mut signal) => {
                    signal.recv().await;
                }
                Err(err) => warn!(error = ?err, "failed to listen for SIGTERM"),
            }
        };

        tokio::select! {
            _ = ctrl_c => {},
            _ = terminate => {},
        }
    }

    #[cfg(not(unix))]
    {
        ctrl_c.await;
    }
}

fn install_runtime_boot_scripts() {
    for script in BOOT_INIT_SCRIPTS {
        let src = Path::new("/kvmapp/system/init.d").join(script);
        let dst = Path::new("/etc/init.d").join(script);
        match install_runtime_boot_script(&src, &dst) {
            Ok(true) => info!(
                source = %src.display(),
                target = %dst.display(),
                "installed runtime boot script"
            ),
            Ok(false) => {}
            Err(err) => warn!(
                source = %src.display(),
                target = %dst.display(),
                error = %err,
                "failed to install runtime boot script"
            ),
        }
    }
}

fn install_runtime_boot_script(src: &Path, dst: &Path) -> io::Result<bool> {
    if !src.is_file() {
        return Ok(false);
    }

    if let Ok(meta) = fs::symlink_metadata(dst) {
        if !meta.file_type().is_file() {
            return Err(io::Error::other("target exists but is not a regular file"));
        }
        if fs::read(src)? == fs::read(dst)? {
            fs::set_permissions(dst, fs::Permissions::from_mode(0o755))?;
            return Ok(false);
        }
    }

    let temp = temp_boot_script_path(dst)?;
    fs::copy(src, &temp)?;
    fs::set_permissions(&temp, fs::Permissions::from_mode(0o755))?;
    fs::rename(&temp, dst)?;
    Ok(true)
}

fn temp_boot_script_path(dst: &Path) -> io::Result<PathBuf> {
    let file_name = dst
        .file_name()
        .and_then(|name| name.to_str())
        .ok_or_else(|| io::Error::other("target has invalid file name"))?;
    Ok(dst.with_file_name(format!(".{file_name}.tmp")))
}

fn initialize_kvm() {
    vm::init_atx_lines();
    match kvm::init() {
        Ok(()) => info!("initialized NanoKVM video backend"),
        Err(err) => warn!(error = ?err, "NanoKVM video backend initialization failed"),
    }
}

async fn run_http(config: Config) -> Result<(), Box<dyn std::error::Error>> {
    let addr = config.listen_addr()?;
    let state = AppState::new(config).await?;

    if state.config.needs_dedicated_loopback_listener() {
        spawn_http_listener(
            state.config.loopback_listen_addr(),
            routes::build(state.clone()),
            "starting dedicated loopback HTTP listener",
        )
        .await?;
    }

    let app = routes::build(state).into_make_service_with_connect_info::<ClientAddr>();
    let listener = TcpListener::bind(addr).await?;
    info!(%addr, "starting NanoKVM Rust backend");
    axum::serve(listener, app).await?;
    Ok(())
}

async fn run_https(config: Config) -> Result<(), Box<dyn std::error::Error>> {
    let http_addr = config.listen_addr()?;
    let https_addr = config.https_listen_addr()?;
    let (tls_config, cert_resolver) = cert_manager::load_server_config(&config)?;
    let state = AppState::new(config).await?;
    cert_manager::spawn(cert_resolver);

    if state.config.needs_dedicated_loopback_listener() {
        spawn_http_listener(
            state.config.loopback_listen_addr(),
            https_redirect_app(state.clone()),
            "starting dedicated loopback HTTP to HTTPS redirect listener",
        )
        .await?;
    }

    spawn_http_listener(
        http_addr,
        https_redirect_app(state.clone()),
        "starting HTTP to HTTPS redirect listener",
    )
    .await?;

    let app = routes::build(state).into_make_service_with_connect_info::<ClientAddr>();
    let listener = TcpListener::bind(https_addr).await?;
    let tls_listener = tls::TlsListener::new(listener, tls_config)?;
    info!(addr = %https_addr, "starting NanoKVM Rust HTTPS backend");
    axum::serve(tls_listener, app).await?;
    Ok(())
}

async fn spawn_http_listener(
    addr: std::net::SocketAddr,
    app: axum::Router,
    message: &'static str,
) -> Result<(), Box<dyn std::error::Error>> {
    let listener = TcpListener::bind(addr).await?;
    tokio::spawn(async move {
        let service = app.into_make_service_with_connect_info::<ClientAddr>();
        info!(%addr, "{message}");
        if let Err(err) = axum::serve(listener, service).await {
            warn!(%addr, error = ?err, "HTTP listener stopped");
        }
    });
    Ok(())
}

fn https_redirect_app(state: AppState) -> axum::Router {
    routes::picoclaw_loopback_routes()
        // The S95nanokvm watchdog asks every 10 s; over HTTP it costs no handshake.
        .route("/api/health", axum::routing::get(compatibility::health))
        .fallback(redirect_to_https)
        .with_state(state)
}

async fn redirect_to_https(
    State(state): State<AppState>,
    headers: HeaderMap,
    uri: Uri,
) -> Response {
    let https_port = state.config.port.https;
    let host = headers
        .get(header::HOST)
        .and_then(|value| value.to_str().ok())
        .unwrap_or("localhost");
    // The redirect names only a host or an address literal from the request:
    // never a path, user info or anything else a Host header can carry.
    let Some(host) = redirect_host(host, https_port) else {
        return StatusCode::BAD_REQUEST.into_response();
    };
    let target = format!(
        "https://{host}{}",
        uri.path_and_query()
            .map(|value| value.as_str())
            .unwrap_or("/")
    );
    Redirect::temporary(&target).into_response()
}

fn redirect_host(request_host: &str, https_port: u16) -> Option<String> {
    let host = host_without_port(request_host)?;
    if host.contains(':') {
        host.parse::<Ipv6Addr>().ok()?;
    } else if host.is_empty()
        || host.len() > 253
        || !host.split('.').all(|label| {
            !label.is_empty()
                && label.len() <= 63
                && label
                    .bytes()
                    .all(|byte| byte.is_ascii_alphanumeric() || byte == b'-' || byte == b'_')
        })
    {
        return None;
    }

    Some(if https_port == 443 {
        if host.contains(':') {
            format!("[{host}]")
        } else {
            host
        }
    } else if host.contains(':') {
        format!("[{host}]:{https_port}")
    } else {
        format!("{host}:{https_port}")
    })
}

/// The host of a Host header with its port removed; `None` when what follows
/// the host is not a port.
fn host_without_port(request_host: &str) -> Option<String> {
    let is_port = |port: &str| port.parse::<u16>().is_ok();
    if let Some(rest) = request_host.strip_prefix('[') {
        let (host, after) = rest.split_once(']')?;
        host.parse::<Ipv6Addr>().ok()?;
        return (after.is_empty() || after.strip_prefix(':').is_some_and(is_port))
            .then(|| host.to_string());
    }

    if let Some((host, port)) = request_host.rsplit_once(':')
        && !host.contains(':')
    {
        return is_port(port).then(|| host.to_string());
    }

    Some(request_host.to_string())
}

fn init_tracing() {
    let filter = EnvFilter::try_from_default_env().unwrap_or_else(|_| EnvFilter::new("info"));
    fmt().with_env_filter(filter).init();
}

#[cfg(test)]
mod tests {
    use super::redirect_host;

    #[test]
    fn redirect_host_replaces_http_port() {
        assert_eq!(
            redirect_host("10.0.87.133:80", 443).as_deref(),
            Some("10.0.87.133")
        );
        assert_eq!(
            redirect_host("10.0.87.133:80", 8443).as_deref(),
            Some("10.0.87.133:8443")
        );
        assert_eq!(
            redirect_host("kvm-1234.local", 443).as_deref(),
            Some("kvm-1234.local")
        );
    }

    #[test]
    fn redirect_host_handles_ipv6() {
        assert_eq!(redirect_host("[::1]:80", 443).as_deref(), Some("[::1]"));
        assert_eq!(
            redirect_host("[::1]:80", 8443).as_deref(),
            Some("[::1]:8443")
        );
        assert_eq!(
            redirect_host("[fe80::1]", 443).as_deref(),
            Some("[fe80::1]")
        );
    }

    #[test]
    fn redirect_host_refuses_what_is_not_a_host() {
        for host in [
            "",
            "evil.example/path",
            "user@evil.example",
            "evil.example:80@other",
            "kvm.local:http",
            "kvm.local:99999",
            "[::1]evil",
            "[not-an-address]",
            "two words",
            "kvm..local",
            "kvm.local\\evil",
            "%65vil.example",
        ] {
            assert_eq!(redirect_host(host, 443), None, "{host:?}");
        }
    }
}
