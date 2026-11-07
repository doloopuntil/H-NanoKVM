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

#[derive(Debug)]
pub struct LoginRateLimiter {
    max_failures: u32,
    lockout_duration: Duration,
    attempts: HashMap<String, Attempt>,
}

impl LoginRateLimiter {
    pub fn new(max_failures: u32, lockout_duration_secs: u64) -> Self {
        Self {
            max_failures: max_failures.max(1),
            lockout_duration: Duration::from_secs(lockout_duration_secs.max(1)),
            attempts: HashMap::new(),
        }
    }

    pub fn check(&mut self, source_ip: &str, username: &str) -> bool {
        self.prune();
        let now = Instant::now();
        let key = key(source_ip, username);
        self.attempts
            .get(&key)
            .and_then(|attempt| attempt.lockout_until)
            .is_some_and(|until| now < until)
    }

    pub fn record_failure(&mut self, source_ip: &str, username: &str) -> bool {
        self.prune();
        let now = Instant::now();
        let key = key(source_ip, username);
        let attempt = self.attempts.entry(key).or_insert(Attempt {
            failures: 0,
            lockout_until: None,
            last_failure: now,
        });

        if now.duration_since(attempt.last_failure) > self.lockout_duration {
            attempt.failures = 0;
            attempt.lockout_until = None;
        }

        attempt.failures += 1;
        attempt.last_failure = now;
        if attempt.failures >= self.max_failures {
            attempt.lockout_until = Some(now + self.lockout_duration);
            return true;
        }
        false
    }

    pub fn record_success(&mut self, source_ip: &str, username: &str) {
        self.attempts.remove(&key(source_ip, username));
    }

    fn prune(&mut self) {
        let now = Instant::now();
        self.attempts.retain(|_, attempt| {
            if let Some(until) = attempt.lockout_until {
                now < until
            } else {
                now.duration_since(attempt.last_failure) <= self.lockout_duration
            }
        });
    }
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
