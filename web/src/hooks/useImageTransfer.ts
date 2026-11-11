import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { cancelDownloadImage, downloadImage, statusImage } from '@/api/download.ts';
import { getMountedImage } from '@/api/storage.ts';
import { checkUpload } from '@/api/upload.ts';
import { attempt } from '@/lib/feedback.ts';
import { notifyImageListChanged } from '@/lib/image-events.ts';
import { fileLabel, isAllowedImageName, isValidSha256 } from '@/lib/image-transfer.ts';
import { startUpload, UploadError, type Upload } from '@/lib/upload.ts';

type TransferKind = 'local' | 'remote';
export type TransferStatus = '' | 'idle' | 'in_progress' | 'complete' | 'failed' | 'canceled';

const STATUS_POLL_MS = 2500;
const TRANSFER_STALL_TIMEOUT_MS = 90_000;

type Options = {
  remoteEnabled: boolean;
  // called once for every failed transfer, with the text shown in the log
  onFailed: (message: string) => void;
};

// The state of one image transfer: a browser upload or a remote download. The
// server reports a single transfer at a time through the download status
// endpoint, so both kinds share one status, one progress bar and one cancel.
export type ImageTransfer = ReturnType<typeof useImageTransfer>;

export function useImageTransfer({ remoteEnabled, onFailed }: Options) {
  const { t } = useTranslation();

  const [input, setInput] = useState('');
  const [sha256sum, setSha256sum] = useState('');
  const [status, setStatus] = useState<TransferStatus>('');
  const [log, setLog] = useState('');
  // null: the total size is unknown
  const [progress, setProgress] = useState<number | null>(0);
  const [bytesDone, setBytesDone] = useState(0);
  const [isCanceling, setIsCanceling] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const statusRef = useRef<TransferStatus>('');
  const activeTransferRef = useRef<TransferKind | null>(null);
  const uploadRef = useRef<Upload | null>(null);
  // Counts the changes of the status. A status answer that was asked for before a change is about
  // a transfer that has since ended or not yet begun, and is dropped: taken in, it would bring a
  // canceled or finished upload back as a running remote download.
  const statusEpochRef = useRef(0);
  const remoteCancelRef = useRef(false);
  const lastProgressMarkerRef = useRef('');
  const onFailedRef = useRef(onFailed);
  onFailedRef.current = onFailed;

  const intervalId = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const stallTimeoutId = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    return () => {
      stopStatusPolling();
      stopStallWatchdog();
    };
  }, []);

  function setDownloadStatus(nextStatus: TransferStatus) {
    if (nextStatus !== statusRef.current) statusEpochRef.current += 1;
    statusRef.current = nextStatus;
    setStatus(nextStatus);
    if (nextStatus !== 'in_progress') setIsCanceling(false);
  }

  // never moves backwards within a transfer
  function reportProgress(next: number | null) {
    setProgress((previous) => (next === null ? null : Math.max(previous ?? 0, next)));
  }

  function startProgress(known: boolean) {
    setProgress(known ? 0 : null);
    setBytesDone(0);
    setIsCanceling(false);
  }

  function stopStatusPolling() {
    if (!intervalId.current) return;

    clearInterval(intervalId.current);
    intervalId.current = undefined;
  }

  function startStatusPolling() {
    if (intervalId.current) return;

    intervalId.current = setInterval(getDownloadStatus, STATUS_POLL_MS);
  }

  function stopStallWatchdog() {
    if (!stallTimeoutId.current) return;

    clearTimeout(stallTimeoutId.current);
    stallTimeoutId.current = undefined;
  }

  function resetStallWatchdog() {
    stopStallWatchdog();
    if (statusRef.current !== 'in_progress') return;

    stallTimeoutId.current = setTimeout(() => {
      if (statusRef.current !== 'in_progress') return;

      failTransfer(t('download.stalled'));
    }, TRANSFER_STALL_TIMEOUT_MS);
  }

  function noteProgress(marker: string) {
    if (!marker || marker === lastProgressMarkerRef.current) return;

    lastProgressMarkerRef.current = marker;
    resetStallWatchdog();
  }

  function clearFileInput() {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  function setActiveTransferKind(kind: TransferKind | null) {
    activeTransferRef.current = kind;
  }

  // a finished transfer goes back to idle as soon as its inputs change
  function clearComplete() {
    if (statusRef.current === 'complete') {
      setDownloadStatus('idle');
      setLog('');
    }
  }

  function changeInput(value: string) {
    setInput(value);
    clearComplete();
  }

  function changeSha256(value: string) {
    setSha256sum(value);
    clearComplete();
  }

  // empty means no check; null means the entered value is not a SHA-256
  function getValidatedSHA256() {
    if (!isValidSha256(sha256sum)) {
      setDownloadStatus('failed');
      setLog(t('download.invalidSHA256'));
      return null;
    }

    return sha256sum.trim();
  }

  function getDownloadStatus() {
    const epoch = statusEpochRef.current;
    statusImage().then((rsp) => {
      if (epoch !== statusEpochRef.current) return;
      if (rsp.code !== 0 || !rsp.data?.status) {
        return;
      }

      const nextStatus = rsp.data.status;
      if (nextStatus === 'in_progress') {
        setDownloadStatus(nextStatus);
        // a transfer that this browser did not start: a link is a remote download, a file name an
        // upload
        if (activeTransferRef.current === null) {
          setActiveTransferKind(/^https?:\/\//i.test(rsp.data.file) ? 'remote' : 'local');
        }
        const transfer = activeTransferRef.current ?? 'remote';
        // an upload of this browser reports its own progress, and watches for its own stall; the
        // server's count would only fight it
        if (transfer !== 'local' || uploadRef.current === null) {
          const percent = Number.parseFloat(rsp.data.percentage);
          reportProgress(Number.isFinite(percent) ? percent : null);
          setBytesDone(Number(rsp.data.written) || 0);
          setLog(formatTransferLog(transfer, rsp.data.file));
        }
        if (transfer === 'remote') {
          setInput(rsp.data.file);
          noteProgress(`${rsp.data.file};${rsp.data.percentage};${rsp.data.written ?? ''}`);
        }
        return;
      }

      if (nextStatus === 'failed') {
        failTransfer(t('download.failed'));
        return;
      }

      if (nextStatus === 'checksum_failed') {
        failTransfer(t('download.checksumFailed'));
        return;
      }

      if (nextStatus === 'idle') {
        const previousStatus = statusRef.current;
        const previousTransfer = activeTransferRef.current;
        setActiveTransferKind(null);
        stopStatusPolling();
        stopStallWatchdog();

        if (previousStatus === 'complete') {
          return;
        }

        if (previousStatus === 'in_progress' && previousTransfer === 'remote') {
          if (remoteCancelRef.current) {
            remoteCancelRef.current = false;
            finishCanceled('remote');
            return;
          }

          setInput('');
          setSha256sum('');
          setDownloadStatus('complete');
          setLog(t('download.complete'));
          notifyImageListChanged();
          return;
        }

        if (previousStatus === 'in_progress' && previousTransfer === 'local') {
          setDownloadStatus('complete');
          setLog(t('download.uploadComplete'));
          setSelectedFile(null);
          setSha256sum('');
          clearFileInput();
          notifyImageListChanged();
          return;
        }

        setDownloadStatus('idle');
        setLog(''); // Clear the log
      }
    });
  }

  function download(url?: string) {
    const targetUrl = url?.trim();
    if (!targetUrl) return;
    if (!remoteEnabled) {
      setDownloadStatus('failed');
      setLog(t('download.remoteDisabled'));
      return;
    }

    const checksum = getValidatedSHA256();
    if (checksum === null) return;

    setActiveTransferKind('remote');
    lastProgressMarkerRef.current = '';
    remoteCancelRef.current = false;
    startProgress(false);
    setDownloadStatus('in_progress');
    setLog(formatTransferLog('remote', targetUrl));
    noteProgress(targetUrl);

    downloadImage(targetUrl, checksum)
      .then((rsp) => {
        if (rsp.code !== 0) {
          failTransfer(rsp.msg || t('download.remoteFailed'));
          return;
        }
        getDownloadStatus();
        startStatusPolling();
      })
      .catch(() => {
        failTransfer(t('download.remoteFailed'));
      });
  }

  function selectLocalFile(file: File | null) {
    if (!file || !isAllowedImageName(file.name)) {
      setDownloadStatus('failed');
      setLog(t('download.NoISO'));
      setSelectedFile(null);
      clearFileInput();
      return;
    }
    setDownloadStatus('idle');
    setLog('');
    setSelectedFile(file);
    setActiveTransferKind(null);
    stopStatusPolling();
    stopStallWatchdog();
  }

  // drops the chosen file without the "no image" error that selectLocalFile(null) reports
  function clearSelectedFile() {
    setSelectedFile(null);
    clearFileInput();
  }

  async function mountedImageName() {
    try {
      const rsp = await getMountedImage();
      return rsp.code === 0 ? String(rsp.data?.file ?? '').replace(/^.*[\\/]/, '') : '';
    } catch {
      return '';
    }
  }

  function uploadFailureText(message?: string) {
    if (message?.toLowerCase() === 'sha256 mismatch') return t('download.checksumFailed');
    return message || t('download.uploadFailed');
  }

  async function upload(file: File | null) {
    if (!file) return;

    if (!isAllowedImageName(file.name)) {
      setDownloadStatus('failed');
      setLog(t('download.NoISO'));
      return;
    }

    const checksum = getValidatedSHA256();
    if (checksum === null) return;

    // The server refuses to replace a mounted image, but only after the browser has started
    // sending the file, and the browser then reports a bare network error.
    if ((await mountedImageName()) === file.name) {
      setDownloadStatus('failed');
      setLog(t('download.mountedImage'));
      return;
    }

    // The same for a full card or a transfer that is running: ask before sending a byte.
    const refusal = await checkUpload('/api/download/image/upload-check', {
      size: file.size,
      name: file.name
    });
    if (refusal) {
      setDownloadStatus('failed');
      setLog(refusal);
      return;
    }

    setActiveTransferKind('local');
    startProgress(true);
    setDownloadStatus('in_progress');
    setLog(formatTransferLog('local', file.name));

    const formData = new FormData();
    formData.append('file', file);
    startStatusPolling();

    const sending = startUpload({
      url: '/api/download/file',
      data: formData,
      headers: checksum ? { 'X-SHA256-Sum': checksum } : undefined,
      onProgress: (loaded, total) => {
        reportProgress(total ? (loaded / total) * 100 : null);
        setBytesDone(loaded);
      }
    });
    uploadRef.current = sending;

    try {
      const rsp = await sending.promise;
      if (rsp.code !== 0) {
        failTransfer(uploadFailureText(rsp.msg));
        return;
      }

      uploadRef.current = null;
      stopStatusPolling();
      setActiveTransferKind(null);
      setDownloadStatus('complete');
      setLog(t('download.uploadComplete'));
      setSelectedFile(null);
      setSha256sum('');
      clearFileInput();
      notifyImageListChanged();
    } catch (error) {
      if (error instanceof UploadError) {
        if (error.kind === 'aborted') {
          finishCanceled('local');
        } else if (error.kind === 'stalled') {
          failTransfer(t('download.stalled'));
        } else {
          failTransfer(
            error.kind === 'http'
              ? uploadFailureText(error.serverMessage)
              : t('download.uploadFailed')
          );
        }
        return;
      }

      failTransfer(error instanceof Error && error.message ? error.message : t('download.failed'));
    }
  }

  function cancel() {
    if (statusRef.current !== 'in_progress' || isCanceling) return;

    if (activeTransferRef.current === 'local') {
      uploadRef.current?.abort();
      return;
    }

    // the server stops curl and drops the partial file; the next status poll sees it idle
    setIsCanceling(true);
    remoteCancelRef.current = true;
    attempt(() => cancelDownloadImage()).then((rsp) => {
      if (rsp) {
        getDownloadStatus();
        return;
      }

      remoteCancelRef.current = false;
      setIsCanceling(false);
    });
  }

  function failTransfer(message: string) {
    stopStatusPolling();
    stopStallWatchdog();
    setActiveTransferKind(null);
    uploadRef.current = null;
    setDownloadStatus('failed');
    setLog(message);
    onFailedRef.current(message);
  }

  function finishCanceled(transfer: TransferKind) {
    stopStatusPolling();
    stopStallWatchdog();
    setActiveTransferKind(null);
    setDownloadStatus('canceled');
    setLog(transfer === 'local' ? t('download.canceled') : t('download.downloadCanceled'));
  }

  function formatTransferLog(transfer: TransferKind, file: string) {
    const label = transfer === 'local' ? t('download.uploading') : t('download.downloading');
    return `${label}: ${fileLabel(file)}`;
  }

  // the panel opened: pick up a transfer that is already running
  function resume() {
    stopStatusPolling();
    getDownloadStatus();
    startStatusPolling();
  }

  // the panel closed: forget a finished transfer, keep a running one
  function reset() {
    if (statusRef.current === 'in_progress') return;

    setInput('');
    setSha256sum('');
    setDownloadStatus('');
    setLog('');
    setSelectedFile(null);
    setActiveTransferKind(null);
    stopStatusPolling();
    stopStallWatchdog();
    clearFileInput();
  }

  return {
    input,
    sha256sum,
    status,
    log,
    progress,
    bytesDone,
    isCanceling,
    selectedFile,
    fileInputRef,
    changeInput,
    changeSha256,
    selectLocalFile,
    clearSelectedFile,
    download,
    upload,
    cancel,
    resume,
    reset
  };
}
