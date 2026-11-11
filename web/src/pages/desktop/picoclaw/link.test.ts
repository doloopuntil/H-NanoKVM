import { describe, expect, it } from 'vitest';

import { isExternalLink } from './link.ts';

const OWN = '192.0.2.10';

describe('isExternalLink', () => {
  it('follows a link that names another site in full', () => {
    for (const url of [
      'https://example.org/',
      'http://example.org/page?x=1#top',
      'HTTPS://Example.ORG/path',
      'https://192.0.2.11/',
      'https://192.0.2.10:8443/'
    ]) {
      expect(isExternalLink(url, OWN), url).toBe(true);
    }
  });

  it('refuses relative, in-app, same-device and non-web links', () => {
    for (const url of [
      '/#terminal?port=/dev/ttyS0&baud=115200',
      '#terminal?port=/dev/ttyS0',
      '?x=1',
      'terminal',
      '//example.org/',
      'https://192.0.2.10/#terminal?port=/dev/ttyS0',
      'http://192.0.2.10/',
      'javascript:alert(1)',
      'data:text/html,x',
      'file:///etc/passwd',
      'mailto:someone@example.org',
      'ws://example.org/',
      '',
      ' https://example.org/',
      'https://',
      'https:example.org'
    ]) {
      expect(isExternalLink(url, OWN), JSON.stringify(url)).toBe(false);
    }
  });

  it('compares the host without regard to case', () => {
    expect(isExternalLink('https://KVM.example/', 'kvm.example')).toBe(false);
  });
});
