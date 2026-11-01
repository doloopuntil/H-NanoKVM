import { GithubOutlined } from '@ant-design/icons';
import { BookOpenIcon } from 'lucide-react';
import { Trans, useTranslation } from 'react-i18next';

import { SettingSection } from '@/components/setting-rows.tsx';

const SIPEED_URL = 'https://github.com/sipeed/NanoKVM';
const WOFFKO_URL = 'https://github.com/woffko/Hardened_NanoKVM';
const creditLinkClass = 'text-neutral-400 hover:text-neutral-200';

export const Community = () => {
  const { t } = useTranslation();

  const communities = [
    { name: 'Wiki', icon: <BookOpenIcon size={24} />, url: 'https://wiki.sipeed.com/nanokvm' },
    {
      name: 'GitHub',
      icon: <GithubOutlined style={{ fontSize: '20px' }} width={24} height={24} />,
      url: 'https://github.com/doloopuntil/Hardened_NanoKVM'
    }
  ];

  return (
    <SettingSection title={t('settings.about.community')}>
      <div className="flex flex-wrap gap-3">
        {communities.map((community) => (
          <a
            key={community.name}
            className="flex h-16 w-24 flex-col items-center justify-center space-y-2 rounded-lg text-neutral-300 outline outline-1 outline-neutral-800 hover:bg-neutral-800 hover:text-white focus:bg-neutral-800"
            href={community.url}
            target="_blank"
          >
            {community.icon}
            <span className="text-xs">{community.name}</span>
          </a>
        ))}
      </div>
      <p className="text-xs wrap-break-word text-neutral-500">
        <Trans
          i18nKey="settings.about.credit"
          components={{
            a1: <a className={creditLinkClass} href={SIPEED_URL} target="_blank" />,
            a2: <a className={creditLinkClass} href={WOFFKO_URL} target="_blank" />
          }}
        />
      </p>
    </SettingSection>
  );
};
