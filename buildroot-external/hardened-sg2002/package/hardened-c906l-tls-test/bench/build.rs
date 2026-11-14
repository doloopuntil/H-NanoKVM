fn main() {
    let dir = std::env::var("MONOCYPHER_SRC").unwrap_or_else(|_| "monocypher/src".into());
    println!("cargo:rerun-if-env-changed=MONOCYPHER_SRC");
    cc::Build::new()
        .file(format!("{dir}/monocypher.c"))
        .include(&dir)
        .opt_level(2)
        .compile("monocypher");
}
