import { http } from '@/lib/http.ts';

// get NanoKVM information
export function getInfo() {
  return http.get('/api/vm/info');
}

// get hardware information
export function getHardware() {
  return http.get('/api/vm/hardware');
}

// set gpio value
export function setGpio(type: string, duration: number) {
  const data = {
    type,
    duration
  };
  return http.post('/api/vm/gpio', data);
}

// get gpio value
export function getGpio() {
  return http.get('/api/vm/gpio');
}

// update screen arguments
export function updateScreen(type: string, value: number) {
  const data = {
    type,
    value
  };
  return http.post('/api/vm/screen', data);
}

// get memory limit
export function getMemoryLimit() {
  return http.get('/api/vm/memory/limit');
}

// set memory limit
export function setMemoryLimit(enabled: boolean, limit: number) {
  const data = {
    enabled,
    limit
  };
  return http.post('/api/vm/memory/limit', data);
}

// get OLED configuration
export function getOLED() {
  return http.get('/api/vm/oled');
}

// set OLED configuration
export function setOLED(sleep: number) {
  return http.post('/api/vm/oled', { sleep });
}

// reset HDMI
export function resetHdmi() {
  return http.post('/api/vm/hdmi/reset');
}

// get HDMI state
export function getHdmiState() {
  return http.get('/api/vm/hdmi');
}

// enable HDMI
export function enableHdmi() {
  return http.post('/api/vm/hdmi/enable');
}

// disable HDMI
export function disableHdmi() {
  return http.post('/api/vm/hdmi/disable');
}

// set HDMI state
export function setHdmiState(enabled: boolean) {
  if (enabled) {
    return enableHdmi();
  }
  return disableHdmi();
}

// set HDMI idle timeout in minutes
export function setHdmiIdleTimeout(minutes: number) {
  return http.post('/api/vm/hdmi/timeout', { minutes });
}

// get SSH state
export function getSSHState() {
  return http.get('/api/vm/ssh');
}

// enable SSH
export function enableSSH() {
  return http.post('/api/vm/ssh/enable');
}

// disable SSH
export function disableSSH() {
  return http.post('/api/vm/ssh/disable');
}

// get the swap file size and the space a swap file may take
export function getSwap() {
  return http.get('/api/vm/swap');
}

// set swap file size
export function setSwap(size: number) {
  return http.post('/api/vm/swap', { size });
}

export type WatchdogState = {
  available: boolean;
  enabled: boolean;
  running: boolean;
  lastRestart: 'power-on' | 'restart' | 'watchdog' | 'overheat' | 'unknown' | null;
};

// get the hardware watchdog switch and the reason for the last restart
export function getWatchdog(): Promise<{ code: number; msg: string; data?: WatchdogState }> {
  return http.get('/api/vm/watchdog');
}

// turn the hardware watchdog on or off; it takes effect at once
export function setWatchdog(enabled: boolean) {
  return http.post('/api/vm/watchdog', { enabled });
}

// get the boot clock profile
export function getOverdrive() {
  return http.get('/api/vm/overdrive');
}

// choose the boot clock profile (applies after a reboot) and whether it survives system updates
export function setOverdrive(options: { enabled?: boolean; keepAfterUpdate?: boolean }) {
  return http.post('/api/vm/overdrive', options);
}

// the changes that only take effect after the next reboot
export function getRebootPending() {
  return http.get('/api/vm/reboot-pending');
}

// get mouse jiggler
export function getMouseJiggler() {
  return http.get('/api/vm/mouse-jiggler');
}

// set mouse jiggler
export function setMouseJiggler(enabled: boolean, mode: string) {
  return http.post('/api/vm/mouse-jiggler', { enabled, mode });
}

// get web terminal state
export function getTerminalEnabled() {
  return http.get('/api/vm/terminal/enabled');
}

// set web terminal state
export function setTerminalEnabled(enabled: boolean) {
  return http.post('/api/vm/terminal/enabled', { enabled });
}

// unlock web terminal before opening shell
export function unlockTerminal(username: string, password: string, code?: string) {
  return http.post('/api/vm/terminal/unlock', { username, password, code });
}

// reverse proxies whose forwarded client address and protocol are trusted
export function getTrustedProxies() {
  return http.get('/api/vm/trusted-proxies');
}

// changing the list needs the password, and a code when the account has a second factor
export function setTrustedProxies(proxies: string[], password: string, code?: string) {
  return http.post('/api/vm/trusted-proxies', { proxies, password, code });
}

