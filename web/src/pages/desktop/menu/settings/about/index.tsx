import { useTranslation } from 'react-i18next';

import { PageHeader } from '@/components/page-header.tsx';
import { SectionDivider } from '@/components/setting-rows.tsx';

import { Community } from './community.tsx';
import { Information } from './information.tsx';

export const About = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageHeader title={t('settings.about.title')} />

      <div className="flex flex-col gap-6">
        <Information />
        <SectionDivider />
        <Community />
      </div>
    </>
  );
};
