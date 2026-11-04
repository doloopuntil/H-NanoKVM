use base64::{Engine as _, engine::general_purpose::URL_SAFE_NO_PAD};
/// Fills `buf` from the OS random source; panics if it fails.
pub fn fill_random(buf: &mut [u8]) {
    getrandom::fill(buf).expect("OS random source failed");
}

pub fn random_bytes(len: usize) -> Vec<u8> {
    let mut bytes = vec![0_u8; len];
    fill_random(&mut bytes);
    bytes
}

pub fn random_token(bytes_len: usize) -> String {
    URL_SAFE_NO_PAD.encode(random_bytes(bytes_len))
}
