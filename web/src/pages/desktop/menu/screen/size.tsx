import { ReactElement } from 'react';
import { useAtom } from 'jotai';
import { Maximize2Icon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import * as storage from '@/lib/localstorage.ts';
import { screenFillAtom } from '@/jotai/screen.ts';
import { MenuOption } from '@/components/menu-rows.tsx';
import { MenuSubmenu } from '@/components/menu-submenu.tsx';

export const Size = (): ReactElement => {
  const { t } = useTranslation();
  const [fill, setFill] = useAtom(screenFillAtom);

  function update(value: boolean): void {
    setFill(value);
    storage.setScreenFill(value);
  }

  const content = (
    <>
      <MenuOption selected={fill} onClick={() => update(true)}>
        {t('screen.sizeFill')}
      </MenuOption>
      <MenuOption selected={!fill} onClick={() => update(false)}>
        {t('screen.sizeNative')}
      </MenuOption>
    </>
  );

  return (
    <MenuSubmenu icon={<Maximize2Icon size={16} />} label={t('screen.size')} content={content} />
  );
};
