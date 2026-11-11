import { checkUpload } from '@/api/upload.ts';
import { http } from '@/lib/http.ts';
import { startUpload } from '@/lib/upload.ts';

export type SystemVersion = {
  version: string;
  target: string;
  baseVersion: string;
  kernelVersion: string;
  rootfsVersion: string;
  securityPatchLevel?: string | null;
  model: string;
  hardwareVersion: string;
  source: string;
};

export type SystemLatest = {
  kind: string;
  format: number;
  channel: string;
  version: string;
  target: string;
  name: string;
  sha256: string;
  sha512: string;
  size: number;
  url: string;
  releaseNotesUrl: string;
  securityPatchLevel?: string | null;
  requiredAppVersion?: string | null;
};

export type SystemStagedUpdate = {
  version: string;
  target: string;
  channel: string;
  archiveName: string;
  signer?: string | null;
  size: number;
  sha256: string;
  stagedAt: number;
  baseVersion: string;
  kernelVersion: string;
  securityPatchLevel?: string | null;
  requiredAppVersion?: string | null;
  requiredFreeBytes: number;
  requiresReboot: boolean;
  fileCount: number;
  imageCount: number;
  destructive: boolean;
};

export type SystemPendingUpdate = {
  version: string;
  target: string;
  backupId: string;
  installedAt: number;
  requiresReboot: boolean;
  fileCount: number;
};

export type SystemUpdateProgress = {
  operation: string;
  phase: string;
  version?: string | null;
  startedAt: number;
  updatedAt: number;
  message?: string | null;
};

export type SystemRollbackInfo = {
  version: string;
  target: string;
  backupId: string;
  installedAt: number;
  fileCount: number;
  requiresReboot: boolean;
};

export type SystemBootHealth = {
  backendRunning: boolean;
  versionMatchesPending: boolean;
  bootMarkerPresent: boolean;
  webRootPresent: boolean;
  healthy: boolean;
};

// get application version
export function getVersion() {
  return http.get('/api/application/version');
}

// get current application version without authentication
export function getCurrentVersion() {
  return http.get('/api/application/current-version');
}

// get current base-system version
export function getSystemVersion() {
  return http.get('/api/system-update/version');
}

// check for base-system updates
export function checkSystemUpdate() {
  return http.get('/api/system-update/check');
}

// get staged base-system update status
export function getSystemUpdateStatus() {
  return http.get('/api/system-update/status');
}

// download and verify a base-system update into staging
export function downloadSystemUpdate() {
  return http.request({
    method: 'post',
    url: '/api/system-update/download',
    timeout: 45 * 60 * 1000
  });
}

// drop the staged base-system update
export function discardSystemUpdate() {
  return http.post('/api/system-update/discard');
}

// install a staged base-system update
export function installSystemUpdate() {
  return http.request({
    method: 'post',
    url: '/api/system-update/install',
    timeout: 60 * 60 * 1000
  });
}

// ask whether a system bundle of this size can be uploaded, before sending it; a refusal after
// the browser starts sending reaches it only as a connection reset
export function checkSystemUpload(size: number) {
  return checkUpload('/api/system-update/upload-check', { size });
}

// stage a system bundle uploaded from this computer
export function uploadSystemUpdate(
  data: FormData,
  onProgress?: (loaded: number, total: number) => void
) {
  return startUpload({
    url: '/api/system-update/upload',
    data,
    onProgress: (loaded, total) => onProgress?.(loaded, total ?? 0)
  }).promise;
}

// ask whether an application bundle of this size can be uploaded, before sending it
export function checkApplicationUpload(size: number) {
  return checkUpload('/api/application/upload-check', { size });
}

export type ApplicationStagedUpdate = {
  version: string;
  name: string;
  size: number;
  signer: string;
};

// verify and stage an application bundle uploaded from this computer
export function uploadApplicationUpdate(
  data: FormData,
  onProgress?: (loaded: number, total: number) => void
) {
  return startUpload({
    url: '/api/application/upload',
    data,
    onProgress: (loaded, total) => onProgress?.(loaded, total ?? 0)
  }).promise;
}

// get the staged application bundle, or null
export function getStagedApplication() {
  return http.get('/api/application/staged');
}

// drop the staged application bundle
export function discardStagedApplication() {
  return http.delete('/api/application/staged');
}

// install the staged application bundle; the server restarts
export function installApplicationUpdate() {
  return http.request({
    method: 'post',
    url: '/api/application/install',
    timeout: 10 * 60 * 1000
  });
}

// get the locally registered system update key
export function getLocalUpdateKey() {
  return http.get('/api/system-update/local-key');
}

// register the key that may sign locally built system bundles
export function setLocalUpdateKey(password: string, publicKey: string, code?: string) {
  return http.request({
    method: 'put',
    url: '/api/system-update/local-key',
    data: { password, publicKey, code }
  });
}

// remove the locally registered system update key
export function removeLocalUpdateKey(password: string, code?: string) {
  return http.delete('/api/system-update/local-key', { password, code });
}

// rollback the latest base-system update backup
export function rollbackSystemUpdate() {
  return http.post('/api/system-update/rollback');
}

// update application to latest version
export function update() {
  return http.request({
    method: 'post',
    url: '/api/application/update',
    timeout: 15 * 60 * 1000
  });
}
