//! TLS 1.3 ChaCha20-Poly1305 records sealed and opened with XTheadVector code on the C906:
//! `native/chacha20_xtheadvector.S` and the CRYPTOGAMS Poly1305 (`native/poly1305-riscv.pl`,
//! vector port in `native/poly1305_xtheadvector.S`). ring keeps the handshake and every other
//! suite, and takes over if the vector code is missing, fails its self-check or refuses a record.

use std::sync::{
    OnceLock,
    atomic::{AtomicBool, Ordering},
};

use tokio_rustls::rustls::{
    CipherSuite, CipherSuiteCommon, ConnectionTrafficSecrets, ContentType, Error, ProtocolVersion,
    SupportedCipherSuite, Tls13CipherSuite,
    crypto::cipher::{
        AeadKey, InboundOpaqueMessage, InboundPlainMessage, Iv, MessageDecrypter, MessageEncrypter,
        Nonce, OutboundChunks, OutboundOpaqueMessage, OutboundPlainMessage, PrefixedPayload,
        Tls13AeadAlgorithm, UnsupportedOperationError, make_tls13_aad,
    },
};
use tracing::{info, warn};

const TAG_LEN: usize = 16;
/// Bytes the assembly handles per call: four 64-byte blocks.
const CHUNK: usize = 256;

/// Set when the vector code refuses a record; ring handles every record after that.
static DISABLED: AtomicBool = AtomicBool::new(false);

#[cfg(hnk_xtheadvector)]
unsafe extern "C" {
    fn hnk_chacha20_xor_xtheadvector(
        out: *mut u8,
        input: *const u8,
        chunks: usize,
        key: *const u32,
        nonce: *const u32,
        counter: u32,
        scratch: *mut u8,
    ) -> isize;
}

#[cfg(hnk_xtheadvector)]
#[repr(C, align(16))]
struct Scratch([u8; CHUNK]);

/// XORs `chunks` * 256 bytes of keystream into `data` in place.
#[cfg(hnk_xtheadvector)]
fn xor_chunks(key: &[u32; 8], nonce: &[u32; 3], counter: u32, data: &mut [u8]) -> bool {
    debug_assert_eq!(data.len() % CHUNK, 0);
    // The C906 traps on misaligned vector words, so the keystream goes through aligned scratch.
    let mut scratch = Scratch([0; CHUNK]);
    let ptr = data.as_mut_ptr();
    // SAFETY: ptr covers data.len() bytes, a whole number of chunks; in place is allowed;
    // key, nonce and scratch have the sizes the function reads and writes.
    let res = unsafe {
        hnk_chacha20_xor_xtheadvector(
            ptr,
            ptr,
            data.len() / CHUNK,
            key.as_ptr(),
            nonce.as_ptr(),
            counter,
            scratch.0.as_mut_ptr(),
        )
    };
    wipe(&mut scratch.0);
    res == 0
}

/// Scalar stand-in so the AEAD logic is tested on the build host.
#[cfg(not(hnk_xtheadvector))]
fn xor_chunks(key: &[u32; 8], nonce: &[u32; 3], counter: u32, data: &mut [u8]) -> bool {
    use chacha20::cipher::{KeyIvInit, StreamCipher, StreamCipherSeek};
    let mut k = [0u8; 32];
    let mut n = [0u8; 12];
    for (dst, w) in k.chunks_mut(4).zip(key) {
        dst.copy_from_slice(&w.to_le_bytes());
    }
    for (dst, w) in n.chunks_mut(4).zip(nonce) {
        dst.copy_from_slice(&w.to_le_bytes());
    }
    let mut cipher = chacha20::ChaCha20::new(&k.into(), &n.into());
    cipher.seek(u64::from(counter) * 64);
    cipher.apply_keystream(data);
    true
}

