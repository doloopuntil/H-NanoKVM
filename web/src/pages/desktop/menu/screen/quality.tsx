import { useAtomValue } from 'jotai';
import { SquareActivityIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { updateScreen } from '@/api/vm';
import { attempt } from '@/lib/feedback.ts';
import { setQuality as setCookie } from '@/lib/localstorage.ts';
import { videoModeAtom } from '@/jotai/screen.ts';
import { MenuOption } from '@/components/menu-rows.tsx';
import { MenuSubmenu } from '@/components/menu-submenu.tsx';

import { BitRateMap, QualityMap } from './constants.ts';

type QualityProps = {
  quality: number;
  setQuality: (quality: number) => void;
};

export const Quality = ({ quality, setQuality }: QualityProps) => {
  const { t } = useTranslation();
  const videoMode = useAtomValue(videoModeAtom);

  const qualityList = [
    { key: 1, label: t('screen.qualityLossless') },
    { key: 2, label: t('screen.qualityHigh') },
    { key: 3, label: t('screen.qualityMedium') },
    { key: 4, label: t('screen.qualityLow') }
  ];

  async function update(key: number) {
    const value = videoMode === 'mjpeg' ? QualityMap.get(key)! : BitRateMap.get(key)!;

    const rsp = await attempt(() => updateScreen('quality', value));
    if (!rsp) return;

    setQuality(key);
    setCookie(key);
  }

  const content = (
    <>
      {qualityList.map((item) => (
        <MenuOption key={item.key} selected={item.key === quality} onClick={() => update(item.key)}>
          <span className="whitespace-nowrap">{item.label}</span>
        </MenuOption>
      ))}
    </>
  );

  return (
    <MenuSubmenu
      icon={<SquareActivityIcon size={16} />}
      label={t('screen.quality')}
      content={content}
    />
  );
};
