import { useEffect, useState } from 'react';
import { Alert, Button, Divider, Input, Modal, Progress } from 'antd';
import clsx from 'clsx';
import { useSetAtom } from 'jotai';
import {
  ChevronDownIcon,
  ChevronRightIcon,
  CloudUploadIcon,
  DownloadIcon,
  LoaderCircleIcon,
  UploadIcon,
  XIcon
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { formatBytes } from '@/lib/image-transfer.ts';
import { isKeyboardEnableAtom } from '@/jotai/keyboard.ts';
import type { ImageStorage } from '@/hooks/useImageStorage.ts';
import type { ImageTransfer } from '@/hooks/useImageTransfer.ts';
import { useIsTouchLayout } from '@/hooks/useResponsiveLayout.ts';
import { LabelTip } from '@/components/label-tip.tsx';

// Chrome draws a caret in a disabled text field that was enabled while the dialog opened
const NO_CARET = 'disabled:caret-transparent';

type AddImageDialogProps = {
  transfer: ImageTransfer;
  storage: ImageStorage;
  // closing keeps a running transfer going; its row shows in the image list
  onClose: () => void;
};

// Adds an image from a file or from a link. The transfer itself lives in the image menu, so it
// goes on when this dialog is closed.
export const AddImageDialog = ({ transfer, storage, onClose }: AddImageDialogProps) => {
  const { t } = useTranslation();
  const setIsKeyboardEnable = useSetAtom(isKeyboardEnableAtom);
  const isTouchLayout = useIsTouchLayout();

  const [isDragging, setIsDragging] = useState(false);
  const [showSha, setShowSha] = useState(false);

  const {
    status,
    log,
    progress,
    bytesDone,
    isCanceling,
    input,
    sha256sum,
    selectedFile,
    fileInputRef,
    changeInput,
    changeSha256,
    selectLocalFile,
    clearSelectedFile,
    download,
    upload,
    cancel,
    resume
  } = transfer;

  // the fields take the keys the desktop would send to the controlled computer
  useEffect(() => {
    setIsKeyboardEnable(false);
    return () => setIsKeyboardEnable(true);
  }, [setIsKeyboardEnable]);

  // pick up a transfer that is already running
  useEffect(() => {
    resume();
    // runs once, when the dialog opens
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isBusy = status === 'in_progress';
  const isDisabled = !storage.isWritable;
  // the link and its checksum are of no use without the remote download
  const isLinkDisabled = isDisabled || !storage.isRemoteEnabled;
  const isUpload = !!selectedFile;
  const canSubmit =
    !isDisabled &&
    status !== 'complete' &&
    (isUpload || (storage.isRemoteEnabled && !!input.trim()));

  function submit() {
    if (!canSubmit) return;
    if (selectedFile) upload(selectedFile);
    else download(input);
  }

  // a file or a link, not both
  function pickFile(file: File | null) {
    selectLocalFile(file);
    if (file) changeInput('');
  }

  function typeLink(value: string) {
    if (value && selectedFile) clearSelectedFile();
    changeInput(value);
  }

  function renderBusy() {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <LoaderCircleIcon className="shrink-0 animate-spin text-blue-400" size={16} />
          <span className="min-w-0 flex-1 truncate">{log}</span>
        </div>
        <Progress percent={progress ?? 100} status="active" size="small" showInfo={false} />
        <div className="flex items-center justify-between text-xs text-neutral-400">
          <span>{bytesDone > 0 ? formatBytes(bytesDone) : ''}</span>
          {progress !== null && <span>{Math.floor(progress)}%</span>}
        </div>
        <div className="text-xs text-neutral-500">{t('image.keepRunning')}</div>
        <div className="flex justify-between pt-1">
          <Button danger icon={<XIcon size={16} />} loading={isCanceling} onClick={cancel}>
            {t('download.cancel')}
          </Button>
          <Button onClick={onClose}>{t('common.close')}</Button>
        </div>
      </div>
    );
  }

  function renderForm() {
    return (
      <div className="flex flex-col">
        {isDisabled && storage.isDiskShared && (
          <Alert
            className="mb-3"
            type="warning"
            showIcon
            title={t('download.diskShared')}
            action={
              <Button
                type="primary"
                loading={storage.isDisablingDisk}
                onClick={storage.disableDisk}
              >
                {t('image.turnOff')}
              </Button>
            }
          />
        )}
        {isDisabled && !storage.isDiskShared && (
          <Alert className="mb-3" type="warning" showIcon title={t('download.disabled')} />
        )}
        {status === 'failed' && log && <Alert className="mb-3" type="error" showIcon title={log} />}
        {(status === 'complete' || status === 'canceled') && log && (
          <Alert
            className="mb-3"
            type={status === 'complete' ? 'success' : 'info'}
            showIcon
            title={log}
          />
        )}

        <div className="flex flex-col">
          <div
            role="button"
            tabIndex={isDisabled ? -1 : 0}
            aria-disabled={isDisabled}
            className={clsx(
              'flex flex-col items-center gap-1 rounded-md border-2 border-dashed px-3 py-5 text-center text-sm text-neutral-300 transition-colors',
              isDisabled
                ? 'cursor-not-allowed border-neutral-600 opacity-50'
                : [
                    'cursor-pointer',
                    isDragging
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-neutral-600 hover:border-neutral-500'
                  ]
            )}
            onClick={() => {
              if (!isDisabled) fileInputRef.current?.click();
            }}
            onKeyDown={(e) => {
              if (!isDisabled && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                fileInputRef.current?.click();
              }
            }}
            // a dropped file must not open in the browser, also when it is refused
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              if (!isDisabled) pickFile(e.dataTransfer.files?.[0] ?? null);
            }}
            onDragOver={(e) => {
              e.preventDefault();
              if (!isDisabled) setIsDragging(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setIsDragging(false);
            }}
          >
            <CloudUploadIcon size={26} />
            <span className="max-w-full truncate">
              {selectedFile ? selectedFile.name : t('download.uploadbox')}
            </span>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".iso,.img"
            className="hidden"
            disabled={isDisabled}
            onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
          />

          <Divider plain style={{ margin: '12px 0 8px' }}>
            <span className="text-xs text-neutral-500">{t('image.orDownload')}</span>
          </Divider>

          <div className="pb-1.5 text-neutral-400">
            {!storage.isRemoteEnabled && !isDisabled ? (
              <LabelTip text={t('download.input')} tip={t('download.remoteDisabled')} warning />
            ) : (
              t('download.input')
            )}
          </div>
          <Input
            className={NO_CARET}
            value={input}
            disabled={isLinkDisabled}
            onChange={(e) => typeLink(e.target.value)}
            onPressEnter={submit}
          />

          <button
            type="button"
            disabled={isLinkDisabled}
            className="mt-3 flex cursor-pointer items-center gap-1 self-start text-neutral-400 enabled:hover:text-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => setShowSha(!showSha)}
          >
            {showSha || sha256sum ? <ChevronDownIcon size={14} /> : <ChevronRightIcon size={14} />}
            {t('download.sha256')}
          </button>
          {(showSha || sha256sum) && (
            <Input
              className={clsx('mt-1.5', NO_CARET)}
              disabled={isLinkDisabled}
              value={sha256sum}
              maxLength={64}
              placeholder={t('download.sha256Placeholder')}
              onChange={(e) => changeSha256(e.target.value)}
              onPressEnter={submit}
            />
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button onClick={onClose}>{t('common.cancel')}</Button>
          <Button
            type="primary"
            icon={isUpload ? <UploadIcon size={16} /> : <DownloadIcon size={16} />}
            disabled={!canSubmit}
            onClick={submit}
          >
            {isUpload ? t('image.upload') : t('image.download')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Modal
      open
      destroyOnHidden
      // not centred on a phone, so that the phone's keyboard does not cover the text boxes
      centered={!isTouchLayout}
      title={t('image.addImage')}
      footer={null}
      onCancel={onClose}
    >
      <div className="pt-3">{isBusy ? renderBusy() : renderForm()}</div>
    </Modal>
  );
};
