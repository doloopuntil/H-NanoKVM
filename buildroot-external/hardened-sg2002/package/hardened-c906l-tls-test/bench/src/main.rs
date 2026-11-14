//! ChaCha20-Poly1305 on 16 KiB TLS records: ring (the server's), RustCrypto and Monocypher
//! (the test firmware's), checked against each other.
use std::time::Instant;

use chacha20poly1305::{AeadInPlace, ChaCha20Poly1305, KeyInit};
use ring::aead;

unsafe extern "C" {
    fn crypto_aead_init_ietf(ctx: *mut u8, key: *const u8, nonce: *const u8);
    fn crypto_aead_write(
        ctx: *mut u8,
        cipher: *mut u8,
        mac: *mut u8,
        ad: *const u8,
        ad_len: usize,
        plain: *const u8,
        len: usize,
    );
}

const LEN: usize = 16384 + 1;
const ROUNDS: usize = 400;

fn nonce(i: usize) -> [u8; 12] {
    let mut n = [0u8; 12];
    n[4..].copy_from_slice(&(i as u64).to_le_bytes());
    n
}

fn report(name: &str, start: Instant) {
    let secs = start.elapsed().as_secs_f64();
    let mb = (LEN * ROUNDS) as f64 / 1e6;
    println!("{name:<12} {:6.1} MB/s  {:7.1} us per record", mb / secs, secs * 1e6 / ROUNDS as f64);
}

fn main() {
    let key = [7u8; 32];
    let aad = [0x17, 0x03, 0x03, ((LEN + 16) >> 8) as u8, (LEN + 16) as u8];
    let plain: Vec<u8> = (0..LEN).map(|i| (i * 31 + 7) as u8).collect();

    let ring_key = aead::LessSafeKey::new(aead::UnboundKey::new(&aead::CHACHA20_POLY1305, &key).unwrap());
    let rc_key = ChaCha20Poly1305::new(&key.into());

    // Check that all three agree on one record.
    let mut a = plain.clone();
    ring_key
        .seal_in_place_append_tag(aead::Nonce::assume_unique_for_key(nonce(1)), aead::Aad::from(aad), &mut a)
        .unwrap();
    let mut b = plain.clone();
    let tag = rc_key.encrypt_in_place_detached(&nonce(1).into(), &aad, &mut b).unwrap();
    b.extend_from_slice(&tag);
    let mut c = vec![0u8; LEN + 16];
    let mut ctx = [0u8; 64];
    unsafe {
        crypto_aead_init_ietf(ctx.as_mut_ptr(), key.as_ptr(), nonce(1).as_ptr());
        crypto_aead_write(ctx.as_mut_ptr(), c.as_mut_ptr(), c.as_mut_ptr().add(LEN), aad.as_ptr(), aad.len(), plain.as_ptr(), LEN);
    }
    assert_eq!(a, b, "ring and RustCrypto differ");
    assert_eq!(a, c, "ring and Monocypher differ");
    println!("outputs agree; {ROUNDS} records of {LEN} bytes");

    let mut buf = Vec::with_capacity(LEN + 16);
    let t = Instant::now();
    for i in 0..ROUNDS {
        buf.clear();
        buf.extend_from_slice(&plain);
        ring_key
            .seal_in_place_append_tag(aead::Nonce::assume_unique_for_key(nonce(i)), aead::Aad::from(aad), &mut buf)
            .unwrap();
    }
    report("ring", t);

    let t = Instant::now();
    for i in 0..ROUNDS {
        buf.clear();
        buf.extend_from_slice(&plain);
        let tag = rc_key.encrypt_in_place_detached(&nonce(i).into(), &aad, &mut buf).unwrap();
        std::hint::black_box(tag);
    }
    report("rustcrypto", t);

    let t = Instant::now();
    for i in 0..ROUNDS {
        unsafe {
            crypto_aead_init_ietf(ctx.as_mut_ptr(), key.as_ptr(), nonce(i).as_ptr());
            crypto_aead_write(ctx.as_mut_ptr(), c.as_mut_ptr(), c.as_mut_ptr().add(LEN), aad.as_ptr(), aad.len(), plain.as_ptr(), LEN);
        }
    }
    report("monocypher", t);

    let t = Instant::now();
    for _ in 0..ROUNDS {
        c[..LEN].copy_from_slice(std::hint::black_box(&plain));
    }
    report("copy", t);
}
