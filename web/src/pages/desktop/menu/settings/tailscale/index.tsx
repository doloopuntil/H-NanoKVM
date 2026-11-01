import { useState } from 'react';
import { Divider } from 'antd';
import { LoaderCircleIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import * as api from '@/api/extensions/tailscale.ts';
import { useSettingsLoadState } from '@/hooks/useSettingsLoad.ts';
import { PageHeader } from '@/components/page-header.tsx';
import { SettingSection } from '@/components/setting-rows.tsx';

import { Device } from './device.tsx';
import { Install } from './install.tsx';
import { Login } from './login.tsx';
import { Logout } from './logout.tsx';
import { Memory } from './memory.tsx';
import { Run } from './run.tsx';
import { Service } from './service.tsx';
import { Swap } from './swap.tsx';
import type { Status } from './types.ts';
import { Uninstall } from './uninstall.tsx';

type TailscaleProps = {
  setIsLocked: (isLocked: boolean) => void;
};

export const Tailscale = ({ setIsLocked }: TailscaleProps) => {
  const { t } = useTranslation();

  const [status, setStatus] = useState<Status>();
  const { status: loadStatus, reload } = useSettingsLoadState(api.getStatus, (rsp) =>
    setStatus(rsp.data)
  );
  const isLoading = loadStatus === 'loading';
  const isInstalled = !!status && status.state !== 'notInstall';
  // restarting and stopping only make sense once the daemon is running
  const canControl = !!status && ['notLogin', 'stopped', 'running'].includes(status.state);
  const isSignedIn = status?.state === 'stopped' || status?.state === 'running';

  return (
    <>
      <PageHeader title={t('settings.tailscale.title')} />

      {isLoading ? (
        <div className="flex w-full items-center justify-center space-x-2 pt-5 text-neutral-500">
          <LoaderCircleIcon className="animate-spin" size={16} />
          <span>{t('settings.tailscale.loading')}</span>
        </div>
      ) : (
        <div className="flex min-w-0 flex-col space-y-6">
          {status?.state === 'notInstall' && (
            <Install setIsLocked={setIsLocked} onSuccess={reload} />
          )}

          {status?.state === 'notRunning' && <Run onSuccess={reload} />}

          {status?.state === 'notLogin' && <Login onSuccess={reload} />}

          {(status?.state === 'stopped' || status?.state === 'running') && (
            <Device status={status} />
          )}

          {isInstalled && (
            <>
              <Divider className="opacity-50" />

              <SettingSection title={t('settings.tailscale.performance')}>
                <Memory />
                <Swap />
              </SettingSection>

              {canControl && (
                <>
                  <Divider className="opacity-50" />

                  <Service onSuccess={reload} />
                </>
              )}

              <Divider className="opacity-50" />

              <div className="flex flex-wrap justify-end gap-2">
                {isSignedIn && <Logout onSuccess={reload} />}
                <Uninstall onSuccess={reload} />
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};