// get session lock duration
export function getSessionLock() {
  return http.get('/api/vm/session-lock');
}

// set session lock duration
export function setSessionLock(duration: number) {
  return http.post('/api/vm/session-lock', { duration });
}

// set whether the session ends when the browser closes
export function setLogoutOnBrowserClose(enabled: boolean) {
  return http.post('/api/vm/session-lock', { logoutOnBrowserClose: enabled });
}

// slide the session lock while the user is active
export function touchSession() {
  return http.post('/api/vm/session-lock/touch');
}

// get Hostname
export function getHostname() {
  return http.get('/api/vm/hostname');
}

// set Hostname
export function setHostname(hostname: string) {
  return http.post('/api/vm/hostname', { hostname });
}

// get WebTitle
export function getWebTitle() {
  return http.get('/api/vm/web-title');
}

// set WebTitle
export function setWebTitle(title: string) {
  return http.post('/api/vm/web-title', { title });
}

// get mDNS state
export function getMdnsState() {
  return http.get('/api/vm/mdns');
}

// enable mDNS
export function enableMdns() {
  return http.post('/api/vm/mdns/enable');
}

// disable mDNS
export function disableMdns() {
  return http.post('/api/vm/mdns/disable');
}

// switch between HTTP and HTTPS; the server restarts and waits for a confirmation
export function setTLS(enabled: boolean) {
  return http.post('/api/vm/tls', { enabled });
}

// whether a protocol switch waits for a confirmation, and how long it has
export function getTlsPending() {
  return http.get('/api/vm/tls/pending');
}

// keep the protocol the server was switched to
export function confirmTls() {
  return http.post('/api/vm/tls/confirm');
}

// go back to the previous protocol at once
export function revertTls() {
  return http.post('/api/vm/tls/revert');
}

export type CertSource = 'selfSigned' | 'tailscale' | 'acme';

export type CertInfo = {
  httpsEnabled: boolean;
  source: CertSource;
  domain: string;
  email: string;
  status: {
    notAfter: number | null;
    lastAttempt: number | null;
    lastSuccess: number | null;
    lastError: string | null;
    failures: number;
    nextAttempt: number | null;
  };
  // a request for a certificate is running
  busy: boolean;
  // when the certificate in use expires, whichever source it has (unix seconds)
  currentNotAfter: number | null;
  tailscaleDomain: string | null;
  // Tailscale is running and the tailnet issues certificates
  tailscaleAvailable: boolean;
  // what stops both managed sources now
  blocker: 'clockUnsynced' | 'httpsOff' | 'paranoidFirewall' | null;
  // where to open the interface once a managed certificate is in use
  url: string | null;
};

// where the HTTPS certificate comes from, its expiry and the last renewal
export function getCert() {
  return http.get('/api/vm/cert');
}

// change the source; asks for the password and a second factor, then requests the certificate in
// the background and waits for a confirmation like a protocol switch
export function setCert(req: {
  source: CertSource;
  domain: string;
  email: string;
  password: string;
  code?: string;
}) {
  return http.post('/api/vm/cert', req);
}

// request a new certificate for the current source now
export function renewCert() {
  return http.post('/api/vm/cert/renew');
}

// reboot
export function reboot() {
  return http.post('/api/vm/system/reboot');
}

// power off; the device stays off until it is powered on again
export function poweroff() {
  return http.post('/api/vm/system/poweroff');
}

export type MonitorDisk = { mount: string; totalBytes: number; usedBytes: number };

export type MonitorSample = {
  seq: number;
  temperatureC: number | null;
  memoryPercent: number | null;
  swapPercent: number | null;
  cpuPercent: number | null;
};

export type MonitorData = {
  cpuMhz: number | null;
  videoMhz: number | null;
  overdrive: boolean;
  temperatureC: number | null;
  memory: {
    totalKb: number;
    usedKb: number;
    swapTotalKb: number;
    swapUsedKb: number;
  } | null;
  cpu: { userPercent: number; systemPercent: number } | null;
  disks: MonitorDisk[];
  uptimeSeconds: number | null;
  epoch: number;
  latestSeq: number;
  samples: MonitorSample[];
};

// live readings for Settings > System > Monitor; `since` and `epoch` name the newest sample the
// page has, and the server then sends only the newer ones
export function getMonitor(
  since?: number,
  epoch?: number
): Promise<{ code: number; msg: string; data?: MonitorData }> {
  return http.get('/api/vm/monitor', since === undefined ? undefined : { since, epoch });
}
