import { Button, Progress, Tooltip } from 'antd';
import { LoaderCircleIcon, XIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { formatBytes } from '@/lib/image-transfer.ts';
import type { ImageTransfer } from '@/hooks/useImageTransfer.ts';

// The transfer that is running, above the list: it stays after the add dialog has been closed.
export const TransferRow = ({ transfer }: { transfer: ImageTransfer }) => {
  const { t } = useTranslation();
  const { log, progress, bytesDone, isCanceling, cancel } = transfer;

  return (
    <div className="mb-5 rounded-sm border border-blue-500/30 bg-blue-500/10 px-2.5 py-2">
      <div className="flex items-center gap-2">
        <LoaderCircleIcon className="shrink-0 animate-spin text-blue-400" size={16} />
        <span className="min-w-0 flex-1 truncate text-sm">{log}</span>
        <Tooltip title={t('download.cancel')} mouseEnterDelay={0.6}>
          <Button
            danger
            size="small"
            aria-label={t('download.cancel')}
            icon={<XIcon size={16} />}
            loading={isCanceling}
            onClick={cancel}
          />
        </Tooltip>
      </div>
      <Progress percent={progress ?? 100} status="active" size="small" showInfo={false} />
      <div className="flex items-center justify-between text-xs text-neutral-400">
        <span>{bytesDone > 0 ? formatBytes(bytesDone) : ''}</span>
        {progress !== null && <span>{Math.floor(progress)}%</span>}
      </div>
    </div>
  );
};
