import { SquareTerminalIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { MenuRow } from '@/components/menu-rows.tsx';

export const Nanokvm = () => {
  const { t } = useTranslation();

  function openTerminal() {
    window.open('/#terminal', '_blank');
  }

  return (
    <MenuRow icon={<SquareTerminalIcon size={16} />} onClick={openTerminal}>
      {t('terminal.nanokvm')}
    </MenuRow>
  );
};
