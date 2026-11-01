import { useTranslation } from 'react-i18next';

import { PageHeader } from '@/components/page-header.tsx';
import { SectionDivider, SettingSection } from '@/components/setting-rows.tsx';

import { KeyboardLedStatusSetting } from './keyboard-led-status.tsx';
import { Language } from './language.tsx';
import { LayoutMode } from './layout-mode.tsx';
import { MenuIcons } from './menu-icons.tsx';
import { MenuMode } from './menu-mode.tsx';
import { WebTitle } from './web-title.tsx';

export const Appearance = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageHeader title={t('settings.appearance.title')} />

      <div className="flex min-w-0 flex-col gap-6">
        <SettingSection title={t('settings.appearance.display')}>
          <Language />
          <WebTitle />
          <LayoutMode />
        </SettingSection>

        <SectionDivider />

        <SettingSection title={t('settings.appearance.menuBar.title')}>
          <MenuMode />
          <KeyboardLedStatusSetting />
        </SettingSection>

        <SectionDivider />

        <MenuIcons />
      </div>
    </>
  );
};
