import { useAtom } from 'jotai';
import { SquareDashedMousePointerIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import * as ls from '@/lib/localstorage.ts';
import { client } from '@/lib/websocket.ts';
import { mouseModeAtom } from '@/jotai/mouse.ts';
import { MenuOption } from '@/components/menu-rows.tsx';
import { MenuSubmenu } from '@/components/menu-submenu.tsx';

export const MouseMode = () => {
  const { t } = useTranslation();

  const [mouseMode, setMouseMode] = useAtom(mouseModeAtom);

  const mouseModes = [
    { name: t('mouse.absolute'), value: 'absolute' },
    { name: t('mouse.relative'), value: 'relative' }
  ];

  function updateMouseMode(mode: string) {
    setMouseMode(mode);
    ls.setMouseMode(mode);

    if (mode === 'relative') {
      client.close();
      setTimeout(() => {
        client.connect();
      }, 500);
    }
  }

  const content = (
    <>
      {mouseModes.map((mode) => (
        <MenuOption
          key={mode.value}
          selected={mode.value === mouseMode}
          onClick={() => updateMouseMode(mode.value)}
        >
          {mode.name}
        </MenuOption>
      ))}
    </>
  );

  return (
    <MenuSubmenu
      icon={<SquareDashedMousePointerIcon size={16} />}
      label={t('mouse.mode')}
      content={content}
    />
  );
};
