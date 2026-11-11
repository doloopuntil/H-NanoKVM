use std::{
    collections::HashMap,
    net::IpAddr,
    time::{Duration, Instant},
};

#[derive(Debug, Clone)]
struct Attempt {
    failures: u32,
    lockout_until: Option<Instant>,
    last_failure: Instant,
}

/// A source may fail this many times the per-name limit across all names before it is locked
/// out for every name, so rotating names gets around nothing.
const SOURCE_BUDGET_FACTOR: u32 = 4;
/// Entries kept in each map at most. Past this the oldest leave first, and an entry that still
/// locks someone out leaves last.
const MAX_ENTRIES: usize = 1024;

#[derive(Debug)]
pub struct LoginRateLimiter {
    max_failures: u32,
    lockout_duration: Duration,
    attempts: HashMap<String, Attempt>,
    sources: HashMap<String, Attempt>,
}

impl LoginRateLimiter {
    pub fn new(max_failures: u32, lockout_duration_secs: u64) -> Self {
        Self {
            max_failures: max_failures.max(1),
            lockout_duration: Duration::from_secs(lockout_duration_secs.max(1)),
            attempts: HashMap::new(),
            sources: HashMap::new(),
        }
    }

    pub fn check(&mut self, source_ip: &str, username: &str) -> bool {
        self.prune();
        let now = Instant::now();
        let locked = |attempt: Option<&Attempt>| {
            attempt
                .and_then(|attempt| attempt.lockout_until)
                .is_some_and(|until| now < until)
        };
        locked(self.attempts.get(&key(source_ip, username)))
            || locked(self.sources.get(&source_key(source_ip)))
    }

    pub fn record_failure(&mut self, source_ip: &str, username: &str) -> bool {
        self.prune();
        let now = Instant::now();
        let name = bump(
            &mut self.attempts,
            key(source_ip, username),
            self.max_failures,
            self.lockout_duration,
            now,
        );
        let all = bump(
            &mut self.sources,
            source_key(source_ip),
            self.max_failures.saturating_mul(SOURCE_BUDGET_FACTOR),
            self.lockout_duration,
            now,
        );
        name || all
    }

    pub fn record_success(&mut self, source_ip: &str, username: &str) {
        self.attempts.remove(&key(source_ip, username));
        self.sources.remove(&source_key(source_ip));
    }

    fn prune(&mut self) {
        let now = Instant::now();
        let lockout = self.lockout_duration;
        let current = |attempt: &Attempt| {
            if let Some(until) = attempt.lockout_until {
                now < until
            } else {
                now.duration_since(attempt.last_failure) <= lockout
            }
        };
        self.attempts.retain(|_, attempt| current(attempt));
        self.sources.retain(|_, attempt| current(attempt));
    }
}

/// Count one failure against `key`; true when it now locks.
fn bump(
    map: &mut HashMap<String, Attempt>,
    key: String,
    limit: u32,
    lockout: Duration,
    now: Instant,
) -> bool {
    if !map.contains_key(&key) && map.len() >= MAX_ENTRIES {
        let oldest = map
            .iter()
            .min_by_key(|(_, attempt)| (attempt.lockout_until.is_some(), attempt.last_failure))
            .map(|(key, _)| key.clone());
        if let Some(oldest) = oldest {
            map.remove(&oldest);
        }
    }
    let attempt = map.entry(key).or_insert(Attempt {
        failures: 0,
        lockout_until: None,
        last_failure: now,
    });
    if now.duration_since(attempt.last_failure) > lockout {
        attempt.failures = 0;
        attempt.lockout_until = None;
    }
    attempt.failures += 1;
    attempt.last_failure = now;
    if attempt.failures >= limit {
        attempt.lockout_until = Some(now + lockout);
        return true;
    }
    false
}

