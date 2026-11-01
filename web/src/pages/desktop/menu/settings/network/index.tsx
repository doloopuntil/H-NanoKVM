import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { SectionDivider, SettingSection } from '@/components/setting-rows.tsx';

import type { SystemActionHandle, SystemActionState } from '../system/action.ts';
import { DNS } from './dns.tsx';
import { IPv6 } from './ipv6.tsx';
import type { NetworkSectionHandle, NetworkSectionStatus } from './types.ts';
import { idleNetworkSectionStatus } from './types.ts';
import { Wifi } from './wifi.tsx';

type NetworkProps = {
  onActionStateChange?: (state: SystemActionState) => void;
};

export const Network = forwardRef<SystemActionHandle, NetworkProps>(
  ({ onActionStateChange }, ref) => {
    const { t } = useTranslation();
    const dnsRef = useRef<NetworkSectionHandle>(null);
    const ipv6Ref = useRef<NetworkSectionHandle>(null);
    const [dnsStatus, setDNSStatus] = useState<NetworkSectionStatus>(idleNetworkSectionStatus);
    const [ipv6Status, setIPv6Status] = useState<NetworkSectionStatus>(idleNetworkSectionStatus);
    const [isApplying, setIsApplying] = useState(false);

    const applyNetwork = useCallback(async () => {
      if (isApplying) return;

      setIsApplying(true);
      try {
        const ipv6Result = await ipv6Ref.current?.apply();
        if (ipv6Result?.error) return;

        const dnsResult = await dnsRef.current?.apply();
        if (dnsResult?.error) return;
      } finally {
        setIsApplying(false);
      }
    }, [isApplying]);

    const statuses = [dnsStatus, ipv6Status];
    const hasPending = statuses.some((status) => status.hasPending);
    const hasInvalid = statuses.some((status) => status.hasInvalid);
    const isBusy = isApplying || statuses.some((status) => status.isLoading || status.isSaving);
    const canApply =
      hasPending &&
      !hasInvalid &&
      !isBusy &&
      statuses.every((status) => !status.hasPending || status.canApply);
    const status =
      statuses.find((item) => item.statusKind === 'error' && item.statusText) ||
      statuses.find((item) => item.statusKind === 'success' && item.statusText) ||
      statuses.find((item) => item.statusKind === 'warning' && item.statusText);
    const statusText = status?.statusText || (hasPending ? t('settings.network.dns.unsaved') : '');
    useImperativeHandle(ref, () => ({ save: applyNetwork }), [applyNetwork]);

    useEffect(() => {
      onActionStateChange?.({
        hasPending,
        hasInvalid,
        canSave: canApply,
        isBusy,
        statusText,
        statusKind: status?.statusKind || (hasPending ? 'warning' : ''),
        label: t('settings.network.dns.apply')
      });
    }, [
      canApply,
      hasInvalid,
      hasPending,
      isBusy,
      onActionStateChange,
      status?.statusKind,
      statusText,
      t
    ]);

    return (
      <>
        <div className="flex flex-col gap-6">
          <SettingSection title={t('settings.network.connection')}>
            <Wifi />
          </SettingSection>

          <SectionDivider />

          <DNS ref={dnsRef} disabled={isApplying} onStatusChange={setDNSStatus} />
          <SectionDivider />
          <IPv6 ref={ipv6Ref} disabled={isApplying} onStatusChange={setIPv6Status} />
        </div>
      </>
    );
  }
);

Network.displayName = 'Network';
