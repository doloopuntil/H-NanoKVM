import { useEffect, useState } from 'react';
import { Alert, Button, Input, Progress, Segmented, Tooltip } from 'antd';
import clsx from 'clsx';
import { CircleXIcon, DownloadIcon, LinkIcon, UploadIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { toast } from '@/lib/feedback.ts';
import { formatBytes } from '@/lib/image-transfer.ts';
import { useImageTransfer } from '@/hooks/useImageTransfer.ts';
import { LabelTip } from '@/components/label-tip.tsx';

type AddImageProps = {
  isOpen: boolean;
  isWritable: boolean;
  isRemoteEnabled: boolean;
  isDiskShared: boolean;
  isDisablingDisk: boolean;
  onDisableDisk: () => void;
};

export const AddImage = ({
  isOpen,
  isWritable,
  isRemoteEnabled,
  isDiskShared,
  isDisablingDisk,
  onDisableDisk
}: AddImageProps) => {
  const { t } = useTranslation();

  const [source, setSource] = useState<'url' | 'file'>('url');
  const [isDragging, setIsDragging] = useState(false);

  const transfer = useImageTransfer({
    remoteEnabled: isRemoteEnabled,
    onFailed: (message) => toast.error(t('download.failed'), { description: message })
  });
  const { status, resume, reset } = transfer;

  useEffect(() => {
    if (isOpen) {
      resume();
    } else {
      reset();
      setIsDragging(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const isBusy = status === 'in_progress';
  const isDisabled = !isWritable;
  // without the remote download the URL form is of no use
  const activeSource = isRemoteEnabled ? source : 'file';

  const sources = [
    {
      value: 'url',
      disabled: !isRemoteEnabled,
      label: (
        <div className="flex items-center space-x-1">
          <LinkIcon size={16} />
          <span>{t('image.fromUrl')}</span>
        </div>
      )
    },
    {
      value: 'file',
      label: (
        <div className="flex items-center space-x-1">
          <UploadIcon size={16} />
          <span>{t('image.fromFile')}</span>
        </div>
      )
    }
  ];

  const canSubmit =
    !isDisabled &&
    status !== 'complete' &&
    (activeSource === 'url' ? !!transfer.input.trim() : !!transfer.selectedFile);

  const submitLabel = activeSource === 'url' ? t('image.download') : t('image.upload');

  const submitButton = (
    <Tooltip title={submitLabel} mouseEnterDelay={0.6}>
      <Button
        type="primary"
        className="shrink-0"
        aria-label={submitLabel}
        icon={activeSource === 'url' ? <DownloadIcon size={16} /> : <UploadIcon size={16} />}
        disabled={!canSubmit}
        onClick={() =>
          activeSource === 'url'
            ? transfer.download(transfer.input)
            : transfer.upload(transfer.selectedFile)
        }
      />
    </Tooltip>
  );

  return (
    <div className="flex flex-col space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
        <span className="font-semibold">
          {!isRemoteEnabled && !isDisabled ? (
            <LabelTip text={t('image.addImage')} tip={t('download.remoteDisabled')} warning />
          ) : (
            t('image.addImage')
          )}
        </span>
        <Segmented
          className="ml-auto"
          size="small"
          value={activeSource}
          options={sources}
          disabled={isDisabled || isBusy}
          onChange={(value) => setSource(value as 'url' | 'file')}
        />
      </div>

      {isDisabled && isDiskShared && (
        <Alert
          type="warning"
          showIcon
          title={t('download.diskShared')}
          action={
            <Button type="primary" size="small" loading={isDisablingDisk} onClick={onDisableDisk}>
              {t('image.turnOff')}
            </Button>
          }
        />
      )}
      {isDisabled && !isDiskShared && (
        <Alert type="warning" showIcon title={t('download.disabled')} />
      )}

      {isBusy ? (
        <div className="flex flex-col space-y-1">
          <span className="min-w-0 truncate text-sm">{transfer.log}</span>
          <div className="flex items-center space-x-2">
            <div className="min-w-0 flex-1">
              <Progress
                percent={transfer.progress ?? 100}
                status="active"
                size="small"
                showInfo={transfer.progress !== null}
                format={(percent) => `${Math.floor(percent ?? 0)}%`}
              />
            </div>
            <Tooltip title={t('download.cancel')} mouseEnterDelay={0.6}>
              <Button
                danger
                className="shrink-0"
                aria-label={t('download.cancel')}
                icon={<CircleXIcon size={16} />}
                loading={transfer.isCanceling}
                onClick={transfer.cancel}
              />
            </Tooltip>
          </div>
          {transfer.bytesDone > 0 && (
            <div className="text-xs text-neutral-400">{formatBytes(transfer.bytesDone)}</div>
          )}
        </div>
      ) : (
        <div
          className={clsx(
            'flex flex-col space-y-3',
            isDisabled && 'pointer-events-none opacity-50'
          )}
        >
          {status && transfer.log && (
            <div
              className={clsx(
                'break-words text-sm',
                status === 'failed' ? 'text-red-400' : 'text-green-400'
              )}
            >
              {transfer.log}
            </div>
          )}

          {activeSource === 'url' ? (
            <div>
              <div className="pb-1 text-xs text-neutral-400">{t('download.input')}</div>
              <div className="flex items-center space-x-2">
                <Input
                  value={transfer.input}
                  disabled={isDisabled}
                  onChange={(e) => transfer.changeInput(e.target.value)}
                />
                {submitButton}
              </div>
            </div>
          ) : (
            <div>
              <div className="pb-1 text-xs text-neutral-400">{t('download.inputfile')}</div>
              <div className="flex items-center space-x-2">
                <Button
                  block
                  disabled={isDisabled}
                  className={clsx('min-w-0', isDragging && '!border-blue-500 !text-blue-400')}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    transfer.selectLocalFile(e.dataTransfer.files?.[0] ?? null);
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                  }}
                  onClick={() => transfer.fileInputRef.current?.click()}
                >
                  <span className="block max-w-full truncate">
                    {transfer.selectedFile ? transfer.selectedFile.name : t('download.uploadbox')}
                  </span>
                </Button>
                {submitButton}
              </div>
              <input
                ref={transfer.fileInputRef}
                type="file"
                accept=".iso,.img"
                disabled={isDisabled}
                className="hidden"
                onChange={(e) => transfer.selectLocalFile(e.target.files?.[0] ?? null)}
              />
            </div>
          )}

          <div>
            <div className="pb-1 text-xs text-neutral-400">{t('download.sha256')}</div>
            <Input
              value={transfer.sha256sum}
              disabled={isDisabled}
              maxLength={64}
              placeholder={t('download.sha256Placeholder')}
              onChange={(e) => transfer.changeSha256(e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
