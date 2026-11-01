import { useState } from 'react';
import { Button } from 'antd';
import { useTranslation } from 'react-i18next';

import * as api from '@/api/extensions/tailscale.ts';
import { attempt } from '@/lib/feedback.ts';
import { SettingSection } from '@/components/setting-rows.tsx';

type LoginProps = {
  onSuccess: () => void;
};

export const Login = ({ onSuccess }: LoginProps) => {
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const [loginUrl, setLoginUrl] = useState('');

  function login() {
    if (isLoading) return;
    setIsLoading(true);

    attempt(() => api.login())
      .then((rsp) => {
        if (!rsp) return;

        const url = rsp.data.url;
        if (!url) {
          onSuccess();
          return;
        }

        setLoginUrl(url);
        window.open(url, '_blank');
        setTimeout(() => setLoginUrl(''), 10 * 60 * 1000);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <SettingSection
      title={t('settings.network.connection')}
      description={t('settings.tailscale.notLogin')}
    >
      {loginUrl === '' ? (
        <div className="flex justify-end">
          <Button type="primary" loading={isLoading} onClick={login}>
            {t('settings.tailscale.login')}
          </Button>
        </div>
      ) : (
        <>
          <div className="flex min-w-0 flex-col gap-1">
            <a className="text-sm break-all" href={loginUrl} target="_blank" rel="noreferrer">
              {loginUrl}
            </a>
            <span className="text-xs text-neutral-500">{t('settings.tailscale.urlPeriod')}</span>
          </div>

          <div className="flex justify-end">
            <Button type="primary" onClick={onSuccess}>
              {t('settings.tailscale.loginSuccess')}
            </Button>
          </div>
        </>
      )}
    </SettingSection>
  );
};
