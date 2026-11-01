import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { Segmented } from 'antd';
import { useTranslation } from 'react-i18next';

import * as api from '@/api/network.ts';
import type { IPv6Mode } from '@/api/network.ts';
import { useSettingsLoad } from '@/hooks/useSettingsLoad.ts';
import { EditableInfoRow, InfoRow } from '@/components/setting-rows.tsx';

import type { NetworkSectionHandle, NetworkSectionResult, NetworkSectionStatus } from './types.ts';

type IPv6Address = {
  interface: string;
  address: string;
  prefix: number;
  scope: string;
};

type IPv6Config = {
  interface?: string;
  address?: string;
  prefix?: number;
  gateway?: string;
};

type IPv6State = {
  mode: IPv6Mode;
  enabled: boolean;
  active: boolean;
  clientAvailable: boolean;
  clientPath: string;
  addresses: IPv6Address[];
  gateway: string;
  config?: IPv6Config;
  status: string;
  message: string;
};

type IPv6Props = {
  disabled?: boolean;
  onStatusChange?: (status: NetworkSectionStatus) => void;
};

function normalizeIPv6(value: string) {
  return value.trim().split('/')[0].trim();
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

function isValidPrefix(value: string) {
  if (!/^\d+$/.test(value.trim())) return false;
  const prefix = Number(value);
  return prefix >= 1 && prefix <= 128;
}

function formatAddress(address: IPv6Address) {
  return `${address.address}/${address.prefix} (${address.scope})`;
}

export const IPv6 = forwardRef<NetworkSectionHandle, IPv6Props>(
  ({ disabled = false, onStatusChange }, ref) => {
    const { t } = useTranslation();

    const [mode, setMode] = useState<IPv6Mode>('disabled');
    const [originalMode, setOriginalMode] = useState<IPv6Mode>('disabled');
    const [addresses, setAddresses] = useState<IPv6Address[]>([]);
    const [gateway, setGateway] = useState('');
    const [clientAvailable, setClientAvailable] = useState(false);
    const [clientPath, setClientPath] = useState('');
    const [status, setStatus] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const [address, setAddress] = useState('');
    const [prefix, setPrefix] = useState('64');
    const [router, setRouter] = useState('');
    const [originalAddress, setOriginalAddress] = useState('');
    const [originalPrefix, setOriginalPrefix] = useState('64');
    const [originalRouter, setOriginalRouter] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const applyIPv6State = (rsp: { data?: any }) => {
      const data = rsp.data as IPv6State;
      const fetchedMode = data.mode || 'disabled';
      const config = data.config || {};
      const fetchedAddress = normalizeIPv6(config.address || '');
      const fetchedPrefix = String(config.prefix || 64);
      const fetchedRouter = normalizeIPv6(config.gateway || '');

      setMode(fetchedMode);
      setOriginalMode(fetchedMode);
      setAddresses(data.addresses || []);
      setGateway(data.gateway || '');
      setClientAvailable(Boolean(data.clientAvailable));
      setClientPath(data.clientPath || '');
      setStatus(data.status || '');
      setStatusMessage(data.message || '');
      setAddress(fetchedAddress);
      setPrefix(fetchedPrefix);
      setRouter(fetchedRouter);
      setOriginalAddress(fetchedAddress);
      setOriginalPrefix(fetchedPrefix);
      setOriginalRouter(fetchedRouter);
    };

    const isLoaded = useSettingsLoad(api.getIPv6, applyIPv6State);
    const isLoading = !isLoaded;

    // refresh after saving
    async function getIPv6() {
      try {
        const rsp = await api.getIPv6();
        if (rsp.code !== 0) {
          setError(rsp.msg);
          return;
        }

        applyIPv6State(rsp);
      } catch (err) {
        console.log(err);
      }
    }

    async function save(): Promise<NetworkSectionResult> {
      if (isSaving) return { changed: false };
      if (!hasChanges && !needsApply) return { changed: false };

      setMessage('');
      setError('');

      const normalizedAddress = normalizeIPv6(address);
      const normalizedRouter = normalizeIPv6(router);
      const trimmedPrefix = prefix.trim();

      if (mode === 'dhcpv6' && !clientAvailable) {
        setError(t('settings.network.ipv6.clientMissing'));
        return { changed: false, error: true };
      }

      if (
        mode === 'manual' &&
        (!isValidIPv6(normalizedAddress) ||
          !isValidPrefix(trimmedPrefix) ||
          !isValidIPv6(normalizedRouter))
      ) {
        setError(t('settings.network.ipv6.invalidManual'));
        return { changed: false, error: true };
      }

      setIsSaving(true);
      try {
        const rsp = await api.setIPv6(
          mode,
          mode === 'manual'
            ? {
                interface: 'eth0',
                address: normalizedAddress,
                prefix: Number(trimmedPrefix),
                gateway: normalizedRouter
              }
            : undefined
        );
        if (rsp.code !== 0) {
          setError(rsp.msg || t('settings.network.ipv6.saveFailed'));
          return { changed: true, error: true };
        }

        setOriginalMode(mode);
        setOriginalAddress(normalizedAddress);
        setOriginalPrefix(trimmedPrefix);
        setOriginalRouter(normalizedRouter);
        await getIPv6();
        setMessage(t('settings.network.ipv6.saved'));
        return { changed: true };
      } catch (err) {
        console.log(err);
        setError(t('settings.network.ipv6.saveFailed'));
        return { changed: true, error: true };
      } finally {
        setIsSaving(false);
      }
    }

    const normalizedAddress = normalizeIPv6(address);
    const normalizedRouter = normalizeIPv6(router);
    const trimmedPrefix = prefix.trim();
    const hasInvalidManual =
      mode === 'manual' &&
      ((!isValidIPv6(normalizedAddress) && normalizedAddress !== '') ||
        (!isValidPrefix(trimmedPrefix) && trimmedPrefix !== '') ||
        (!isValidIPv6(normalizedRouter) && normalizedRouter !== ''));
    const hasChanges =
      mode !== originalMode ||
      (mode === 'manual' &&
        (normalizedAddress !== originalAddress ||
          trimmedPrefix !== originalPrefix ||
          normalizedRouter !== originalRouter));
    const needsApply = status === 'needs-apply';
    const canSave =
      (hasChanges || needsApply) &&
      !isLoading &&
      !isSaving &&
      !hasInvalidManual &&
      !(mode === 'dhcpv6' && !clientAvailable);
    const statusText =
      error ||
      message ||
      (needsApply ? statusMessage : hasChanges ? t('settings.network.ipv6.unsaved') : '');
    const statusKind = error ? 'error' : message ? 'success' : statusText ? 'warning' : '';
    const addressList = addresses.map(formatAddress).join(', ');
    // what the interface has been given, when the address comes from SLAAC or DHCPv6
    const liveAddress = addresses.find((item) => item.scope !== 'link');
    const statusSnapshot = useMemo<NetworkSectionStatus>(
      () => ({
        hasPending: hasChanges || needsApply,
        hasInvalid: hasInvalidManual || (mode === 'dhcpv6' && !clientAvailable),
        canApply: canSave,
        isLoading,
        isSaving,
        statusText,
        statusKind
      }),
      [
        canSave,
        clientAvailable,
        hasChanges,
        hasInvalidManual,
        isLoading,
        isSaving,
        mode,
        needsApply,
        statusKind,
        statusText
      ]
    );

    useImperativeHandle(ref, () => ({ apply: save }));

    useEffect(() => {
      onStatusChange?.(statusSnapshot);
    }, [onStatusChange, statusSnapshot]);

    return (
      <div className="flex flex-col gap-6">
        <div className="text-neutral-400">{t('settings.network.ipv6.title')}</div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-6">
          <div className="flex min-w-0 flex-col gap-1 sm:flex-1 sm:basis-60">
            <span>{t('settings.network.configuration')}</span>
            <span className="text-xs text-neutral-500">
              {t('settings.network.ipv6.description')}
            </span>
          </div>

          <div className="w-full min-w-0 sm:w-auto sm:flex-none">
            <Segmented
              block
              className="settings-segmented-wrap-labels settings-segmented-fit min-w-full"
              disabled={disabled || isLoading || isSaving}
              value={mode}
              onChange={(val) => {
                setMode(val as IPv6Mode);
                setStatus('');
                setMessage('');
                setError('');
              }}
              options={[
                { label: t('settings.network.ipv6.disabled'), value: 'disabled' },
                { label: t('settings.network.ipv6.slaac'), value: 'slaac' },
                { label: t('settings.network.ipv6.dhcpv6'), value: 'dhcpv6' },
                { label: t('settings.network.ipv6.manual'), value: 'manual' }
              ]}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <InfoRow label={t('settings.network.ipv6.interface')} value="eth0" />

          {mode === 'manual' ? (
            <>
              <EditableInfoRow
                label={t('settings.network.ipv6.ipAddress')}
                value={address}
                placeholder="fd00:1234:abcd:2::132"
                inputWidth="w-56 sm:w-80"
                status={address.trim() && !isValidIPv6(normalizedAddress) ? 'error' : undefined}
                onChange={(value) => {
                  setAddress(value);
                  setMessage('');
                  setError('');
                }}
              />
              <EditableInfoRow
                label={t('settings.network.ipv6.prefix')}
                value={prefix}
                placeholder="64"
                inputWidth="w-20"
                status={prefix.trim() && !isValidPrefix(trimmedPrefix) ? 'error' : undefined}
                onChange={(value) => {
                  setPrefix(value);
                  setMessage('');
                  setError('');
                }}
              />
              <EditableInfoRow
                label={t('settings.network.ipv6.router')}
                value={router}
                placeholder="fe80::1"
                inputWidth="w-56 sm:w-80"
                status={router.trim() && !isValidIPv6(normalizedRouter) ? 'error' : undefined}
                onChange={(value) => {
                  setRouter(value);
                  setMessage('');
                  setError('');
                }}
              />
            </>
          ) : (
            <>
              <InfoRow label={t('settings.network.ipv6.ipAddress')} value={liveAddress?.address} />
              <InfoRow
                label={t('settings.network.ipv6.prefix')}
                value={liveAddress ? String(liveAddress.prefix) : undefined}
              />
              <InfoRow label={t('settings.network.ipv6.router')} value={gateway} />
            </>
          )}

          <InfoRow label={t('settings.network.ipv6.state')} value={statusMessage} />
          <InfoRow
            label={t('settings.network.ipv6.dhcpv6Client')}
            value={clientAvailable ? clientPath : t('settings.network.ipv6.notInstalled')}
          />
          <InfoRow label={t('settings.network.ipv6.addresses')} value={addressList} />
        </div>
      </div>
    );
  }
);

IPv6.displayName = 'IPv6';
