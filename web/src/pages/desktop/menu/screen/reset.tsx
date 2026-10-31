import { useState } from 'react';
import clsx from 'clsx';
import { RefreshCwIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import * as api from '@/api/vm.ts';
import { attempt } from '@/lib/feedback.ts';
import { MenuRow } from '@/components/menu-rows.tsx';

export const Reset = () => {
  const { t } = useTranslation();

  const [isResetting, setIsResetting] = useState(false);

  function reset() {
    if (isResetting) return;
    setIsResetting(true);

    attempt(() => api.resetHdmi()).finally(() => {
      setTimeout(() => {
        setIsResetting(false);
      }, 1000);
    });
  }

  return (
    <MenuRow
      icon={
        <RefreshCwIcon className={clsx({ 'animate-spin text-blue-500': isResetting })} size={16} />
      }
      onClick={reset}
    >
      {t('screen.resetHdmi')}
    </MenuRow>
  );
};
