import { useEffect, useRef, useState } from 'react';

import { client } from '@/lib/websocket.ts';

import {
  CAPTURE_STATUS_EVENT,
  CaptureStatus,
  parseCaptureStatusMessage,
  shouldAcceptCaptureStatus
} from './model';

export function useCaptureStatus(activeVideoMode: string) {
  // the mode the status belongs to, so a mode change drops it without an effect
  const [entry, setEntry] = useState<{ mode: string; status: CaptureStatus } | null>(null);
  const latestStatusRef = useRef<CaptureStatus | null>(null);

  useEffect(() => {
    latestStatusRef.current = null;

    if (!activeVideoMode) {
      return;
    }

    return client.on(CAPTURE_STATUS_EVENT, (message) => {
      const status = parseCaptureStatusMessage(message);
      if (!status || status.mode !== activeVideoMode) {
        return;
      }
      if (!shouldAcceptCaptureStatus(latestStatusRef.current, status)) {
        return;
      }

      latestStatusRef.current = status;
      setEntry(status.ok ? null : { mode: activeVideoMode, status });
    });
  }, [activeVideoMode]);

  return entry?.mode === activeVideoMode ? entry.status : null;
}
