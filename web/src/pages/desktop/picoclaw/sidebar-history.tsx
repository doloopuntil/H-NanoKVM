import { useMemo } from 'react';
import { Button } from 'antd';
import { HistoryIcon, LoaderCircleIcon, MessageSquareTextIcon, Trash2Icon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import type { PicoclawSessionListItem } from '@/api/picoclaw.ts';
import { confirm } from '@/lib/feedback.ts';

import { EmptyState } from './empty-state.tsx';

type SidebarHistoryProps = {
  sessions: PicoclawSessionListItem[];
  activeSessionId?: string;
  isLoading: boolean;
  isDeleting: boolean;
  isSwitching?: boolean;
  onSelect: (sessionId: string) => void | Promise<void>;
  onDelete: (sessionId: string) => void | Promise<void>;
};

function formatSessionTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

export const SidebarHistory = ({
  sessions,
  activeSessionId,
  isLoading,
  isDeleting,
  isSwitching,
  onSelect,
  onDelete
}: SidebarHistoryProps) => {
  const { t } = useTranslation();

  const content = useMemo(() => {
    if (isLoading) {
      return (
        <div className="flex flex-1 items-center justify-center px-6 text-sm text-neutral-500">
          {t('picoclaw.history.loading')}
        </div>
      );
    }

    if (sessions.length === 0) {
      return (
        <EmptyState
          icon={<HistoryIcon size={24} />}
          title={t('picoclaw.history.emptyTitle')}
          description={t('picoclaw.history.emptyDescription')}
        />
      );
    }

    return (
      <div className="flex min-h-0 w-full flex-1 flex-col overflow-y-auto overflow-x-hidden px-3 py-3">
        <div className="w-full max-w-full space-y-2">
          {sessions.map((session) => {
            const isActive = session.id === activeSessionId;
            return (
              <div
                key={session.id}
                role="button"
                tabIndex={isSwitching ? -1 : 0}
                onClick={() => {
                  if (isSwitching) {
                    return;
                  }
                  void onSelect(session.id);
                }}
                onKeyDown={(event) => {
                  if (isSwitching) {
                    return;
                  }
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    void onSelect(session.id);
                  }
                }}
                className={[
                  'group flex w-full items-start gap-3 rounded-2xl border px-3 py-3 text-left transition-colors',
                  isSwitching ? 'pointer-events-none opacity-60' : '',
                  isActive
                    ? 'border-blue-500/30 bg-blue-500/10'
                    : 'border-white/[0.06] bg-white/[0.03] hover:border-white/[0.1] hover:bg-white/[0.05]'
                ].join(' ')}
              >
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/[0.05] text-neutral-400">
                  <MessageSquareTextIcon size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium text-neutral-200">
                        {session.title}
                      </div>
                      <div className="mt-1 line-clamp-2 text-xs leading-5 text-neutral-500">
                        {session.preview}
                      </div>
                    </div>
                    <Button
                      type="text"
                      size="small"
                      danger
                      disabled={isDeleting || isSwitching}
                      icon={<Trash2Icon size={16} />}
                      className={[
                        '!mt-0.5 hidden! items-center! justify-center! !text-neutral-500 hover:!bg-red-500/10 hover:!text-red-300',
                        isActive ? '' : 'group-hover:inline-flex!'
                      ].join(' ')}
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        confirm({
                          danger: true,
                          title: t('picoclaw.history.deleteConfirmTitle'),
                          content: t('picoclaw.history.deleteConfirmContent', {
                            title: session.title || ''
                          }),
                          okText: t('picoclaw.history.deleteConfirmOk'),
                          onOk: () => onDelete(session.id)
                        });
                      }}
                    />
                  </div>
                  <div className="mt-2 flex items-center gap-3 text-[11px] text-neutral-600">
                    <span>{formatSessionTime(session.updated)}</span>
                    <span>
                      {t('picoclaw.history.messageCount', { count: session.message_count })}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }, [activeSessionId, isDeleting, isLoading, isSwitching, onDelete, onSelect, sessions, t]);

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      {content}
      {/* the cards are dimmed and locked while a conversation is being opened: say so */}
      {isSwitching && (
        <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center pt-6">
          <LoaderCircleIcon className="animate-spin text-neutral-300" size={24} />
        </div>
      )}
    </div>
  );
};