/// XORs the keystream from block `counter` on into `data`; refuses before writing anything if
/// the 32-bit block counter would wrap.
fn chacha20_xor(key: &[u32; 8], nonce: &[u32; 3], counter: u32, data: &mut [u8]) -> bool {
    let blocks = data.len().div_ceil(64) as u64;
    if u64::from(counter) + blocks.next_multiple_of(4) > u64::from(u32::MAX) {
        return false;
    }
    let full = data.len() - data.len() % CHUNK;
    let (head, rest) = data.split_at_mut(full);
    if !head.is_empty() && !xor_chunks(key, nonce, counter, head) {
        return false;
    }
    if rest.is_empty() {
        return true;
    }
    let mut tail = [0u8; CHUNK];
    tail[..rest.len()].copy_from_slice(rest);
    let ok = xor_chunks(key, nonce, counter + (full / 64) as u32, &mut tail);
    if ok {
        rest.copy_from_slice(&tail[..rest.len()]);
    }
    wipe(&mut tail);
    ok
}

/// Poly1305 with RFC 8439's zero padding: the CRYPTOGAMS assembly, vector from 192 bytes up.
#[cfg(hnk_xtheadvector)]
mod mac {
    unsafe extern "C" {
        fn hnk_poly1305_init(ctx: *mut u64, key: *const u8) -> i32;
        fn hnk_poly1305_blocks_vx(ctx: *mut u64, input: *const u8, len: usize, padbit: u32);
        fn hnk_poly1305_emit(ctx: *const u64, mac: *mut u8, nonce: *const u32);
    }

    pub struct Mac {
        /// h, r, s1, top_power and the key powers of the vector code: 192 bytes.
        ctx: [u64; 24],
        s: [u32; 4],
    }

    impl Mac {
        pub fn new(key: &[u8; 32]) -> Self {
            let mut ctx = [0u64; 24];
            // SAFETY: ctx is the zeroed 192-byte context; key points to 16 readable bytes of r.
            unsafe { hnk_poly1305_init(ctx.as_mut_ptr(), key.as_ptr()) };
            Self {
                ctx,
                s: super::words(&key[16..]),
            }
        }

        fn blocks(&mut self, data: &[u8]) {
            debug_assert_eq!(data.len() % 16, 0);
            // SAFETY: data is readable for its length, whole 16-byte blocks; ctx is initialised.
            unsafe { hnk_poly1305_blocks_vx(self.ctx.as_mut_ptr(), data.as_ptr(), data.len(), 1) };
        }

        pub fn update_padded(&mut self, data: &[u8]) {
            let full = data.len() & !15;
            if full > 0 {
                self.blocks(&data[..full]);
            }
            if full < data.len() {
                let mut block = [0u8; 16];
                block[..data.len() - full].copy_from_slice(&data[full..]);
                self.blocks(&block);
            }
        }

        pub fn finalize(&mut self) -> [u8; 16] {
            let mut tag = [0u8; 16];
            // SAFETY: ctx is initialised; tag has 16 bytes; s is the 16-byte nonce.
            unsafe { hnk_poly1305_emit(self.ctx.as_ptr(), tag.as_mut_ptr(), self.s.as_ptr()) };
            tag
        }
    }

    impl Drop for Mac {
        fn drop(&mut self) {
            for w in self.ctx.iter_mut() {
                // SAFETY: w is a valid, exclusive reference.
                unsafe { std::ptr::write_volatile(w, 0) };
            }
            for w in self.s.iter_mut() {
                // SAFETY: as above.
                unsafe { std::ptr::write_volatile(w, 0) };
            }
        }
    }
}

/// RustCrypto's Poly1305 on the build host, so the AEAD logic is tested there.
#[cfg(not(hnk_xtheadvector))]
mod mac {
    use poly1305::{
        Poly1305,
        universal_hash::{KeyInit, UniversalHash},
    };

    pub struct Mac(Option<Poly1305>);

    impl Mac {
        pub fn new(key: &[u8; 32]) -> Self {
            Self(Some(Poly1305::new(key.into())))
        }

        pub fn update_padded(&mut self, data: &[u8]) {
            if let Some(mac) = &mut self.0 {
                mac.update_padded(data);
            }
        }

