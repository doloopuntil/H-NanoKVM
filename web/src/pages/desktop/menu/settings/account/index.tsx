import { useState } from 'react';
import { Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import * as api from '@/api/auth.ts';
import { useSettingsLoad } from '@/hooks/useSettingsLoad.ts';
import { PageHeader } from '@/components/page-header.tsx';
import { InfoRow, SectionDivider, SettingRow, SettingSection } from '@/components/setting-rows.tsx';
import { TotpEnrollment } from '@/components/totp-enrollment.tsx';

import { Logout } from './logout.tsx';
import { SessionSettings } from './session-lock.tsx';

type Props = {
  setIsLocked?: (locked: boolean) => void;
};

export const Account = ({ setIsLocked }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');

  useSettingsLoad(api.getAccount, (rsp) => setUsername(rsp.data.username));

  function changePassword() {
    navigate('/auth/password');
  }

  return (
    <>
      <PageHeader title={t('settings.account.title')} />

      <div className="flex min-w-0 flex-col gap-6">
        <SettingSection title={t('auth.login')}>
          <InfoRow label={t('settings.account.webAccount')} value={username} />

          <SettingRow
            label={t('settings.account.password')}
            description={t('settings.account.passwordDesc')}
            inline
          >
            <Button onClick={changePassword}>{t('settings.account.updateBtn')}</Button>
          </SettingRow>
        </SettingSection>

        <SectionDivider />

        <SettingSection title={t('settings.account.totp.title')}>
          <TotpEnrollment setIsLocked={setIsLocked} />
        </SettingSection>

        <SectionDivider />

        <SettingSection title={t('settings.account.session.title')}>
          <SessionSettings />
        </SettingSection>

        <SectionDivider />

        <div className="flex justify-end">
          <Logout />
        </div>
      </div>
    </>
  );
};
