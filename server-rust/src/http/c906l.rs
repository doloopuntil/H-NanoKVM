//! Experiment (docs/development/c906l-send-tls.md): large outgoing TLS 1.3 ChaCha20-Poly1305
//! records are sealed on the C906L through /dev/c906l-tls; ring does everything else, and takes
//! over for good after any device error.

use std::{
    fs::{File, OpenOptions},
    os::fd::AsRawFd,
    sync::{
        OnceLock,
        atomic::{AtomicBool, AtomicU64, Ordering},
    },
};

use tokio_rustls::rustls::{
    CipherSuite, CipherSuiteCommon, ConnectionTrafficSecrets, ContentType, Error, ProtocolVersion,
    SupportedCipherSuite, Tls13CipherSuite,
    crypto::cipher::{
        AeadKey, Iv, MessageDecrypter, MessageEncrypter, Nonce, OutboundOpaqueMessage,
        OutboundPlainMessage, PrefixedPayload, Tls13AeadAlgorithm, UnsupportedOperationError,
        make_tls13_aad,
    },
};
use tracing::{info, warn};

const DEVICE: &str = "/dev/c906l-tls";
const TAG_LEN: usize = 16;
/// Smaller records are not worth a round trip to the other core.
const MIN_LEN: usize = 4096;
/// The device's slot size: a full TLS 1.3 record and its content type.
const MAX_LEN: usize = 16640;

/// Mirrors `struct c9_seal_ioc` in the test module.
#[repr(C)]
struct SealReq {
    src: u64,
    dst: u64,
    len: u32,
    aad_len: u32,
    key: [u8; 32],
    nonce: [u8; 12],
    aad: [u8; 13],
    pad: [u8; 7],
}

nix::ioctl_readwrite!(c9_seal, b'C', 0x90, SealReq);

static DISABLED: AtomicBool = AtomicBool::new(false);
static OFFLOADED: AtomicU64 = AtomicU64::new(0);

fn device() -> Option<&'static File> {
    static FILE: OnceLock<Option<File>> = OnceLock::new();
    FILE.get_or_init(|| OpenOptions::new().read(true).write(true).open(DEVICE).ok())
        .as_ref()
}

/// Whether records are being sealed on the C906L.
pub fn active() -> bool {
    device().is_some() && !DISABLED.load(Ordering::Relaxed)
}

/// ring's TLS 1.3 ChaCha20 suite with the C906L encrypter, when the device is there.
pub fn wrap(suite: SupportedCipherSuite) -> SupportedCipherSuite {
    static WRAPPED: OnceLock<Option<&'static Tls13CipherSuite>> = OnceLock::new();
    let SupportedCipherSuite::Tls13(ring) = suite else {
        return suite;
    };
    if ring.common.suite != CipherSuite::TLS13_CHACHA20_POLY1305_SHA256 {
        return suite;
    }
    let wrapped = WRAPPED.get_or_init(|| {
        device()?;
        info!("TLS records of the video are sealed on the C906L ({DEVICE})");
        let aead: &'static OffloadAead = Box::leak(Box::new(OffloadAead(ring.aead_alg)));
        Some(Box::leak(Box::new(Tls13CipherSuite {
            common: CipherSuiteCommon {
                suite: ring.common.suite,
                hash_provider: ring.common.hash_provider,
                confidentiality_limit: ring.common.confidentiality_limit,
            },
            hkdf_provider: ring.hkdf_provider,
            aead_alg: aead,
            quic: None,
        })))
    });
    match wrapped {
        Some(wrapped) => SupportedCipherSuite::Tls13(wrapped),
        None => suite,
    }
}

