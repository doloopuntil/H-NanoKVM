import { useEffect, useRef, useState } from 'react';
import { Alert, Modal } from 'antd';
import { LoaderCircleIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const POLL_MS = 3000;
// A normal raw install takes about three minutes plus the restart.
const SLOW_AFTER_SECONDS = 8 * 60;

// null: unreachable. Otherwise the failure message of the install, if it has failed.
async function probe(): Promise<{ failed: string } | null> {
  try {
    const rsp = await fetch('/api/system-update/status', {
      cache: 'no-store',
      signal: AbortSignal.timeout(2500)
    });
    // A restarted server may answer 401 until the session is renewed; it is still up.
    if (rsp.status === 401) return { failed: '' };
    if (!rsp.ok) return null;
    const body = await rsp.json();
    const progress = body?.data?.progress;
    return { failed: progress?.phase === 'failed' ? progress.message || 'failed' : '' };
  } catch {
    return null;
  }
}

function formatElapsed(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(seconds % 60).padStart(2, '0')}`;
}

type InstallWaitProps = {
  open: boolean;
  onFailed: (message: string) => void;
};

// Shown while a raw system update writes the SD card. The server goes away and comes back, so
// the page reloads itself once it answers again after having been unreachable.
export const InstallWait = ({ open, onFailed }: InstallWaitProps) => {
  const { t } = useTranslation();
  const [elapsed, setElapsed] = useState(0);
  const [wentDown, setWentDown] = useState(false);
  const failedRef = useRef(onFailed);
  failedRef.current = onFailed;

  useEffect(() => {
    if (!open) return;

    const started = Date.now();
    let down = false;
    let stopped = false;

    const tick = setInterval(() => setElapsed(Math.floor((Date.now() - started) / 1000)), 1000);
    const poll = setInterval(async () => {
      const result = await probe();
      if (stopped) return;
      if (!result) {
        down = true;
        setWentDown(true);
      } else if (down) {
        window.location.reload();
      } else if (result.failed) {
        failedRef.current(result.failed);
      }
    }, POLL_MS);

    return () => {
      stopped = true;
      clearInterval(tick);
      clearInterval(poll);
    };
  }, [open]);

  return (
    <Modal
      open={open}
      closable={false}
      mask={{ closable: false }}
      keyboard={false}
      footer={null}
      centered
      title={t('settings.update.system.rawWaitTitle')}
    >
      <div className="box-border space-y-4 py-2">
        <div className="flex items-center space-x-3">
          <LoaderCircleIcon className="animate-spin text-blue-400" size={24} />
          <span className="text-sm text-neutral-300">
            {wentDown
              ? t('settings.update.system.rawWaitRestarting')
              : t('settings.update.system.rawWaitWriting')}
          </span>
          <span className="ml-auto font-mono text-sm tabular-nums text-neutral-400">
            {formatElapsed(elapsed)}
          </span>
        </div>

        <div className="text-sm text-neutral-400">{t('settings.update.system.rawWaitDesc')}</div>

        {elapsed >= SLOW_AFTER_SECONDS && (
          <Alert type="warning" showIcon title={t('settings.update.system.rawWaitSlow')} />
        )}
      </div>
    </Modal>
  );
};