        pub fn finalize(&mut self) -> [u8; 16] {
            self.0
                .take()
                .map(|mac| mac.finalize().into())
                .unwrap_or([0; 16])
        }
    }
}

fn words<const N: usize>(bytes: &[u8]) -> [u32; N] {
    let mut out = [0u32; N];
    for (word, chunk) in out.iter_mut().zip(bytes.as_chunks::<4>().0) {
        *word = u32::from_le_bytes(*chunk);
    }
    out
}

/// The RFC 8439 tag over `aad` and `data`, keyed by block 0.
fn tag(block0: &[u8; 64], aad: &[u8], data: &[u8]) -> [u8; TAG_LEN] {
    let mut mac = mac::Mac::new(block0[..32].try_into().expect("32 bytes"));
    mac.update_padded(aad);
    mac.update_padded(data);
    let mut lengths = [0u8; 16];
    lengths[..8].copy_from_slice(&(aad.len() as u64).to_le_bytes());
    lengths[8..].copy_from_slice(&(data.len() as u64).to_le_bytes());
    mac.update_padded(&lengths);
    mac.finalize()
}

/// RFC 8439 ChaCha20-Poly1305 seal: encrypts `data` in place and returns the tag.
fn seal_in_place(
    key: &[u8; 32],
    nonce: &[u8; 12],
    aad: &[u8],
    data: &mut [u8],
) -> Option<[u8; TAG_LEN]> {
    let mut k: [u32; 8] = words(key);
    let n: [u32; 3] = words(nonce);
    let mut block0 = [0u8; 64];
    let ok = chacha20_xor(&k, &n, 0, &mut block0) && chacha20_xor(&k, &n, 1, data);
    let sealed = ok.then(|| tag(&block0, aad, data));
    wipe(&mut block0);
    k.iter_mut().for_each(|w| *w = 0);
    sealed
}

/// What [`open_in_place`] found.
#[derive(Debug, PartialEq)]
enum Opened {
    /// Tag good, data decrypted; the plaintext length.
    Plain(usize),
    /// Tag wrong; data untouched.
    BadTag,
    /// The vector code refused; data untouched.
    Unavailable,
}

/// RFC 8439 ChaCha20-Poly1305 open: checks the tag at the end of `payload` in constant time,
/// then decrypts in place. Nothing is decrypted unless the tag matches.
fn open_in_place(key: &[u8; 32], nonce: &[u8; 12], aad: &[u8], payload: &mut [u8]) -> Opened {
    let Some(len) = payload.len().checked_sub(TAG_LEN) else {
        return Opened::BadTag;
    };
    let (data, received) = payload.split_at_mut(len);
    let mut k: [u32; 8] = words(key);
    let n: [u32; 3] = words(nonce);
    let mut block0 = [0u8; 64];
    let result = if !chacha20_xor(&k, &n, 0, &mut block0) {
        Opened::Unavailable
    } else {
        let mut expected = tag(&block0, aad, data);
        let good = tags_equal(&expected, received);
        wipe(&mut expected);
        if !good {
            Opened::BadTag
        } else if chacha20_xor(&k, &n, 1, data) {
            Opened::Plain(len)
        } else {
            Opened::Unavailable
        }
    };
    wipe(&mut block0);
    k.iter_mut().for_each(|w| *w = 0);
    result
}

/// Compares two tags without branching on their contents.
fn tags_equal(a: &[u8; TAG_LEN], b: &[u8]) -> bool {
    let diff = a.iter().zip(b).fold(0u8, |acc, (x, y)| acc | (x ^ y));
    std::hint::black_box(diff) == 0 && b.len() == TAG_LEN
}

fn cpu_has_xtheadvector() -> bool {
    std::fs::read_to_string("/proc/cpuinfo").is_ok_and(|info| {
        info.lines()
            .any(|line| line.starts_with("isa") && line.contains("xtheadvector"))
    })
}

