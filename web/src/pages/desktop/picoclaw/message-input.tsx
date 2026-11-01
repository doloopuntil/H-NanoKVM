import { useEffect, useRef, useState } from 'react';
import { Button, Tooltip } from 'antd';
import clsx from 'clsx';
import { useSetAtom } from 'jotai';
import { SendIcon, SquarePenIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { isKeyboardEnableAtom } from '@/jotai/keyboard.ts';
import type { PicoclawTransportState } from '@/jotai/picoclaw.ts';

type MessageInputProps = {
  transportState: PicoclawTransportState;
  onSend: (content: string) => void | Promise<void>;
  onNewConversation: () => void | Promise<void>;
  disableNewConversation?: boolean;
};

export const MessageInput = ({
  transportState,
  onSend,
  onNewConversation,
  disableNewConversation
}: MessageInputProps) => {
  const { t } = useTranslation();
  const setIsKeyboardEnable = useSetAtom(isKeyboardEnableAtom);

  const [value, setValue] = useState('');
  const isComposingRef = useRef(false);

  const isReady = transportState === 'connected';

  useEffect(() => {
    setIsKeyboardEnable(false);
    return () => {
      setIsKeyboardEnable(true);
    };
  }, [setIsKeyboardEnable]);

  async function submit() {
    const content = value.trim();
    if (!content || !isReady) return;
    await onSend(content);
    setValue('');
  }

  return (
    <div
      className={clsx(
        // the panel at the bottom of the sidebar, as wide as the sidebar
        'flex shrink-0 flex-col border-t border-white/[0.06] bg-white/[0.04] transition-colors focus-within:bg-white/[0.06]',
        !isReady && 'opacity-40'
      )}
    >
      <textarea
        rows={4}
        value={value}
        disabled={!isReady}
        placeholder={isReady ? t('picoclaw.inputPlaceholder') : '...'}
        onChange={(e) => setValue(e.target.value)}
        onCompositionStart={() => {
          isComposingRef.current = true;
        }}
        onCompositionEnd={() => {
          isComposingRef.current = false;
        }}
        onKeyDown={(e) => {
          const nativeEvent = e.nativeEvent as KeyboardEvent & {
            isComposing?: boolean;
            keyCode?: number;
          };
          if (isComposingRef.current || nativeEvent.isComposing || nativeEvent.keyCode === 229) {
            return;
          }
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            void submit();
          }
        }}
        className="block w-full resize-none px-4 py-3 text-sm text-neutral-100 placeholder-neutral-600 outline-hidden"
      />
      {/* Under the text, so that neither the text nor its scrollbar runs below the buttons. Like the
          save bar of the Settings: a hairline above and a shadow-sm that pushes up from there. */}
      <div className="relative z-10 flex items-center justify-end gap-2 border-t border-white/[0.06] p-2.5 shadow-[0_-20px_20px_-20px_rgba(0,0,0,0.5)]">
        <Tooltip title={t('picoclaw.newConversation')} mouseEnterDelay={0.6}>
          <Button
            icon={<SquarePenIcon size={16} />}
            aria-label={t('picoclaw.newConversation')}
            onClick={() => void onNewConversation()}
            disabled={disableNewConversation}
            className="flex! !h-7 !w-7 items-center! justify-center! !rounded-lg"
          />
        </Tooltip>
        <Tooltip title={t('picoclaw.send')} mouseEnterDelay={0.6}>
          <Button
            type="primary"
            icon={<SendIcon size={16} />}
            aria-label={t('picoclaw.send')}
            onClick={() => void submit()}
            disabled={!isReady || !value.trim()}
            className="flex! !h-7 !w-7 items-center! justify-center! !rounded-lg"
          />
        </Tooltip>
      </div>
    </div>
  );
};
