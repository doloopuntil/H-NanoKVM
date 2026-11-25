export const HNANOKVM_NAME = 'H-NanoKVM';
export const HNANOKVM_SHORT_NAME = 'H-NanoKVM';
export const HNANOKVM_VERSION = 'beta 2.0.4';
// Light-text lockup for the dark login page; hnanokvm-logo.svg is the dark-text one for light pages.
export const HNANOKVM_LOGO_SRC = '/hnanokvm-logo-dark.svg';
// The gear emblem alone, on a transparent background, for the dark menu bar.
export const HNANOKVM_MARK_SRC = '/hnanokvm-mark.svg';

export function formatHNanoKvmVersion(version?: string) {
  const value = version?.trim();
  if (!value) return HNANOKVM_VERSION;
  const lower = value.toLowerCase();
  if (lower.startsWith('alfa') || lower.startsWith('alpha') || lower.startsWith('beta')) {
    return value;
  }
  if (value.startsWith('2.')) {
    return `beta ${value}`;
  }
  return `beta - ${value}`;
}
