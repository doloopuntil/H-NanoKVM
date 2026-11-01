import { ReactElement, useEffect } from 'react';
import { useAtom } from 'jotai';
import { ScalingIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import * as storage from '@/lib/localstorage.ts';
import { videoScaleAtom } from '@/jotai/screen.ts';
import { MenuOption } from '@/components/menu-rows.tsx';
import { MenuSubmenu } from '@/components/menu-submenu.tsx';

const ScaleList = [200, 150, 125, ...Array.from({ length: 19 }, (_, index) => 100 - index * 5)]
  .filter((percent) => percent >= 10)
  .map((percent) => ({ label: String(percent), value: percent / 100 }));

export const Scale = (): ReactElement => {
  const { t } = useTranslation();

  const [videoScale, setVideoScale] = useAtom(videoScaleAtom);

  useEffect(() => {
    const scale = storage.getVideoScale();
    if (scale) {
      setVideoScale(scale);
    }
  }, [setVideoScale]);

  async function update(scale: number): Promise<void> {
    setVideoScale(scale);
    storage.setVideoScale(scale);
  }

  const content = (
    <>
      {ScaleList.map((scale) => (
        <MenuOption
          key={scale.value}
          selected={scale.value === videoScale}
          onClick={() => update(scale.value)}
        >
          {scale.label}%
        </MenuOption>
      ))}
    </>
  );

  return (
    <MenuSubmenu icon={<ScalingIcon size={16} />} label={t('screen.scale')} content={content} />
  );
};
