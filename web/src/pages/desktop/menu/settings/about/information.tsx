import { useState } from 'react';
import { EthernetPortIcon, WifiIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { getSystemVersion } from '@/api/application.ts';
import * as api from '@/api/vm.ts';
import { formatHardenedVersion } from '@/lib/hardened.ts';
import { formatUptime } from '@/lib/uptime.ts';
import { useSettingsLoad } from '@/hooks/useSettingsLoad.ts';
import { LabelTip } from '@/components/label-tip.tsx';
import { InfoRow, SettingSection } from '@/components/setting-rows.tsx';

import { Hostname } from './hostname.tsx';

type IP = {
  name: string;
  addr: string;
  version: string;
  type: string;
};

type Info = {
  ips: IP[];
  mdns: string;
  application: string;
  uptime?: number;
  deviceKey: string;
};

export const Information = () => {
  const { t } = useTranslation();

  const [information, setInformation] = useState<Info>();
  const [systemVersion, setSystemVersion] = useState<string>();
  const [isMdnsOn, setIsMdnsOn] = useState(false);

  useSettingsLoad(api.getInfo, (rsp) => setInformation(rsp.data));
  useSettingsLoad(getSystemVersion, (rsp) => setSystemVersion(rsp.data?.current?.version));
  useSettingsLoad(api.getMdnsState, (rsp) => setIsMdnsOn(!!rsp.data?.enabled));

  // where the setting behind a row lives, as a menu path
  const path = (...pages: string[]) => [t('settings.title'), ...pages].join(' > ');
  const tip = (key: string, ...pages: string[]) => t(key, { path: path(...pages) });
  const updatesPath = [t('settings.system.title'), t('settings.update.title')];

  return (
    <SettingSection title={t('settings.about.information')}>
      <div className="space-y-3">
        <Hostname tip={tip('settings.about.changeIn', t('settings.device.title'))} />

        {isMdnsOn && !!information?.mdns && (
          <InfoRow
            label={
              <LabelTip
                text={t('settings.about.mdns')}
                tip={tip(
                  'settings.about.toggleIn',
                  t('settings.networking.title'),
                  t('settings.system.sections.services')
                )}
              />
            }
            value={information.mdns}
          />
        )}

        <InfoRow
          alignStart={(information?.ips.length ?? 0) > 1}
          label={
            <LabelTip
              text={t('settings.about.ip')}
              tip={tip(
                'settings.about.changeIn',
                t('settings.networking.title'),
                t('settings.network.title')
              )}
            />
          }
          value={
            information?.ips && information.ips.length > 0 ? (
              <div className="flex min-w-0 flex-col gap-1">
                {information.ips.map((ip) => (
                  <div key={ip.addr} className="flex min-w-0 items-center justify-end gap-2">
                    <span className="min-w-0 break-all">{ip.addr}</span>
                    <div className="size-4 shrink-0 text-neutral-500">
                      {ip.type === 'Wireless' ? (
                        <WifiIcon size={16} />
                      ) : (
                        <EthernetPortIcon size={16} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : undefined
          }
        />

        <InfoRow
          label={
            <LabelTip
              text={t('settings.about.application')}
              tip={tip('settings.about.updateIn', ...updatesPath)}
            />
          }
          value={information ? formatHardenedVersion(information.application) : undefined}
        />

        <InfoRow
          label={
            <LabelTip
              text={t('settings.update.system.systemVersion')}
              tip={tip('settings.about.updateIn', ...updatesPath)}
            />
          }
          value={systemVersion}
        />

        <InfoRow label={t('settings.about.uptime')} value={formatUptime(information?.uptime)} />
      </div>
    </SettingSection>
  );
};
