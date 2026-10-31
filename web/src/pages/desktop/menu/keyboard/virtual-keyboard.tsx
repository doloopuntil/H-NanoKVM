import { useSetAtom } from 'jotai';
import { KeyboardIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { isKeyboardOpenAtom } from '@/jotai/keyboard.ts';
import { MenuRow } from '@/components/menu-rows.tsx';

export const VirtualKeyboard = () => {
  const { t } = useTranslation();
  const setIsKeyboardOpen = useSetAtom(isKeyboardOpenAtom);

  return (
    <MenuRow icon={<KeyboardIcon size={16} />} onClick={() => setIsKeyboardOpen((o) => !o)}>
      {t('keyboard.virtual')}
    </MenuRow>
  );
};
