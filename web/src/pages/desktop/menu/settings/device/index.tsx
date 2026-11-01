import { useTranslation } from 'react-i18next';

import { PageHeader } from '@/components/page-header.tsx';
import { SaveBar } from '@/components/save-bar.tsx';
import { SectionDivider, SettingSection } from '@/components/setting-rows.tsx';

import { Hdmi } from './hdmi.tsx';
import { Hostname } from './hostname.tsx';
import { MouseJiggler } from './mouse-jiggler.tsx';
import { Oled } from './oled.tsx';
import { Poweroff } from './poweroff.tsx';
import { Reboot } from './reboot.tsx';
import { useHostname } from './use-hostname.ts';
import { useRebootPending, type RebootReason } from './use-reboot-pending.ts';
import { VirtualDevices } from './virtual-devices.tsx';

export const Device = () => {
  const { t } = useTranslation();
  const hostname = useHostname();
  const rebootReasons = useRebootPending(hostname.isPending);

  const reasonLabels: Record<RebootReason, string> = {
    hostname: t('settings.about.hostname'),
    overdrive: t('settings.system.performance.overdrive.title'),
    systemUpdate: t('settings.device.rebootReasons.systemUpdate')
  };

  return (
    <>
      <PageHeader title={t('settings.device.title')} />

      <div className="flex flex-col gap-6">
        <SettingSection title={t('settings.device.sections.general')}>
          <Hostname form={hostname} />
        </SettingSection>

        <SectionDivider />

        <SettingSection title={t('settings.device.sections.hostConnection')}>
          <VirtualDevices />
        </SettingSection>

        <SectionDivider />

        <SettingSection title={t('settings.device.sections.inputOutput')}>
          <MouseJiggler />
          <Hdmi />
          <Oled />
        </SettingSection>

        <SectionDivider />

        <div className="flex flex-wrap items-center justify-between gap-3">
          {rebootReasons.length > 0 && (
            <span className="min-w-0 text-xs wrap-break-word text-neutral-500">
              {t('settings.device.rebootPending', {
                reasons: rebootReasons.map((reason) => reasonLabels[reason]).join(', ')
              })}
            </span>
          )}
          <div className="ml-auto flex flex-wrap justify-end gap-2">
            <Poweroff />
            <Reboot />
          </div>
        </div>
      </div>

      {hostname.isDirty && (
        <SaveBar
          statusText={t('settings.network.dns.unsaved')}
          label={t('settings.system.saveChanges')}
          loading={hostname.isSaving}
          disabled={hostname.isInvalid}
          onSave={hostname.save}
          onDiscard={hostname.discard}
          discardLabel={t('common.discard')}
        />
      )}
    </>
  );
};
