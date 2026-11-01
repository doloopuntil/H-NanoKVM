import { useState } from 'react';
import { Button } from 'antd';
import { useTranslation } from 'react-i18next';

import * as api from '@/api/extensions/tailscale.ts';
import { SettingSection } from '@/components/setting-rows.tsx';

type InstallProps = {
  setIsLocked: (setIsLocked: boolean) => void;
  onSuccess: () => void;
};

export const Install = ({ setIsLocked, onSuccess }: InstallProps) => {
  const { t } = useTranslation();

  const [state, setState] = useState('');

  function install() {
    if (state === 'installing') return;
    setState('installing');
    setIsLocked(true);

    api
      .install()
      .then((rsp) => {
        if (rsp.code !== 0) {
          setState('failed');
          return;
        }

        onSuccess();
        setState('');
      })
      .catch(() => {
        setState('failed');
      })
      .finally(() => {
        setIsLocked(false);
      });
  }

  if (state === 'failed') {
    return (
      <SettingSection
        title={t('settings.tailscale.failed')}
        description={t('settings.tailscale.retry')}
      >
        <ol className="list-decimal space-y-1 pl-10 text-sm text-neutral-300">
          <li>
            {t('settings.tailscale.download')}
            <a
              className="px-1"
              href="https://pkgs.tailscale.com/stable/tailscale_latest_riscv64.tgz"
              target="_blank"
            >
              {t('settings.tailscale.package')}
            </a>
            {t('settings.tailscale.unzip')}
          </li>
          <li>{t('settings.tailscale.upTailscale')}</li>
          <li>{t('settings.tailscale.upTailscaled')}</li>
          <li>{t('settings.tailscale.refresh')}</li>
        </ol>
      </SettingSection>
    );
  }

  return (
    <SettingSection
      title={t('settings.network.connection')}
      description={t('settings.tailscale.notInstall')}
    >
      <div className="flex justify-end">
        <Button type="primary" loading={state === 'installing'} onClick={install}>
          {state === 'installing'
            ? t('settings.tailscale.installing')
            : t('settings.tailscale.install')}
        </Button>
      </div>
    </SettingSection>
  );
};
