import { useAtom } from 'jotai';
import { KeyboardIcon, SmartphoneIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { isLocalKeyboardOpenAtom } from '@/jotai/keyboard.ts';
import { useIsTouchLayout } from '@/hooks/useResponsiveLayout.ts';
import { MenuRow } from '@/components/menu-rows.tsx';
import {
  blurMobileLocalKeyboard,
  focusMobileLocalKeyboard
} from '@/pages/desktop/mobile-local-keyboard';

export const LocalKeyboard = () => {
  const { t } = useTranslation();
  const isTouchLayout = useIsTouchLayout();
  const [isLocalKeyboardOpen, setIsLocalKeyboardOpen] = useAtom(isLocalKeyboardOpenAtom);

  if (!isTouchLayout) {
    return null;
  }

  function toggleLocalKeyboard() {
    if (isLocalKeyboardOpen) {
      setIsLocalKeyboardOpen(false);
      blurMobileLocalKeyboard();
      return;
    }

    setIsLocalKeyboardOpen(true);
    focusMobileLocalKeyboard();
  }

  return (
    <MenuRow
      active={isLocalKeyboardOpen}
      icon={
        <span className="relative flex size-4 items-center justify-center">
          <KeyboardIcon size={16} />
          <SmartphoneIcon size={10} className="absolute -right-1 -top-1 rounded bg-neutral-800" />
        </span>
      }
      onClick={toggleLocalKeyboard}
    >
      {t('keyboard.local')}
    </MenuRow>
  );
};
