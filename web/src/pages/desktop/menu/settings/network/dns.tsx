import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { Divider, Segmented, Select } from 'antd';
import { XIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import * as api from '@/api/network.ts';
import type { DNSMode } from '@/api/network.ts';
import { useSettingsLoad } from '@/hooks/useSettingsLoad.ts';
import { EditableInfoRow, InfoRow } from '@/components/setting-rows.tsx';

import type { NetworkSectionHandle, NetworkSectionResult, NetworkSectionStatus } from './types.ts';

type DNSState = {
  mode: DNSMode;
  ipv4Mode?: DNSMode;
  dnsMode?: DNSMode;
  servers: string[];
  dhcp: string[];
  info: DNSInfo;
  config?: NetworkConfig;
};

type DNSInfo = {
  interface?: string;
  type?: string;
  address?: string;
  subnetMask?: string;
  gateway?: string;
};

type NetworkConfig = {
  interface?: string;
  address?: string;
  subnetMask?: string;
  gateway?: string;
};

const maxServers = 6;

type DNSProps = {
  disabled?: boolean;
  onStatusChange?: (status: NetworkSectionStatus) => void;
};

function formatInterface(info: DNSInfo) {
  if (!info.interface) return '';
  if (!info.type) return info.interface;

  return `${info.type} (${info.interface})`;
}

function normalizeServers(servers: string[]) {
  const seen = new Set<string>();
  const normalized: string[] = [];

  for (const server of servers) {
    const value = normalizeServer(server);
    if (!value || seen.has(value)) continue;

    seen.add(value);
    normalized.push(value);
  }

  return normalized;
}

function normalizeServer(server: string) {
  return server.split('#')[0].trim().split(/\s+/)[0] || '';
}

function isValidIP(value: string) {
  return isValidIPv4(value) || isValidIPv6(value);
}

function isValidIPv4(value: string) {
  const parts = value.split('.');
  if (parts.length !== 4) return false;

  return parts.every((part) => {
    if (!/^\d+$/.test(part)) return false;
    if (part.length > 1 && part.startsWith('0')) return false;

    const number = Number(part);
    return number >= 0 && number <= 255;
  });
}

function normalizeIPv4(value: string) {
  return value.trim().split('/')[0].trim();
}

function isValidSubnetMask(value: string) {
  if (!isValidIPv4(value)) return false;

  const mask = ipv4ToNumber(value);
  if (mask === null) return false;

  let seenZero = false;
  for (let bit = 31; bit >= 0; bit--) {
    const isOne = (mask & (1 << bit)) !== 0;
    if (!isOne) {
      seenZero = true;
    } else if (seenZero) {
      return false;
    }
  }

  return mask !== 0;
}

function ipv4ToNumber(value: string) {
  if (!isValidIPv4(value)) return null;

  return value.split('.').reduce((acc, part) => (acc << 8) + Number(part), 0) >>> 0;
}

function isSameSubnet(address: string, gateway: string, subnetMask: string) {
  const ip = ipv4ToNumber(address);
  const router = ipv4ToNumber(gateway);
  const mask = ipv4ToNumber(subnetMask);
  if (ip === null || router === null || mask === null) return false;

  return (ip & mask) === (router & mask);
}

function isValidIPv6(value: string) {
  if (!value.includes(':')) return false;

  try {
    new URL(`http://[${value}]/`);
    return true;
  } catch {
    return false;
  }
}

function buildRedirectURL(address: string) {
  const target = normalizeIPv4(address);
  const { protocol, port, pathname, search, hash } = window.location;
  const defaultPort =
    (protocol === 'http:' && port === '80') || (protocol === 'https:' && port === '443');
  const portPart = port && !defaultPort ? `:${port}` : '';

  return `${protocol}//${target}${portPart}${pathname}${search}${hash}`;
}

export const DNS = forwardRef<NetworkSectionHandle, DNSProps>(
  ({ disabled = false, onStatusChange }, ref) => {
    const { t } = useTranslation();

    // How the IPv4 address is set (DHCP or static) and where the DNS servers come from are
    // separate; a static address does need manual servers.
    const [ipMode, setIpMode] = useState<DNSMode>('dhcp');
    const [originalIpMode, setOriginalIpMode] = useState<DNSMode>('dhcp');
    const [dnsMode, setDnsMode] = useState<DNSMode>('dhcp');
    const [originalDnsMode, setOriginalDnsMode] = useState<DNSMode>('dhcp');
    const [servers, setServers] = useState<string[]>([]);
    const [originalServers, setOriginalServers] = useState<string[]>([]);
    const [dhcp, setDHCP] = useState<string[]>([]);
    const [info, setInfo] = useState<DNSInfo>({});
    const [address, setAddress] = useState('');
    const [subnetMask, setSubnetMask] = useState('');
    const [gateway, setGateway] = useState('');
    const [originalAddress, setOriginalAddress] = useState('');
    const [originalSubnetMask, setOriginalSubnetMask] = useState('');
    const [originalGateway, setOriginalGateway] = useState('');

    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const applyDNSState = (rsp: { data?: any }) => {
      const data = rsp.data as DNSState;
      const fetchedIpMode = data.ipv4Mode || data.mode || 'dhcp';
      const fetchedDnsMode = data.dnsMode || data.mode || 'dhcp';
      setIpMode(fetchedIpMode);
      setOriginalIpMode(fetchedIpMode);
      setDnsMode(fetchedDnsMode);
      setOriginalDnsMode(fetchedDnsMode);

      const fetchedServers = data.servers?.filter(Boolean) || [];
      setServers(fetchedServers);
      setOriginalServers(fetchedServers);
      setDHCP(data.dhcp || []);
      setInfo(data.info || {});

      const config = data.config || {};
      const fetchedAddress = normalizeIPv4(config.address || data.info?.address || '');
      const fetchedSubnetMask = config.subnetMask || data.info?.subnetMask || '';
      const fetchedGateway = config.gateway || data.info?.gateway || '';
      setAddress(fetchedAddress);
      setSubnetMask(fetchedSubnetMask);
      setGateway(fetchedGateway);
      setOriginalAddress(fetchedAddress);
      setOriginalSubnetMask(fetchedSubnetMask);
      setOriginalGateway(fetchedGateway);
    };

    const isLoaded = useSettingsLoad(api.getDNS, applyDNSState);
    const isLoading = !isLoaded;

    // refresh after saving
    async function getDNS() {
      try {
        const rsp = await api.getDNS();
        if (rsp.code !== 0) {
          setError(rsp.msg);
          return;
        }

        applyDNSState(rsp);
      } catch (err) {
        console.log(err);
      }
    }

    async function save(): Promise<NetworkSectionResult> {
      if (isSaving) return { changed: false };
      if (!hasChanges) return { changed: false };

      setMessage('');
      setError('');

      const normalized = normalizeServers(servers);
      if (
        dnsMode === 'manual' &&
        (normalized.length === 0 || normalized.some((server) => !isValidIP(server)))
      ) {
        setError(t('settings.network.dns.invalid'));
        return { changed: false, error: true };
      }

      const isStatic = ipMode === 'manual';
      const normalizedAddress = normalizeIPv4(address);
      const normalizedSubnetMask = subnetMask.trim();
      const normalizedGateway = normalizeIPv4(gateway);
      const hasValidManualNetwork =
        !isStatic ||
        (isValidIPv4(normalizedAddress) &&
          isValidSubnetMask(normalizedSubnetMask) &&
          isValidIPv4(normalizedGateway) &&
          isSameSubnet(normalizedAddress, normalizedGateway, normalizedSubnetMask));
      const redirectURL = isStatic ? buildRedirectURL(normalizedAddress) : '';
      if (!hasValidManualNetwork) {
        setError(t('settings.network.dns.invalidNetwork'));
        return { changed: false, error: true };
      }

      const ipChanged =
        ipMode !== originalIpMode ||
        (isStatic &&
          (normalizedAddress !== originalAddress ||
            normalizedSubnetMask !== originalSubnetMask ||
            normalizedGateway !== originalGateway));
      const dnsChanged =
        dnsMode !== originalDnsMode ||
        normalized.join(',') !== normalizeServers(originalServers).join(',');

      setIsSaving(true);
      let redirectTimer: number | undefined;
      if (isStatic) {
        setMessage(t('settings.network.dns.redirecting'));
        redirectTimer = window.setTimeout(() => window.location.assign(redirectURL), 5000);
      }

      try {
        let rsp: { code: number; msg?: string };
        if (isStatic) {
          // A static address brings the DNS servers along in the same call.
          rsp = await api.setDNS('manual', normalized, {
            interface: info.interface || 'eth0',
            address: normalizedAddress,
            subnetMask: normalizedSubnetMask,
            gateway: normalizedGateway
          });
        } else {
          rsp = ipChanged ? await api.setDNS('dhcp', []) : { code: 0 };

          // Going back to DHCP already restores the DHCP servers; fixed servers, or a change
          // of servers alone, are a separate call that leaves the address untouched.
          const fixedServers = dnsMode === 'manual';
          if (
            rsp.code === 0 &&
            (fixedServers ? ipChanged || dnsChanged : dnsChanged && !ipChanged)
          ) {
            rsp = await api.setDNSServers(dnsMode, fixedServers ? normalized : []);
          }
        }
        if (rsp.code !== 0) {
          if (redirectTimer) window.clearTimeout(redirectTimer);
          setError(rsp.msg || t('settings.network.dns.saveFailed'));
          return { changed: true, error: true };
        }

        if (dnsMode === 'manual') {
          setServers(normalized);
          setOriginalServers(normalized);
        }
        setOriginalIpMode(ipMode);
        setOriginalDnsMode(dnsMode);
        setAddress(normalizedAddress);
        setSubnetMask(normalizedSubnetMask);
        setGateway(normalizedGateway);
        setOriginalAddress(normalizedAddress);
        setOriginalSubnetMask(normalizedSubnetMask);
        setOriginalGateway(normalizedGateway);

        if (isStatic) {
          if (redirectTimer) window.clearTimeout(redirectTimer);
          setMessage(t('settings.network.dns.redirecting'));
          window.setTimeout(() => window.location.assign(redirectURL), 800);
          return { changed: true, redirecting: true };
        } else {
          await getDNS();
          setMessage(t('settings.network.dns.saved'));
          return { changed: true };
        }
      } catch (err) {
        console.log(err);
        if (isStatic) {
          if (!redirectTimer) {
            setMessage(t('settings.network.dns.redirecting'));
            window.setTimeout(() => window.location.assign(redirectURL), 1200);
          }
          return { changed: true, redirecting: true };
        }
        setError(t('settings.network.dns.saveFailed'));
        return { changed: true, error: true };
      } finally {
        setIsSaving(false);
      }
    }

    const normalizedServers = normalizeServers(servers);
    const normalizedAddress = normalizeIPv4(address);
    const normalizedGateway = normalizeIPv4(gateway);
    const trimmedSubnetMask = subnetMask.trim();
    const hasInvalidServer =
      dnsMode === 'manual' &&
      servers.some((server) => {
        const val = normalizeServer(server);
        return val !== '' && !isValidIP(val);
      });
    const hasInvalidNetwork =
      ipMode === 'manual' &&
      (!isValidIPv4(normalizedAddress) ||
        !isValidSubnetMask(trimmedSubnetMask) ||
        !isValidIPv4(normalizedGateway) ||
        !isSameSubnet(normalizedAddress, normalizedGateway, trimmedSubnetMask));
    const isExceedMax = dnsMode === 'manual' && normalizedServers.length > maxServers;
    const hasChanges =
      ipMode !== originalIpMode ||
      dnsMode !== originalDnsMode ||
      normalizedServers.join(',') !== normalizeServers(originalServers).join(',') ||
      (ipMode === 'manual' &&
        (normalizedAddress !== originalAddress ||
          trimmedSubnetMask !== originalSubnetMask ||
          normalizedGateway !== originalGateway));

    const statusText = error || message || (hasChanges ? t('settings.network.dns.unsaved') : '');
    const statusKind = error ? 'error' : message ? 'success' : hasChanges ? 'warning' : '';
    const serversDescription =
      dnsMode === 'dhcp'
        ? t('settings.network.dns.dhcpServersDescription')
        : t('settings.network.dns.manualServersDescription');

    const canApply =
      hasChanges &&
      !isLoading &&
      !isSaving &&
      !hasInvalidServer &&
      !hasInvalidNetwork &&
      !isExceedMax;
    const status = useMemo<NetworkSectionStatus>(
      () => ({
        hasPending: hasChanges,
        hasInvalid: hasInvalidServer || hasInvalidNetwork || isExceedMax,
        canApply,
        isLoading,
        isSaving,
        statusText,
        statusKind
      }),
      [
        canApply,
        hasChanges,
        hasInvalidNetwork,
        hasInvalidServer,
        isExceedMax,
        isLoading,
        isSaving,
        statusKind,
        statusText
      ]
    );

    useImperativeHandle(ref, () => ({ apply: save }));

    useEffect(() => {
      onStatusChange?.(status);
    }, [onStatusChange, status]);

    return (
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-6">
          <div className="text-neutral-400">{t('settings.network.dns.ipv4Title')}</div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-6">
            <div className="flex min-w-0 flex-col space-y-1 sm:flex-1 sm:basis-60">
              <span>{t('settings.network.configuration')}</span>
              <span className="text-xs text-neutral-500">
                {t('settings.network.dns.ipv4Description')}
              </span>
            </div>

            <div className="w-full min-w-0 sm:w-auto sm:flex-none">
              <Segmented
                block
                className="settings-segmented-wrap-labels settings-segmented-fit min-w-full"
                disabled={disabled || isLoading || isSaving}
                value={ipMode}
                onChange={(val) => {
                  setIpMode(val as DNSMode);
                  // A static address needs fixed servers; going back, restore what was set.
                  setDnsMode(
                    val === 'manual'
                      ? 'manual'
                      : originalIpMode === 'dhcp'
                        ? originalDnsMode
                        : 'dhcp'
                  );
                  setMessage('');
                  setError('');
                }}
                options={[
                  { label: t('settings.network.dns.dhcp'), value: 'dhcp' },
                  { label: t('settings.network.dns.manual'), value: 'manual' }
                ]}
              />
            </div>
          </div>

          <div className="flex flex-col space-y-3">
            <InfoRow label={t('settings.network.dns.interface')} value={formatInterface(info)} />
            {ipMode === 'manual' ? (
              <>
                <EditableInfoRow
                  label={t('settings.network.dns.ipAddress')}
                  value={address}
                  placeholder="10.0.87.44"
                  status={address.trim() && !isValidIPv4(normalizedAddress) ? 'error' : undefined}
                  onChange={(value) => {
                    setAddress(value);
                    setMessage('');
                    setError('');
                  }}
                />
                <EditableInfoRow
                  label={t('settings.network.dns.subnetMask')}
                  value={subnetMask}
                  placeholder="255.255.255.0"
                  status={
                    subnetMask.trim() && !isValidSubnetMask(trimmedSubnetMask) ? 'error' : undefined
                  }
                  onChange={(value) => {
                    setSubnetMask(value);
                    setMessage('');
                    setError('');
                  }}
                />
                <EditableInfoRow
                  label={t('settings.network.dns.router')}
                  value={gateway}
                  placeholder="10.0.87.5"
                  status={gateway.trim() && !isValidIPv4(normalizedGateway) ? 'error' : undefined}
                  onChange={(value) => {
                    setGateway(value);
                    setMessage('');
                    setError('');
                  }}
                />
              </>
            ) : (
              <>
                <InfoRow label={t('settings.network.dns.ipAddress')} value={info.address} />
                <InfoRow label={t('settings.network.dns.subnetMask')} value={info.subnetMask} />
                <InfoRow label={t('settings.network.dns.router')} value={info.gateway} />
              </>
            )}
          </div>
        </div>

        <Divider className="opacity-50" />

        <div className="flex flex-col space-y-6">
          <div className="text-neutral-400">{t('settings.network.dns.title')}</div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-6">
            <div className="flex min-w-0 flex-col space-y-1 sm:flex-1 sm:basis-60">
              <span>{t('settings.network.configuration')}</span>
              <span className="text-xs text-neutral-500">
                {t('settings.network.dns.description')}
              </span>
            </div>

            <div className="w-full min-w-0 sm:w-auto sm:flex-none">
              <Segmented
                block
                className="settings-segmented-wrap-labels settings-segmented-fit min-w-full"
                disabled={disabled || isLoading || isSaving}
                value={dnsMode}
                onChange={(val) => {
                  setDnsMode(val as DNSMode);
                  setMessage('');
                  setError('');
                }}
                options={[
                  {
                    label: t('settings.network.dns.dhcp'),
                    value: 'dhcp',
                    disabled: ipMode === 'manual'
                  },
                  { label: t('settings.network.dns.manual'), value: 'manual' }
                ]}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div className="flex min-w-0 flex-col space-y-1 sm:flex-1">
              <span>{t('settings.network.dns.servers')}</span>
              <span className="text-xs text-neutral-500">{serversDescription}</span>
            </div>

            <div className="flex min-w-0 flex-col space-y-2 sm:shrink-0 sm:items-end">
              <Select
                className="w-full sm:w-96 [&_.ant-select-content]:justify-end"
                mode="tags"
                open={false}
                tokenSeparators={[',', ' ']}
                value={dnsMode === 'manual' ? servers : dhcp}
                disabled={dnsMode !== 'manual' || disabled || isLoading || isSaving}
                placeholder="1.1.1.1 or 2606:4700:4700::1111"
                status={
                  dnsMode === 'manual' && (hasInvalidServer || isExceedMax) ? 'error' : undefined
                }
                suffixIcon={null}
                tagRender={(tag) => (
                  // antd's own tag markup, so it looks like the default tags apart from the red
                  // for an address that is not valid
                  <span
                    className={`ant-select-selection-item ${
                      isValidIP(normalizeServer(String(tag.value)))
                        ? ''
                        : '!border-red-400 !text-red-400'
                    }`}
                  >
                    <span className="ant-select-selection-item-content">{tag.label}</span>
                    {tag.closable && (
                      <span
                        className="ant-select-selection-item-remove"
                        onMouseDown={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                        }}
                        onClick={tag.onClose}
                      >
                        <XIcon size={12} />
                      </span>
                    )}
                  </span>
                )}
                onChange={(next) => {
                  setMessage('');
                  setError('');
                  setServers(next.map(String));
                }}
              />

              {(hasInvalidServer || hasInvalidNetwork || isExceedMax) && (
                <div className="space-y-1 sm:text-right">
                  {hasInvalidServer && (
                    <div className="text-xs text-red-400">{t('settings.network.dns.invalid')}</div>
                  )}
                  {hasInvalidNetwork && (
                    <div className="text-xs text-red-400">
                      {t('settings.network.dns.invalidNetwork')}
                    </div>
                  )}
                  {isExceedMax && (
                    <div className="text-xs text-red-400">
                      {t('settings.network.dns.maxServers', { count: maxServers })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

DNS.displayName = 'DNS';
