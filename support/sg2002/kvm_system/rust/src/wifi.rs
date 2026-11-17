//! Wi-Fi setup over the access point (system_ctrl.cpp) and the AP key (ap_key.h).

use crate::{Command, Platform, System};

const WIFI_CONNECTION_DELAY_MS: u64 = 5000;
const WIFI_TRY_CONNECT: &str = "/kvmapp/kvm/wifi_try_connect";

/// The AP key is the WPA2 passphrase and the provisioning key at once: ten characters
/// from 31 unambiguous symbols (~49 bits), read off the OLED.
pub(crate) const AP_KEY_CHARS: usize = 10;
const AP_KEY_ALPHABET: &[u8] = b"23456789abcdefghjkmnpqrstuvwxyz";

/// A fresh key from the CSPRNG, or None; there is no weaker fallback.
pub(crate) fn ap_key_generate(random: &mut dyn FnMut(&mut [u8]) -> bool) -> Option<String> {
    let size = AP_KEY_ALPHABET.len();
    // Bytes at or above the largest multiple of `size` are drawn again.
    let limit = 256 / size * size;
    let mut pool = [0u8; 32];
    let mut used = pool.len();
    let mut key = String::with_capacity(AP_KEY_CHARS);
    while key.len() < AP_KEY_CHARS {
        if used == pool.len() {
            if !random(&mut pool) {
                return None;
            }
            used = 0;
        }
        let byte = pool[used] as usize;
        used += 1;
        if byte < limit {
            key.push(AP_KEY_ALPHABET[byte % size] as char);
        }
    }
    pool.fill(0);
    Some(key)
}

/// The first output line containing `needle`, as `| grep needle | head -1` would give it.
fn first_line_with<'a>(out: &'a str, needle: &str) -> Option<&'a str> {
    out.lines().find(|l| l.contains(needle))
}

impl<P: Platform> System<P> {
    /// A phone has joined the AP.
    fn sta_connected(&mut self) -> bool {
        let out = self.p.run(Command::HostapdAllSta).unwrap_or_default();
        first_line_with(&out, "aid").is_some_and(|l| l.starts_with('a'))
    }

    fn wifi_connected(&mut self) -> bool {
        let out = self.p.run(Command::WpaStatus).unwrap_or_default();
        first_line_with(&out, "wpa_state").is_some_and(|l| l.contains("COMPLETED"))
    }

    fn take_credentials(&mut self) -> bool {
        if !self.p.exists(WIFI_TRY_CONNECT) {
            return false;
        }
        self.p.remove(WIFI_TRY_CONNECT);
        self.p.run(Command::WifiRestart);
        true
    }

    /// Credentials entered in the web UI while the status page shows.
    pub(crate) fn wifi_web_config_process(&mut self) {
        if self.take_credentials() {
            self.sys.wifi_config_process = if self.wifi_connected() { -1 } else { 0 };
        }
    }

    /// One step of AP setup: start the AP, wait for a phone, wait for credentials, connect.
    pub(crate) fn wifi_config_process(&mut self) {
        match self.sys.wifi_config_process {
            0 => {
                let p = &mut self.p;
                let Some(key) = ap_key_generate(&mut |buf| p.random(buf)) else {
                    println!("[kvms]WiFi AP not started: no random key");
                    self.sys.wifi_config_process = -1;
                    self.sys.sub_page = 6;
                    return;
                };
                self.sys.wifi_ap_pass = key;
                self.p.write("/kvmapp/kvm/ap.ssid", b"NanoKVM\n");
                if !self
                    .p
                    .write_secret("/kvmapp/kvm/ap.pass", self.sys.wifi_ap_pass.as_bytes())
                {
                    println!("[kvms]WiFi AP not started: key not stored");
                    self.sys.wifi_ap_pass.clear();
                    self.sys.wifi_config_process = -1;
                    self.sys.sub_page = 6;
                    return;
                }
                self.p.run(Command::WifiAp);
                self.sys.wifi_config_process = 1;
                self.sys.sub_page = 1;
            }
            1 => {
                if self.sta_connected() {
                    self.sys.wifi_config_process = 2;
                    self.sys.sub_page = 3;
                }
            }
            2 => {
                if self.take_credentials() {
                    self.sys.wifi_config_process = 3;
                    self.sys.sub_page = 5;
                }
            }
            3 => {
                // Give wpa_supplicant time without blocking keys or the display.
                let now = self.p.now_ms();
                let deadline = *self
                    .connect_deadline
                    .get_or_insert(now + WIFI_CONNECTION_DELAY_MS);
                if now < deadline {
                    return;
                }
                self.connect_deadline = None;
                if self.wifi_connected() {
                    self.sys.wifi_config_process = -1;
                    self.sys.page = 0;
                } else {
                    self.sys.wifi_config_process = 0;
                }
                self.sys.sub_page = 0;
            }
            _ => {}
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn key_uses_the_alphabet_and_rejects_high_bytes() {
        let mut calls = 0;
        let key = ap_key_generate(&mut |buf| {
            calls += 1;
            buf.fill(if calls == 1 { 255 } else { 31 });
            true
        })
        .unwrap();
        assert_eq!(key, "2222222222");
        assert_eq!(calls, 2);
    }

    #[test]
    fn key_fails_without_random() {
        assert_eq!(ap_key_generate(&mut |_| false), None);
    }
}
