import { SquareTerminalIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { MenuItem } from '@/components/menu-item.tsx';
import { MenuHeader } from '@/components/menu-rows.tsx';

import { Nanokvm } from './nanokvm';
import { SerialPort } from './serial-port';

export const Terminal = () => {
  const { t } = useTranslation();

  const content = (
    <div className="min-w-[200px]">
      <MenuHeader title={t('terminal.title')} />

      <Nanokvm />
      <SerialPort />
    </div>
  );

  return (
    <MenuItem
      title={t('terminal.title')}
      icon={<SquareTerminalIcon size={18} />}
      content={content}
    />
  );
};
