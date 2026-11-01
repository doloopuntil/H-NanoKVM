// Answers for the /api/... calls the UI makes, by pathname: each value is the `data` of
// { code: 0, data }. Every optional piece of hardware is present, so every conditional row
// renders. Times are fixed so two runs compare equal. Unlisted paths answer {}.

const now = 1793548800;
const tool = { installed: true, detail: 'ok' };
const sysVersion = {
  version: '0.4.0',
  target: 'sg2002',
  baseVersion: 'buildroot-2026.02',
  kernelVersion: '5.10.265',
  rootfsVersion: '0.4.0',
  securityPatchLevel: '2026-10-01',
  model: 'NanoKVM',
  hardwareVersion: 'PCIE',
  source: 'raw'
};
const samples = Array.from({ length: 60 }, (_, i) => ({
  seq: i + 1,
  temperatureC: 48 + Math.sin(i / 6) * 3,
  memoryPercent: 41 + (i % 7),
  swapPercent: 3,
  cpuPercent: 12 + ((i * 7) % 25)
}));
const logLines = Array.from(
  { length: 40 },
  (_, i) =>
    `Nov  1 12:00:${String(i).padStart(2, '0')} h-nanokvm daemon.info nanokvm[812]: line ${i + 1} of the system log`
);

export const answers = {
  // sign-in, boot and menu bar
  '/api/auth/setup': { required: false },
  '/api/auth/password': { isUpdated: true },
  '/api/auth/account': { username: 'admin' },
  '/api/application/version': { current: '2.1.0', latest: '2.1.0' },
  '/api/application/current-version': { current: '2.1.0' },
  '/api/vm/info': {
    ips: [
      { name: 'eth0', addr: '192.0.2.10', version: 'IPv4', type: 'Wired' },
      { name: 'wlan0', addr: '192.0.2.11', version: 'IPv4', type: 'Wireless' }
    ],
    mdns: 'h-nanokvm.local',
    image: 'v1.0',
    application: '2.1.0',
    deviceKey: 'abc',
    hardware: 'NanoKVM'
  },
  '/api/vm/hardware': { version: 'PCIE', hdmi: 'sg2002', oled: true },
  '/api/vm/gpio': { lite: false },
  '/api/vm/web-title': { title: '' },
  '/api/vm/tls/pending': { pending: false },
  '/api/hid/shortcuts': {
    shortcuts: [
      {
        id: '1',
        keys: [
          { code: 'ControlLeft', label: 'Ctrl' },
          { code: 'AltLeft', label: 'Alt' },
          { code: 'Delete', label: 'Del' }
        ]
      }
    ]
  },
  '/api/hid/shortcut/leader-key': { key: '' },
  '/api/hid/leds': { numLock: true, capsLock: false, scrollLock: false },
  '/api/storage/image/mounted': { file: '' },
  '/api/storage/cdrom': { cdrom: 0 },
  '/api/storage/image': {
    files: ['/data/debian-13-netinst.iso', '/data/windows-11.iso'],
    sizes: { '/data/debian-13-netinst.iso': 663748608, '/data/windows-11.iso': 6140975104 }
  },
  '/api/download/image/status': { status: 'idle', file: '', percentage: '' },
  '/api/vm/script': { files: ['backup.sh', 'reset-bios.py'] },
  '/api/network/wol/mac': { macs: ['00:00:5e:00:53:01 office-pc', '00:00:5e:00:53:02'] },
  '/api/picoclaw/runtime/status': {
    ready: false,
    installed: true,
    installing: false,
    model_configured: true,
    model_name: 'example-model',
    status: 'stopped'
  },
  '/api/picoclaw/sessions': [],

  // About, Device
  '/api/vm/hostname': { hostname: 'h-nanokvm', rebootRequired: false },
  '/api/vm/mdns': { enabled: true },
  '/api/vm/reboot-pending': { reasons: [] },
  '/api/hid/mode': { mode: 'normal' },
  '/api/hid/usb-wakeup': { enabled: false },
  '/api/vm/device/virtual': { disk: true, network: false },
  '/api/vm/mouse-jiggler': { enabled: false, mode: 'absolute' },
  '/api/vm/hdmi': { enabled: true, idleTimeout: 0 },
  '/api/vm/oled': { exist: true, sleep: 60 },

  // User
  '/api/auth/totp': {
    enabled: false,
    clockSynced: true,
    backupCodesRemaining: 0,
    enrolledAt: 0,
    required: false
  },
  '/api/vm/session-lock': { duration: 15, expiresAt: now + 900, logoutOnBrowserClose: false },
  '/api/vm/terminal/enabled': { enabled: true },
  '/api/download/image/enabled': { enabled: true, remoteEnabled: true },
  '/api/download/image/remote/enabled': { enabled: true },

  // Network
  '/api/network/wifi': { supported: true, apMode: false, connected: true, ssid: 'Office' },
  '/api/network/dns': {
    mode: 'dhcp',
    ipv4Mode: 'dhcp',
    dnsMode: 'dhcp',
    servers: [],
    dhcp: ['192.0.2.1'],
    info: {
      interface: 'eth0',
      type: 'Wired',
      address: '192.0.2.10',
      subnetMask: '255.255.255.0',
      gateway: '192.0.2.1'
    }
  },
  '/api/network/ipv6': {
    mode: 'slaac',
    enabled: true,
    active: true,
    clientAvailable: true,
    clientPath: '/sbin/udhcpc6',
    addresses: [
      { interface: 'eth0', address: '2001:db8::10', prefix: 64, scope: 'global' },
      { interface: 'eth0', address: 'fe80::10', prefix: 64, scope: 'link' }
    ],
    gateway: 'fe80::1',
    status: 'active',
    message: ''
  },
  '/api/vm/cert': {
    httpsEnabled: true,
    source: 'selfSigned',
    domain: '',
    email: '',
    status: {
      notAfter: null,
      lastAttempt: null,
      lastSuccess: null,
      lastError: null,
      failures: 0,
      nextAttempt: null
    },
    busy: false,
    currentNotAfter: now + 300 * 86400,
    tailscaleDomain: 'h-nanokvm.tail0000.ts.net',
    tailscaleAvailable: true,
    blocker: null,
    url: null
  },
  '/api/vm/ssh': { enabled: true },
  '/api/system/firewall': {
    config: { mode: 'moderate' },
    effectiveMode: 'moderate',
    moderateActive: true,
    restrictedActive: false,
    paranoidActive: false,
    webrtcBlocked: false,
    paranoidAvailable: true,
    confirmationRequired: false,
    httpsEnabled: true,
    httpsPort: 443,
    backend: { preferred: 'iptables', iptables: tool, ip6tables: tool, nft: tool },
    rules: {
      ipv4: '-P INPUT DROP\n-A INPUT -i lo -j ACCEPT\n-A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT',
      ipv6: '-P INPUT DROP',
      nft: ''
    },
    message: ''
  },
  '/api/system/wireguard': {
    config: {
      enabled: true,
      address: '10.8.0.2/32',
      peer: {
        publicKey: 'L2cEu9TqXP+a3YqEPoGKO+jiT3EaSywyL+ZB7kFFJbM=',
        endpointHost: 'vpn.example.com',
        endpointPort: 51820,
        allowedIps: ['10.8.0.0/24'],
        persistentKeepalive: 25
      }
    },
    privateKeySet: true,
    publicKey: '33fKPrWQFUFGgjgR1os40nQJd78BEZLSxAU3ES8sV6s=',
    toolInstalled: true,
    running: true,
    latestHandshake: now - 42,
    rxBytes: 1234567,
    txBytes: 765432,
    firewallBlocked: false
  },
  '/api/extensions/tailscale/status': {
    state: 'running',
    name: 'h-nanokvm',
    ip: '100.64.0.10',
    account: 'admin@example.com'
  },
  '/api/vm/memory/limit': { enabled: true },
  '/api/vm/swap': { size: 128, availableMb: 512 },

  // System
  '/api/system/time': {
    config: {
      ntpEnabled: true,
      timezone: 'Europe/London',
      servers: ['0.pool.ntp.org', '1.pool.ntp.org']
    },
    currentTime: '2026-11-01T12:00:00Z',
    gateway: '192.0.2.1',
    defaultServers: ['0.pool.ntp.org', '1.pool.ntp.org'],
    timezoneOptions: ['UTC', 'Europe/London', 'Europe/Rome', 'America/New_York', 'Asia/Tokyo']
  },
  '/api/system-log/config': {
    config: {
      remoteEnabled: true,
      remoteHost: 'logs.example.com',
      remotePort: 514,
      priority: 6,
      bufferKb: 64,
      rotations: 2,
      smallOutput: false,
      stripTimestamps: false,
      kernelEnabled: true,
      kernelConsoleLevel: 4
    },
    localLogFile: '/var/log/messages'
  },
  '/api/system-log/messages': { content: logLines.join('\n'), truncated: false },
  '/api/vm/overdrive': {
    available: true,
    enabled: false,
    rebootRequired: false,
    keepAfterUpdate: false
  },
  '/api/vm/watchdog': { available: true, enabled: true, running: true, lastRestart: 'power-on' },
  '/api/vm/monitor': {
    cpuMhz: 1000,
    videoMhz: 600,
    overdrive: false,
    temperatureC: 49.5,
    memory: { totalKb: 262144, usedKb: 110000, swapTotalKb: 131072, swapUsedKb: 4096 },
    cpu: { userPercent: 9, systemPercent: 5 },
    disks: [
      { mount: '/', totalBytes: 2e9, usedBytes: 6.1e8 },
      { mount: '/data', totalBytes: 2.8e10, usedBytes: 9.5e9 }
    ],
    uptimeSeconds: 3 * 86400 + 4000,
    epoch: 1,
    latestSeq: 60,
    samples
  },
  '/api/system-update/version': { current: sysVersion },
  '/api/system-update/check': {
    current: sysVersion,
    latest: null,
    appUpdateRequired: false,
    error: null
  },
  '/api/system-update/status': {
    current: sysVersion,
    progress: null,
    staged: null,
    pending: null,
    bootHealth: null,
    rollback: null
  },
  '/api/system-update/local-key': { configured: false, fingerprint: null },
  // nothing staged: the server answers null
  '/api/application/staged': null
};

// Called by pages that the harness does not need to answer: the video stream and keep-alives.
export const ignoredPaths = new Set([
  '/api/stream/mjpeg',
  '/api/stream/mjpeg/detect',
  '/api/vm/screen',
  '/api/vm/session-lock/touch'
]);

export function answer(pathname) {
  if (!(pathname in answers)) return { hit: false, data: {} };
  return { hit: true, data: answers[pathname] };
}
