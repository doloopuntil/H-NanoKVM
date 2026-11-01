import { useAtom } from 'jotai';
import { EyeOffIcon, HandIcon, MousePointerIcon, PlusIcon, TextCursorIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import * as ls from '@/lib/localstorage.ts';
import { mouseStyleAtom } from '@/jotai/mouse.ts';
import { MenuOption } from '@/components/menu-rows.tsx';
import { MenuSubmenu } from '@/components/menu-submenu.tsx';

export const Cursor = () => {
  const { t } = useTranslation();

  const [mouseStyle, setMouseStyle] = useAtom(mouseStyleAtom);

  const mouseStyles = [
    { name: t('mouse.default'), icon: <MousePointerIcon size={16} />, value: 'cursor-default' },
    { name: t('mouse.grab'), icon: <HandIcon size={16} />, value: 'cursor-grab' },
    { name: t('mouse.cell'), icon: <PlusIcon size={16} />, value: 'cursor-cell' },
    { name: t('mouse.text'), icon: <TextCursorIcon size={16} />, value: 'cursor-text' },
    { name: t('mouse.hide'), icon: <EyeOffIcon size={16} />, value: 'cursor-none' }
  ];

  function updateMouseStyle(style: string) {
    setMouseStyle(style);
    ls.setMouseStyle(style);
  }

  const content = (
    <>
      {mouseStyles.map((style) => (
        <MenuOption
          key={style.value}
          icon={style.icon}
          selected={style.value === mouseStyle}
          onClick={() => updateMouseStyle(style.value)}
        >
          {style.name}
        </MenuOption>
      ))}
    </>
  );

  return (
    <MenuSubmenu
      icon={<MousePointerIcon size={16} />}
      label={t('mouse.cursor')}
      content={content}
    />
  );
};
