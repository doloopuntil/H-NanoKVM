import { useRef, useState } from 'react';
import { Button, InputNumber } from 'antd';
import { CheckIcon, ScanBarcodeIcon, XIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { updateScreen } from '@/api/vm';
import { attempt } from '@/lib/feedback.ts';
import { setFps as setCookie } from '@/lib/localstorage';
import { MenuOption } from '@/components/menu-rows.tsx';
import { MenuSubmenu } from '@/components/menu-submenu.tsx';

const fpsList = [
  { key: 60, label: '60Hz' },
  { key: 30, label: '30Hz' },
  { key: 24, label: '24Hz' }
];

const defaultFps = [60, 30, 24];

type FpsProps = {
  fps: number;
  setFps: (fps: number) => void;
};

export const Fps = ({ fps, setFps }: FpsProps) => {
  const { t } = useTranslation();
  const [isCustomize, setIsCustomize] = useState(false);
  const customizeRef = useRef(0);

  function showCustomize() {
    customizeRef.current = fps;
    setIsCustomize(true);
  }

  function onChange(value: any) {
    const num = Number(value);
    if (num > 0 && num <= 60) {
      customizeRef.current = num;
    }
  }

  async function update(value: number) {
    if (isCustomize && customizeRef.current === fps) {
      setIsCustomize(false);
      return;
    }

    const rsp = await attempt(() => updateScreen('fps', value));
    if (!rsp) return;

    setFps(value);
    setCookie(value);
    if (isCustomize) {
      setIsCustomize(false);
    }
  }

  const content = (
    <>
      {/* default fps list */}
      {fpsList.map((item) => (
        <MenuOption key={item.key} selected={item.key === fps} onClick={() => update(item.key)}>
          {item.label}
        </MenuOption>
      ))}

      {/* customize fps */}
      <MenuOption selected={!defaultFps.includes(fps)} onClick={showCustomize}>
        <span>{t('screen.customizeFps')}</span>
        {!defaultFps.includes(fps) && <span className="ml-1 text-xs">{`${fps} Hz`}</span>}
      </MenuOption>

      {isCustomize && (
        <div className="flex w-[140px] items-center space-x-1 py-1">
          <InputNumber<number> defaultValue={fps} min={1} max={60} onChange={onChange} />
          <Button
            size="small"
            icon={<CheckIcon size={16} />}
            onClick={() => update(customizeRef.current)}
          />
          <Button size="small" icon={<XIcon size={16} />} onClick={() => setIsCustomize(false)} />
        </div>
      )}
    </>
  );

  return (
    <MenuSubmenu icon={<ScanBarcodeIcon size={16} />} label={t('screen.fps')} content={content} />
  );
};