struct OffloadAead(&'static dyn Tls13AeadAlgorithm);

impl Tls13AeadAlgorithm for OffloadAead {
    fn encrypter(&self, key: AeadKey, iv: Iv) -> Box<dyn MessageEncrypter> {
        let mut bytes = [0u8; 32];
        bytes.copy_from_slice(key.as_ref());
        let iv_copy = Iv::copy(iv.as_ref());
        Box::new(OffloadEncrypter {
            key: bytes,
            iv: iv_copy,
            ring: self.0.encrypter(key, iv),
        })
    }

    fn decrypter(&self, key: AeadKey, iv: Iv) -> Box<dyn MessageDecrypter> {
        self.0.decrypter(key, iv)
    }

    fn key_len(&self) -> usize {
        self.0.key_len()
    }

    fn extract_keys(
        &self,
        key: AeadKey,
        iv: Iv,
    ) -> Result<ConnectionTrafficSecrets, UnsupportedOperationError> {
        self.0.extract_keys(key, iv)
    }
}

struct OffloadEncrypter {
    key: [u8; 32],
    iv: Iv,
    ring: Box<dyn MessageEncrypter>,
}

impl Drop for OffloadEncrypter {
    fn drop(&mut self) {
        wipe(&mut self.key);
    }
}

impl MessageEncrypter for OffloadEncrypter {
    fn encrypt(
        &mut self,
        msg: OutboundPlainMessage<'_>,
        seq: u64,
    ) -> Result<OutboundOpaqueMessage, Error> {
        // the plaintext and its content type byte
        let len = msg.payload.len() + 1;
        if msg.typ != ContentType::ApplicationData
            || !(MIN_LEN..=MAX_LEN).contains(&len)
            || DISABLED.load(Ordering::Relaxed)
        {
            return self.ring.encrypt(msg, seq);
        }

        let total = len + TAG_LEN;
        let mut payload = PrefixedPayload::with_capacity(total);
        payload.extend_from_chunks(&msg.payload);
        payload.extend_from_slice(&[u8::from(msg.typ)]);
        payload.extend_from_slice(&[0; TAG_LEN]);
        let nonce = Nonce::new(&self.iv, seq).0;
        match seal(
            payload.as_mut(),
            len,
            &self.key,
            &nonce,
            &make_tls13_aad(total),
        ) {
            Ok(()) => {
                if OFFLOADED.fetch_add(1, Ordering::Relaxed) == 0 {
                    info!("first TLS record sealed on the C906L");
                }
                Ok(OutboundOpaqueMessage::new(
                    ContentType::ApplicationData,
                    ProtocolVersion::TLSv1_2,
                    payload,
                ))
            }
            Err(err) => {
                DISABLED.store(true, Ordering::Relaxed);
                warn!(error = %err, "C906L sealing failed; ring seals from now on");
                self.ring.encrypt(msg, seq)
            }
        }
    }

    fn encrypted_payload_len(&self, payload_len: usize) -> usize {
        self.ring.encrypted_payload_len(payload_len)
    }
}

/// Seals `buf[..len]` in place and writes the tag after it; blocks until the C906L answers.
fn seal(
    buf: &mut [u8],
    len: usize,
    key: &[u8; 32],
    nonce: &[u8; 12],
    aad: &[u8; 5],
) -> nix::Result<()> {
    let file = device().ok_or(nix::Error::ENODEV)?;
    if buf.len() < len + TAG_LEN {
        return Err(nix::Error::EINVAL);
    }
    let mut req = SealReq {
        src: buf.as_ptr() as u64,
        dst: buf.as_mut_ptr() as u64,
        len: len as u32,
        aad_len: aad.len() as u32,
        key: *key,
        nonce: *nonce,
        aad: [0; 13],
        pad: [0; 7],
    };
    req.aad[..aad.len()].copy_from_slice(aad);
    // SAFETY: req is a valid SealReq; src and dst point into buf, which holds len + TAG_LEN bytes.
    let res = unsafe { c9_seal(file.as_raw_fd(), &mut req) };
    wipe(&mut req.key);
    res.map(drop)
}

fn wipe(bytes: &mut [u8]) {
    for b in bytes.iter_mut() {
        // SAFETY: b is a valid, exclusive reference.
        unsafe { std::ptr::write_volatile(b, 0) };
    }
    std::sync::atomic::compiler_fence(Ordering::SeqCst);
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn layout_matches_the_module() {
        assert_eq!(std::mem::size_of::<SealReq>(), 88);
        assert_eq!(std::mem::offset_of!(SealReq, key), 24);
        assert_eq!(std::mem::offset_of!(SealReq, aad), 68);
    }

    #[test]
    fn no_device_leaves_the_suite_alone() {
        let suite =
            tokio_rustls::rustls::crypto::ring::cipher_suite::TLS13_CHACHA20_POLY1305_SHA256;
        if device().is_none() {
            let SupportedCipherSuite::Tls13(a) = suite else {
                panic!()
            };
            let SupportedCipherSuite::Tls13(b) = wrap(suite) else {
                panic!()
            };
            assert!(std::ptr::eq(a, b));
        }
    }
}
