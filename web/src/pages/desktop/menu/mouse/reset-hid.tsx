import { useState } from 'react';
import clsx from 'clsx';
import { RefreshCwIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import * as api from '@/api/hid.ts';
import { attempt } from '@/lib/feedback.ts';
import { client, MessageEvent } from '@/lib/websocket.ts';
import { MenuRow } from '@/components/menu-rows.tsx';

export const ResetHid = () => {
  const { t } = useTranslation();

  const [isResetting, setIsResetting] = useState(false);

  function resetHid() {
    if (isResetting) return;
    setIsResetting(true);

    // Release keyboard keys
    const data = new Uint8Array([MessageEvent.Keyboard, 0, 0, 0, 0, 0, 0, 0, 0]);
    client.send(data);

    client.close();

    attempt(() => api.reset()).finally(() => {
      client.connect();
      setIsResetting(false);
    });
  }

  return (
    <MenuRow
      icon={
        <RefreshCwIcon className={clsx({ 'animate-spin text-blue-500': isResetting })} size={16} />
      }
      onClick={resetHid}
    >
      {t('mouse.resetHid')}
    </MenuRow>
  );
};
