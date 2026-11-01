import { Tooltip } from 'antd';
import { useSetAtom } from 'jotai';
import { BotIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { picoclawChatOpenAtom } from '@/jotai/picoclaw.ts';

export const Picoclaw = () => {
  const { t } = useTranslation();
  const setIsChatOpen = useSetAtom(picoclawChatOpenAtom);

  return (
    <Tooltip title={t('picoclaw.title')} mouseEnterDelay={0.6} placement="bottom">
      <div
        className="flex size-7.5 cursor-pointer items-center justify-center rounded-sm text-neutral-300 hover:bg-neutral-700/80 hover:text-white"
        onClick={() => setIsChatOpen((open) => !open)}
      >
        <BotIcon size={18} />
      </div>
    </Tooltip>
  );
};
