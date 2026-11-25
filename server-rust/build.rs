use std::{env, path::PathBuf, process::Command};

fn main() {
    let target = env::var("TARGET").unwrap_or_default();
    let linked_libkvm = env::var_os("CARGO_FEATURE_LINKED_LIBKVM").is_some();

    println!("cargo:rerun-if-env-changed=HNANOKVM_SYSROOT_LIB");
    println!("cargo:rustc-check-cfg=cfg(hnk_xtheadvector)");

    if target.contains("riscv64") {
        build_vector_chacha();
    }

    if !target.contains("riscv64") || !linked_libkvm {
        return;
    }

    let manifest_dir = PathBuf::from(env::var("CARGO_MANIFEST_DIR").expect("CARGO_MANIFEST_DIR"));
    let lib_dir = manifest_dir.join("native/dl_lib");
    let sysroot_lib_dir = env::var_os("HNANOKVM_SYSROOT_LIB")
        .map(PathBuf::from)
        .unwrap_or_else(|| manifest_dir.join("sysroot/lib"));

    println!("cargo:rustc-link-search=native={}", lib_dir.display());
    if sysroot_lib_dir.exists() {
        println!(
            "cargo:rustc-link-search=native={}",
            sysroot_lib_dir.display()
        );
    }
}

/// Assembles the XTheadVector ChaCha20 and the CRYPTOGAMS Poly1305 with GNU binutils (LLVM has
/// no XTheadVector); the Poly1305 source is generated from its perlasm. A device build fails
/// without them rather than quietly losing the vector TLS code.
fn build_vector_chacha() {
    const CHACHA: &str = "native/chacha20_xtheadvector.S";
    const POLY_PL: &str = "native/poly1305-riscv.pl";
    const POLY: &str = "native/poly1305_cryptogams.S";
    const POLY_VX: &str = "native/poly1305_xtheadvector.S";
    for src in [CHACHA, POLY_PL, POLY, POLY_VX] {
        println!("cargo:rerun-if-changed={src}");
    }
    println!("cargo:rerun-if-env-changed=HNANOKVM_XTHEADVECTOR_PREFIX");
    let prefix = env::var("HNANOKVM_XTHEADVECTOR_PREFIX")
        .unwrap_or_else(|_| "riscv64-linux-gnu-".to_string());
    let out = PathBuf::from(env::var("OUT_DIR").expect("OUT_DIR"));
    let run = |what: &str, cmd: &mut Command| match cmd.status() {
        Ok(status) if status.success() => {}
        Ok(status) => panic!("{what} failed ({status}); see HNANOKVM_XTHEADVECTOR_PREFIX"),
        Err(err) => panic!("{what}: {err}; the vector TLS code needs perl and {prefix}gcc"),
    };

    run(
        "perl poly1305-riscv.pl",
        Command::new("perl")
            .arg(POLY_PL)
            .arg("64")
            .arg(out.join("poly1305-riscv64.S")),
    );
    let objs = [
        (CHACHA, "chacha20_xtheadvector.o"),
        (POLY, "poly1305.o"),
        (POLY_VX, "poly1305_xtheadvector.o"),
    ];
    for (src, obj) in objs {
        run(
            &format!("{prefix}gcc {src}"),
            Command::new(format!("{prefix}gcc"))
                .args(["-march=rv64gc", "-mabi=lp64d", "-I"])
                .arg(&out)
                .args(["-c", src, "-o"])
                .arg(out.join(obj)),
        );
    }
    let lib = out.join("libhnk_vchacha.a");
    let _ = std::fs::remove_file(&lib);
    run(
        &format!("{prefix}ar"),
        Command::new(format!("{prefix}ar"))
            .arg("crs")
            .arg(&lib)
            .args(objs.map(|(_, obj)| out.join(obj))),
    );
    println!("cargo:rustc-link-search=native={}", out.display());
    println!("cargo:rustc-link-lib=static=hnk_vchacha");
    println!("cargo:rustc-cfg=hnk_xtheadvector");
}
