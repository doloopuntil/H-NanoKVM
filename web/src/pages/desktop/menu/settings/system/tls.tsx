import { useState } from 'react';
import { Switch } from 'antd';
import { useTranslation } from 'react-i18next';

import * as api from '@/api/vm.ts';
import { attempt, confirm } from '@/lib/feedback.ts';
import { protocolUrl } from '@/lib/protocol-url.ts';
import { LabelTip } from '@/components/label-tip.tsx';
import { SettingRow } from '@/components/setting-rows.tsx';

// the server restarts, as after an application update; the device keeps running
const REDIRECT_DELAY_SECONDS = 12;

export const Tls = () => {
  const { t } = useTranslation();

  const [isEnabled, setIsEnabled] = useState(() => window.location.protocol === 'https:');
  const [isLoading, setIsLoading] = useState(false);

  function requestUpdate() {
    if (isLoading) return;

    const enable = !isEnabled;
    const target = protocolUrl(enable);

    confirm({
      title: t('settings.network.tls.restartTitle'),
      content: (
        <div className="space-y-2">
          <p>{t('settings.network.tls.restartDesc', { seconds: REDIRECT_DELAY_SECONDS })}</p>
          <p className="font-mono text-xs break-all text-neutral-400">{target}</p>
        </div>
      ),
      okText: t('settings.network.tls.restartOk'),
      cancelText: t('common.cancel'),
      onOk: () => update(enable, target)
    });
  }

  async function update(enable: boolean, target: string) {
    setIsLoading(true);
    const timer = window.setTimeout(() => {
      window.location.assign(target);
    }, REDIRECT_DELAY_SECONDS * 1000);

    const rsp = await attempt(() => api.setTLS(enable));
    if (rsp) {
      setIsEnabled(enable);
      return;
    }

    window.clearTimeout(timer);
    setIsLoading(false);
  }

  return (
    <SettingRow
      label={<LabelTip text="HTTPS" tip={t('settings.network.tls.tip')} warning />}
      description={t('settings.network.tls.description')}
      isSwitch
    >
      <Switch checked={isEnabled} loading={isLoading} onChange={requestUpdate} />
    </SettingRow>
  );
};
