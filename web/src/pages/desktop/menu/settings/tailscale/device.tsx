import { useState } from 'react';
import { Switch } from 'antd';
import { useTranslation } from 'react-i18next';

import * as api from '@/api/extensions/tailscale.ts';
import { attempt } from '@/lib/feedback.ts';
import { InfoRow, SettingRow, SettingSection } from '@/components/setting-rows.tsx';

import { Status } from './types.ts';

type DeviceProps = {
  status: Status;
};

export const Device = ({ status }: DeviceProps) => {
  const { t } = useTranslation();

  const [isRunning, setIsRunning] = useState(status.state === 'running');
  const [isUpdating, setIsUpdating] = useState(false);

  // follow the polled status; a toggle sets isRunning until the next status arrives
  const [lastStatus, setLastStatus] = useState(status);
  if (lastStatus !== status) {
    setLastStatus(status);
    setIsRunning(status.state === 'running');
  }

  async function update() {
    if (isUpdating) return;
    setIsUpdating(true);

    const rsp = await attempt(() => (isRunning ? api.down() : api.up()));
    if (rsp) setIsRunning(!isRunning);

    setIsUpdating(false);
  }

  return (
    <SettingSection title={t('settings.network.connection')}>
      <SettingRow
        label={t('settings.wireguard.tunnel')}
        description={t('settings.tailscale.enableDesc')}
        isSwitch
      >
        <Switch checked={isRunning} loading={isUpdating} onClick={update} />
      </SettingRow>

      <div className="flex flex-col gap-3">
        <InfoRow label={t('settings.tailscale.deviceName')} value={status.name} />
        <InfoRow label={t('settings.tailscale.deviceIP')} value={status.ip} />
        <InfoRow label={t('settings.tailscale.account')} value={status.account} />
      </div>
    </SettingSection>
  );
};