// The source a lockout applies to: an IPv4 address, or the /64 network of an IPv6 address,
// through which one host can rotate freely. IPv4-mapped addresses count as their IPv4 address.
fn source_key(source_ip: &str) -> String {
    match source_ip.parse::<IpAddr>() {
        Ok(IpAddr::V4(v4)) => v4.to_string(),
        Ok(IpAddr::V6(v6)) => match v6.to_ipv4_mapped() {
            Some(v4) => v4.to_string(),
            None => {
                let s = v6.segments();
                format!("{:x}:{:x}:{:x}:{:x}::/64", s[0], s[1], s[2], s[3])
            }
        },
        Err(_) => source_ip.to_string(),
    }
}

fn key(source_ip: &str, username: &str) -> String {
    format!("{} {username}", source_key(source_ip))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn rotating_names_locks_the_source_for_every_name() {
        let mut limiter = LoginRateLimiter::new(5, 60);
        for name in 0..19 {
            assert!(!limiter.record_failure("192.0.2.7", &format!("guess{name}")));
        }
        assert!(!limiter.check("192.0.2.7", "admin"));
        assert!(limiter.record_failure("192.0.2.7", "guess19"));
        for name in ["admin", "reauth:admin", "never-tried"] {
            assert!(limiter.check("192.0.2.7", name), "{name}");
        }
        assert!(!limiter.check("192.0.2.8", "admin"));
        limiter.record_success("192.0.2.7", "admin");
        assert!(!limiter.check("192.0.2.7", "never-tried"));
    }

    #[test]
    fn the_maps_stay_bounded_and_keep_a_lockout_longest() {
        let source = |n: u32| std::net::Ipv4Addr::from(0x0a00_0000 + n).to_string();
        let mut limiter = LoginRateLimiter::new(1, 60);
        assert!(limiter.record_failure("198.51.100.1", "admin"));
        let mut unlocked = LoginRateLimiter::new(5, 60);
        for n in 0..3000u32 {
            limiter.record_failure(&source(n), &format!("name{n}"));
            unlocked.record_failure(&source(n), &format!("name{n}"));
        }
        assert!(limiter.attempts.len() <= MAX_ENTRIES);
        assert!(limiter.sources.len() <= MAX_ENTRIES);
        assert!(unlocked.attempts.len() <= MAX_ENTRIES);
        // with a limit of one every entry locks, so the oldest lockout leaves
        assert!(!limiter.check("198.51.100.1", "admin"));

        let mut kept = LoginRateLimiter::new(2, 60);
        assert!(!kept.record_failure("198.51.100.1", "admin"));
        assert!(kept.record_failure("198.51.100.1", "admin"));
        for n in 0..3000u32 {
            kept.record_failure(&source(n), "admin");
        }
        assert!(
            kept.check("198.51.100.1", "admin"),
            "a lockout left before entries that lock nothing"
        );
    }

    #[test]
    fn locks_after_threshold() {
        let mut limiter = LoginRateLimiter::new(2, 60);
        assert!(!limiter.record_failure("1.2.3.4", "admin"));
        assert!(limiter.record_failure("1.2.3.4", "admin"));
        assert!(limiter.check("1.2.3.4", "admin"));
        assert!(!limiter.check("1.2.3.4", "other"));
    }

    #[test]
    fn an_ipv6_network_shares_one_lockout() {
        let mut limiter = LoginRateLimiter::new(2, 60);
        assert!(!limiter.record_failure("2001:db8:1:2::1", "admin"));
        // another address of the same /64 counts against the same budget
        assert!(limiter.record_failure("2001:db8:1:2:aaaa:bbbb:cccc:dddd", "admin"));
        assert!(limiter.check("2001:db8:1:2::99", "admin"));
        // a different /64, and a different user, are separate
        assert!(!limiter.check("2001:db8:1:3::1", "admin"));
        assert!(!limiter.check("2001:db8:1:2::1", "other"));
    }

    #[test]
    fn an_ipv4_mapped_address_counts_as_its_ipv4_address() {
        let mut limiter = LoginRateLimiter::new(1, 60);
        assert!(limiter.record_failure("::ffff:192.0.2.7", "admin"));
        assert!(limiter.check("192.0.2.7", "admin"));
        assert!(!limiter.check("192.0.2.8", "admin"));
    }
}
