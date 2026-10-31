import { useEffect, useRef } from 'react';
import { BotIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import type { PicoclawChatMessage, PicoclawRunState } from '@/jotai/picoclaw.ts';

import { EmptyState } from './empty-state.tsx';
import { MessageLoading } from './message-loading.tsx';
import { Message } from './message.tsx';

type MessageListProps = {
  messages: PicoclawChatMessage[];
  runState: PicoclawRunState;
};

export const MessageList = ({ messages, runState }: MessageListProps) => {
  const { t } = useTranslation();
  const isLoading = runState === 'busy';
  const containerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const shouldAutoScrollRef = useRef(true);

  function scrollToBottom(behavior: ScrollBehavior = 'smooth') {
    const container = containerRef.current;
    if (!container || !shouldAutoScrollRef.current) {
      return;
    }

    container.scrollTo({
      top: container.scrollHeight,
      behavior
    });
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    const content = contentRef.current;
    if (!content || typeof ResizeObserver === 'undefined') {
      return;
    }

    const observer = new ResizeObserver(() => {
      scrollToBottom('auto');
    });
    observer.observe(content);

    return () => {
      observer.disconnect();
    };
  }, []);

  function handleScroll() {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;
    shouldAutoScrollRef.current = distanceFromBottom <= 24;
  }

  return (
    <div
      ref={containerRef}
      className="min-h-0 flex-1 overflow-y-auto px-4 py-4"
      onScroll={handleScroll}
    >
      <div ref={contentRef} className={messages.length === 0 ? 'min-h-full' : 'space-y-3'}>
        {messages.length === 0 ? (
          <div className="flex h-full min-h-[200px]">
            <EmptyState icon={<BotIcon size={24} />} title={t('picoclaw.empty')}>
              {isLoading && <MessageLoading text={t('picoclaw.processing')} />}
            </EmptyState>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <Message key={message.id} message={message} />
            ))}
            {isLoading && <MessageLoading text={t('picoclaw.processing')} />}
          </>
        )}
      </div>
    </div>
  );
};
