#[cfg(target_os = "linux")]
fn main() {
    kvm_system::System::new(kvm_system::linux::Linux::new()).run();
}

#[cfg(not(target_os = "linux"))]
fn main() {
    eprintln!("kvm-system runs on Linux only");
    std::process::exit(1);
}