/// Seals records with ring and with the vector code and compares them, then opens ring's
/// records and refuses each with one bit changed.
fn self_check(ring: &dyn Tls13AeadAlgorithm) -> bool {
    let key: [u8; 32] = std::array::from_fn(|i| i as u8 + 1);
    let data: Vec<u8> = (0..16_385u32).map(|i| (i * 31 + 7) as u8).collect();
    let (mut reference, mut ours) = encrypters(ring, key);
    let (_, mut opener) = decrypters(ring, key);
    [0, 1, 63, 64, 191, 192, 255, 256, 257, 1000, 4095, 16_384]
        .into_iter()
        .enumerate()
        .all(|(seq, len)| {
            let seq = seq as u64;
            let msg = || OutboundPlainMessage {
                typ: ContentType::ApplicationData,
                version: ProtocolVersion::TLSv1_2,
                payload: OutboundChunks::Single(&data[..len]),
            };
            let (Ok(a), Ok(b)) = (ours.encrypt(msg(), seq), reference.encrypt(msg(), seq)) else {
                return false;
            };
            if a.payload.as_ref() != b.payload.as_ref() {
                return false;
            }
            let mut wire = b.encode();
            let mut bad = wire.clone();
            let last = bad.len() - 1;
            bad[last] ^= 1;
            let opened = opener
                .decrypt(inbound(&mut wire), seq)
                .is_ok_and(|m| m.payload == &data[..len] && m.typ == ContentType::ApplicationData);
            opened && opener.decrypt(inbound(&mut bad), seq).is_err()
        })
        && !DISABLED.load(Ordering::Relaxed)
}

/// An encoded record (5-byte header + payload) as rustls hands it to a decrypter.
fn inbound(wire: &mut [u8]) -> InboundOpaqueMessage<'_> {
    InboundOpaqueMessage::new(
        ContentType::ApplicationData,
        ProtocolVersion::TLSv1_2,
        &mut wire[5..],
    )
}

/// ring's encrypter and ours for the same key and IV.
fn encrypters(
    ring: &dyn Tls13AeadAlgorithm,
    key: [u8; 32],
) -> (Box<dyn MessageEncrypter>, Box<dyn MessageEncrypter>) {
    let iv = || Iv::copy(&[9u8; 12]);
    let ours = VectorEncrypter {
        key,
        iv: iv(),
        ring: ring.encrypter(AeadKey::from(key), iv()),
    };
    (ring.encrypter(AeadKey::from(key), iv()), Box::new(ours))
}

/// ring's decrypter and ours for the same key and IV.
fn decrypters(
    ring: &dyn Tls13AeadAlgorithm,
    key: [u8; 32],
) -> (Box<dyn MessageDecrypter>, Box<dyn MessageDecrypter>) {
    let iv = || Iv::copy(&[9u8; 12]);
    let ours = VectorDecrypter {
        key,
        iv: iv(),
        ring: ring.decrypter(AeadKey::from(key), iv()),
    };
    (ring.decrypter(AeadKey::from(key), iv()), Box::new(ours))
}

