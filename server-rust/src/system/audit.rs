use std::os::unix::net::UnixDatagram;

const SYSLOG_SOCKET: &str = "/dev/log";
const TAG: &str = "hardened-nanokvm-auth";

pub fn test_message(source: &str) {
    emit(
        14,
        &format!(
            "hardened-nanokvm: test syslog message source={}",
            sanitize(source)
        ),
    );
}

pub fn login_success(username: &str, source_ip: &str) {
    emit(
        86,
        &format!(
            "{TAG}: web login success user={} source={}",
            sanitize(username),
            sanitize(source_ip)
        ),
    );
}

pub fn login_failure(username: &str, source_ip: &str, reason: &str) {
    emit(
        84,
        &format!(
            "{TAG}: web login failure user={} source={} reason={}",
            sanitize(username),
            sanitize(source_ip),
            sanitize(reason)
        ),
    );
}

pub fn totp_enrolled(username: &str) {
    emit(
        85,
        &format!(
            "{TAG}: two-factor auth enrolled user={}",
            sanitize(username)
        ),
    );
}

pub fn totp_disabled(username: &str) {
    emit(
        84,
        &format!(
            "{TAG}: two-factor auth disabled user={}",
            sanitize(username)
        ),
    );
}

pub fn totp_backup_codes_regenerated(username: &str) {
    emit(
        85,
        &format!(
            "{TAG}: two-factor backup codes regenerated user={}",
            sanitize(username)
        ),
    );
}

pub fn system_update_local_key_set(username: &str) {
    emit(
        84,
        &format!(
            "{TAG}: local system update key registered user={}",
            sanitize(username)
        ),
    );
}

pub fn system_update_local_key_removed(username: &str) {
    emit(
        85,
        &format!(
            "{TAG}: local system update key removed user={}",
            sanitize(username)
        ),
    );
}

pub fn system_update_uploaded(username: &str, signer: &str, version: &str) {
    emit(
        85,
        &format!(
            "{TAG}: system update uploaded user={} signer={} version={}",
            sanitize(username),
            sanitize(signer),
            sanitize(version)
        ),
    );
}

pub fn application_update_uploaded(username: &str, signer: &str, version: &str) {
    emit(
        85,
        &format!(
            "{TAG}: application update uploaded user={} signer={} version={}",
            sanitize(username),
            sanitize(signer),
            sanitize(version)
        ),
    );
}

pub fn application_update_installed(username: &str, signer: &str, version: &str) {
    emit(
        85,
        &format!(
            "{TAG}: application update installed user={} signer={} version={}",
            sanitize(username),
            sanitize(signer),
            sanitize(version)
        ),
    );
}

pub fn remote_download_changed(username: &str, source_ip: &str, enabled: bool) {
    emit(
        84,
        &format!(
            "{TAG}: remote image download {} user={} source={}",
            if enabled { "enabled" } else { "disabled" },
            sanitize(username),
            sanitize(source_ip)
        ),
    );
}

pub fn trusted_proxies_changed(username: &str, source_ip: &str, proxies: &[String]) {
    emit(
        84,
        &format!(
            "{TAG}: trusted proxies changed to [{}] user={} source={}",
            sanitize(&proxies.join(",")),
            sanitize(username),
            sanitize(source_ip)
        ),
    );
}

pub fn wireguard_changed(source_ip: &str, enabled: bool) {
    emit(
        85,
        &format!(
            "{TAG}: wireguard settings changed enabled={enabled} source={}",
            sanitize(source_ip)
        ),
    );
}

pub fn wireguard_key_set(source_ip: &str) {
    emit(
        85,
        &format!(
            "{TAG}: wireguard private key set source={}",
            sanitize(source_ip)
        ),
    );
}

pub fn wireguard_key_removed(source_ip: &str) {
    emit(
        84,
        &format!(
            "{TAG}: wireguard private key removed source={}",
            sanitize(source_ip)
        ),
    );
}

fn emit(priority: u8, message: &str) {
    let payload = format!("<{priority}>{message}");
    let Ok(socket) = UnixDatagram::unbound() else {
        return;
    };
    let _ = socket.send_to(payload.as_bytes(), SYSLOG_SOCKET);
}

fn sanitize(value: &str) -> String {
    value
        .chars()
        .filter_map(|ch| {
            if ch.is_ascii_graphic() && ch != '"' && ch != '\'' && ch != '\\' {
                Some(ch)
            } else if ch.is_ascii_whitespace() {
                Some('_')
            } else {
                None
            }
        })
        .take(128)
        .collect()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn sanitizes_audit_fields() {
        assert_eq!(sanitize("admin root\nx"), "admin_root_x");
        assert_eq!(sanitize("bad\"quote"), "badquote");
    }
}
