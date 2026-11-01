import { useAtom } from 'jotai';
import { ArrowDownUpIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import * as storage from '@/lib/localstorage.ts';
import { scrollDirectionAtom } from '@/jotai/mouse.ts';
import { MenuOption } from '@/components/menu-rows.tsx';
import { MenuSubmenu } from '@/components/menu-submenu.tsx';

export const Direction = () => {
  const { t } = useTranslation();

  const [scrollDirection, setScrollDirection] = useAtom(scrollDirectionAtom);

  const directions = [
    { name: t('mouse.scrollUp'), value: -1 },
    { name: t('mouse.scrollDown'), value: 1 }
  ];

  function update(direction: number): void {
    const value = Number(direction);

    setScrollDirection(value);
    storage.setMouseScrollDirection(value);
  }

  const content = (
    <>
      {directions.map((direction) => (
        <MenuOption
          key={direction.value}
          selected={direction.value === scrollDirection}
          onClick={() => update(direction.value)}
        >
          {direction.name}
        </MenuOption>
      ))}
    </>
  );

  return (
    <MenuSubmenu
      icon={<ArrowDownUpIcon size={16} />}
      label={t('mouse.direction')}
      content={content}
    />
  );
};
