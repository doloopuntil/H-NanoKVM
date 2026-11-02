import { createContext, useContext, useEffect, useId, useState } from 'react';
import { useLatest } from './useLatest.ts';

import { toastLoadFailed } from '@/lib/feedback.ts';

export type LoadStatus = 'loading' | 'ready' | 'failed';

type Rsp = { code: number; msg?: string };

type LoadGroup = {
  generation: number;
  report: (id: string, status: LoadStatus | null) => void;
};

export const LoadGroupContext = createContext<LoadGroup | null>(null);

// Fetch device state on mount, on group retry and on reload(). Keep the controls
// bound to this data disabled until the status is 'ready'.
export function useSettingsLoadState<T extends Rsp>(
  fetcher: () => Promise<T>,
  apply: (rsp: T) => void
): { status: LoadStatus; reload: () => void } {
  const group = useContext(LoadGroupContext);
  const id = useId();
  const [status, setStatus] = useState<LoadStatus>('loading');
  const [reloads, setReloads] = useState(0);

  const latest = useLatest({ fetcher, apply });

  const generation = group?.generation ?? 0;
  const report = group?.report;

  useEffect(() => {
    let cancelled = false;

    const finish = (next: LoadStatus) => {
      if (cancelled) return;
      setStatus(next);
      report?.(id, next);
    };

    const fail = () => {
      if (cancelled) return;
      toastLoadFailed();
      finish('failed');
    };

    finish('loading');

    latest.current
      .fetcher()
      .then((rsp) => {
        if (rsp.code !== 0) {
          console.log(rsp.msg);
          fail();
          return;
        }

        latest.current.apply(rsp);
        finish('ready');
      })
      .catch((err) => {
        console.log(err);
        fail();
      });

    return () => {
      cancelled = true;
      report?.(id, null);
    };
  }, [generation, id, reloads, report, latest]);

  return { status, reload: () => setReloads((count) => count + 1) };
}

export function useSettingsLoad<T extends Rsp>(
  fetcher: () => Promise<T>,
  apply: (rsp: T) => void
): boolean {
  return useSettingsLoadState(fetcher, apply).status === 'ready';
}
