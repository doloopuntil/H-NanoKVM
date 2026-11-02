import { Slider } from 'antd';
import { useAtom } from 'jotai';
import { GaugeIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import * as storage from '@/lib/localstorage.ts';
import { scrollIntervalAtom } from '@/jotai/mouse.ts';
import { MenuSubmenu } from '@/components/menu-submenu.tsx';

const MAX_INTERVAL = 300;

function interval2Speed(interval: number) {
  if (interval === MAX_INTERVAL) {
    return 0;
  }
  return ((MAX_INTERVAL - interval) * 100) / MAX_INTERVAL;
}

function speed2Interval(speed: number) {
  return MAX_INTERVAL - speed * (MAX_INTERVAL / 100);
}

export const Speed = () => {
  const { t } = useTranslation();

  const [scrollInterval, setScrollInterval] = useAtom(scrollIntervalAtom);

  const scrollSpeed = interval2Speed(scrollInterval);

  function update(speed: number): void {
    const interval = speed2Interval(speed);
    setScrollInterval(interval);
    storage.setMouseScrollInterval(interval);
  }

  const content = (
    <div className="h-37.5 min-w-15 py-3">
      <Slider
        vertical
        marks={{
          0: <span>{t('mouse.slow')}</span>,
          100: <span>{t('mouse.fast')}</span>
        }}
        range={false}
        included={false}
        step={10}
        defaultValue={scrollSpeed}
        onChange={update}
      />
    </div>
  );

  return <MenuSubmenu icon={<GaugeIcon size={16} />} label={t('mouse.speed')} content={content} />;
};