/// ring's TLS 1.3 ChaCha20 suite with the vector encrypter and decrypter, when the CPU has
/// XTheadVector and the code passes its self-check; any other suite unchanged.
pub fn wrap(suite: SupportedCipherSuite) -> SupportedCipherSuite {
    static WRAPPED: OnceLock<Option<&'static Tls13CipherSuite>> = OnceLock::new();
    let SupportedCipherSuite::Tls13(ring) = suite else {
        return suite;
    };
    if ring.common.suite != CipherSuite::TLS13_CHACHA20_POLY1305_SHA256 {
        return suite;
    }
    let wrapped = WRAPPED.get_or_init(|| {
        if !cpu_has_xtheadvector() {
            return None;
        }
        if !self_check(ring.aead_alg) {
            warn!("vector ChaCha20-Poly1305 failed its self-check; ring handles TLS records");
            return None;
        }
        info!("TLS ChaCha20-Poly1305 records use the vector code");
        let aead: &'static VectorAead = Box::leak(Box::new(VectorAead(ring.aead_alg)));
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

struct VectorAead(&'static dyn Tls13AeadAlgorithm);

impl Tls13AeadAlgorithm for VectorAead {
    fn encrypter(&self, key: AeadKey, iv: Iv) -> Box<dyn MessageEncrypter> {
        let mut bytes = [0u8; 32];
        bytes.copy_from_slice(key.as_ref());
        Box::new(VectorEncrypter {
            key: bytes,
            iv: Iv::copy(iv.as_ref()),
            ring: self.0.encrypter(key, iv),
        })
    }

    fn decrypter(&self, key: AeadKey, iv: Iv) -> Box<dyn MessageDecrypter> {
        let mut bytes = [0u8; 32];
        bytes.copy_from_slice(key.as_ref());
        Box::new(VectorDecrypter {
            key: bytes,
            iv: Iv::copy(iv.as_ref()),
            ring: self.0.decrypter(key, iv),
        })
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

struct VectorEncrypter {
    key: [u8; 32],
    iv: Iv,
    ring: Box<dyn MessageEncrypter>,
}

impl Drop for VectorEncrypter {
    fn drop(&mut self) {
        wipe(&mut self.key);
    }
}

impl VectorEncrypter {
    fn seal(&self, msg: &OutboundPlainMessage<'_>, seq: u64) -> Option<OutboundOpaqueMessage> {
        // the plaintext, its content type byte, the tag
        let total = msg.payload.len() + 1 + TAG_LEN;
        let mut payload = PrefixedPayload::with_capacity(total);
        payload.extend_from_chunks(&msg.payload);
        payload.extend_from_slice(&[u8::from(msg.typ)]);
        let nonce = Nonce::new(&self.iv, seq).0;
        let tag = seal_in_place(&self.key, &nonce, &make_tls13_aad(total), payload.as_mut())?;
        payload.extend_from_slice(&tag);
        Some(OutboundOpaqueMessage::new(
            ContentType::ApplicationData,
            ProtocolVersion::TLSv1_2,
            payload,
        ))
    }
}

impl MessageEncrypter for VectorEncrypter {
    fn encrypt(
        &mut self,
        msg: OutboundPlainMessage<'_>,
        seq: u64,
    ) -> Result<OutboundOpaqueMessage, Error> {
        if !DISABLED.load(Ordering::Relaxed)
            && let Some(sealed) = self.seal(&msg, seq)
        {
            return Ok(sealed);
        }
        if !DISABLED.swap(true, Ordering::Relaxed) {
            warn!("vector ChaCha20-Poly1305 refused a record; ring handles TLS records now");
        }
        self.ring.encrypt(msg, seq)
    }

    fn encrypted_payload_len(&self, payload_len: usize) -> usize {
        self.ring.encrypted_payload_len(payload_len)
    }
}

struct VectorDecrypter {
    key: [u8; 32],
    iv: Iv,
    ring: Box<dyn MessageDecrypter>,
}

impl Drop for VectorDecrypter {
    fn drop(&mut self) {
        wipe(&mut self.key);
    }
}

impl MessageDecrypter for VectorDecrypter {
    fn decrypt<'a>(
        &mut self,
        mut msg: InboundOpaqueMessage<'a>,
        seq: u64,
    ) -> Result<InboundPlainMessage<'a>, Error> {
        if DISABLED.load(Ordering::Relaxed) {
            return self.ring.decrypt(msg, seq);
        }
        let payload = &mut msg.payload;
        if payload.len() < TAG_LEN {
            return Err(Error::DecryptError);
        }
        let nonce = Nonce::new(&self.iv, seq).0;
        let aad = make_tls13_aad(payload.len());
        match open_in_place(&self.key, &nonce, &aad, payload) {
            Opened::Plain(len) => {
                payload.truncate(len);
                msg.into_tls13_unpadded_message()
            }
            Opened::BadTag => Err(Error::DecryptError),
            Opened::Unavailable => {
                if !DISABLED.swap(true, Ordering::Relaxed) {
                    warn!(
                        "vector ChaCha20-Poly1305 refused a record; ring handles TLS records now"
                    );
                }
                self.ring.decrypt(msg, seq)
            }
        }
    }
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

    fn ring_alg() -> &'static dyn Tls13AeadAlgorithm {
        let SupportedCipherSuite::Tls13(ring) =
            tokio_rustls::rustls::crypto::ring::cipher_suite::TLS13_CHACHA20_POLY1305_SHA256
        else {
            unreachable!()
        };
        ring.aead_alg
    }

    fn plain(data: &[u8]) -> OutboundPlainMessage<'_> {
        OutboundPlainMessage {
            typ: ContentType::ApplicationData,
            version: ProtocolVersion::TLSv1_2,
            payload: OutboundChunks::Single(data),
        }
    }

    #[test]
    fn the_self_check_passes() {
        assert!(self_check(ring_alg()));
    }

    #[test]
    fn seals_like_ring_at_every_length() {
        let data: Vec<u8> = (0..1200u32).map(|i| (i * 13) as u8).collect();
        let (mut ring, mut ours) = encrypters(ring_alg(), [3u8; 32]);
        for len in 0..data.len() {
            let a = ring.encrypt(plain(&data[..len]), len as u64).unwrap();
            let b = ours.encrypt(plain(&data[..len]), len as u64).unwrap();
            assert_eq!(a.payload.as_ref(), b.payload.as_ref(), "length {len}");
        }
    }

    #[test]
    fn opens_what_ring_seals_at_every_length() {
        let data: Vec<u8> = (0..1200u32).map(|i| (i * 7 + 1) as u8).collect();
        let (mut ring, _) = encrypters(ring_alg(), [4u8; 32]);
        let (_, mut ours) = decrypters(ring_alg(), [4u8; 32]);
        for len in 0..data.len() {
            let mut wire = ring
                .encrypt(plain(&data[..len]), len as u64)
                .unwrap()
                .encode();
            let opened = ours.decrypt(inbound(&mut wire), len as u64).unwrap();
            assert_eq!(opened.payload, &data[..len], "length {len}");
        }
    }

    #[test]
    fn refuses_tampered_records_and_leaves_them_untouched() {
        let data = vec![0x5au8; 700];
        let (mut ring, _) = encrypters(ring_alg(), [6u8; 32]);
        let (_, mut ours) = decrypters(ring_alg(), [6u8; 32]);
        let wire = ring.encrypt(plain(&data), 3).unwrap().encode();
        // first and middle ciphertext bytes, the last before the tag, inside the tag
        for at in [5, 300, wire.len() - 17, wire.len() - 1] {
            let mut bad = wire.clone();
            bad[at] ^= 0x80;
            let before = bad.clone();
            assert!(ours.decrypt(inbound(&mut bad), 3).is_err(), "byte {at}");
            assert_eq!(bad, before, "byte {at} changed the buffer");
        }
        let mut good = wire.clone();
        assert!(
            ours.decrypt(inbound(&mut good), 4).is_err(),
            "wrong sequence"
        );
        let mut short = wire[..5 + 15].to_vec();
        assert!(
            ours.decrypt(inbound(&mut short), 3).is_err(),
            "shorter than a tag"
        );
        let mut good = wire.clone();
        assert!(ours.decrypt(inbound(&mut good), 3).is_ok());
    }

    #[test]
    fn a_counter_that_would_wrap_is_refused_untouched() {
        let mut data = [7u8; 128];
        assert!(!chacha20_xor(&[0; 8], &[0; 3], u32::MAX - 1, &mut data));
        assert_eq!(data, [7u8; 128]);
    }

    #[test]
    fn tags_compare_by_content_and_length() {
        let a = [1u8; TAG_LEN];
        assert!(tags_equal(&a, &[1u8; TAG_LEN]));
        let mut b = [1u8; TAG_LEN];
        b[TAG_LEN - 1] = 0;
        assert!(!tags_equal(&a, &b));
        assert!(!tags_equal(&a, &[1u8; TAG_LEN - 1]));
    }
}
