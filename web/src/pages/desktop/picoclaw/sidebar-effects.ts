import { useEffect } from 'react';
import type { Dispatch, RefObject, SetStateAction } from 'react';
import type { TFunction } from 'i18next';

import {
  closeGateway,
  connectGateway,
  getPicoclawSession,
  listPicoclawSessions,
  picoclawGateway,
  type PicoclawSessionListItem
} from '@/api/picoclaw.ts';
import { toast } from '@/lib/feedback.ts';
import {
  clearPicoclawRuntimeInstallSnapshot,
  setPicoclawRuntimeInstallSnapshot,
  type PicoclawRuntimeInstallSnapshot
} from '@/lib/picoclaw-storage.ts';
import type {
  PicoclawChatMessage,
  PicoclawOverlayState,
  PicoclawRunState,
  PicoclawRuntimeStatus,
  PicoclawTakeoverState,
  PicoclawTransportState
} from '@/jotai/picoclaw.ts';

import {
  createAssistantMessage,
  createErrorMessage,
  createObservationMessage,
  createStatusMessage,
  createToolActionMessage,
  createToolCallMessage,
  HIDDEN_OVERLAY,
  retainLatestObservationScreenshot,
  sessionMessagesToChat
} from './message-utils.ts';
import { canConnectGateway, isPicoclawRuntimeInstalling } from './runtime-view.ts';
import { summarizeToolCall } from './tool-call-summary.ts';

type MessageSetter = Dispatch<SetStateAction<PicoclawChatMessage[]>>;
type TakeoverSetter = Dispatch<SetStateAction<PicoclawTakeoverState>>;

type GatewayEventOptions = {
  t: TFunction;
  setActiveSessionId: Dispatch<SetStateAction<string>>;
  setTakeover: TakeoverSetter;
  setMessages: MessageSetter;
  setTransportState: Dispatch<SetStateAction<PicoclawTransportState>>;
  setOverlay: Dispatch<SetStateAction<PicoclawOverlayState>>;
  setRunState: Dispatch<SetStateAction<PicoclawRunState>>;
};

type LifecycleOptions = {
  t: TFunction;
  refreshStateRef: RefObject<() => Promise<PicoclawRuntimeStatus | null>>;
  setActiveSessionId: Dispatch<SetStateAction<string>>;
  setIsFreshConversation: Dispatch<SetStateAction<boolean>>;
  setMessages: MessageSetter;
  setHistorySessions: Dispatch<SetStateAction<PicoclawSessionListItem[]>>;
  setIsInitializing: Dispatch<SetStateAction<boolean>>;
  setTakeover: TakeoverSetter;
  setOverlay: Dispatch<SetStateAction<PicoclawOverlayState>>;
  setTransportState: Dispatch<SetStateAction<PicoclawTransportState>>;
  setRunState: Dispatch<SetStateAction<PicoclawRunState>>;
};

type InstallSnapshotOptions = {
  t: TFunction;
  runtimeStatus: PicoclawRuntimeStatus | null;
  setInstallSnapshot: Dispatch<SetStateAction<PicoclawRuntimeInstallSnapshot | null>>;
  previousInstallStateRef: RefObject<{ installing: boolean; status: string }>;
  setMessages: MessageSetter;
};

export function usePicoclawGatewayEvents({
  t,
  setActiveSessionId,
  setTakeover,
  setMessages,
  setTransportState,
  setOverlay,
  setRunState
}: GatewayEventOptions) {
  useEffect(() => {
    const unsubs = [
      picoclawGateway.on('connected', ({ sessionId }) => {
        setActiveSessionId(sessionId);
        setTakeover({
          active: true,
          sessionId,
          reason: 'connected'
        });
        setMessages((current) => [...current, createStatusMessage(t('picoclaw.status.connected'))]);
      }),
      picoclawGateway.on('transport_state', (state) => {
        setTransportState(state);

        if (state === 'connected') {
          setActiveSessionId(picoclawGateway.getSessionId());
          setTakeover((current) => ({
            active: true,
            sessionId: current.sessionId || picoclawGateway.getSessionId(),
            reason: state
          }));
          return;
        }

        setTakeover((current) => ({
          ...current,
          active: false,
          reason: state
        }));
        setOverlay(HIDDEN_OVERLAY);
        setRunState('idle');
      }),
      picoclawGateway.on('run_state', (state) => {
        setRunState(state);
        // what the agent was doing on the screen is no longer true
        if (state === 'idle') {
          setOverlay(HIDDEN_OVERLAY);
        }
      }),
      picoclawGateway.on('assistant_message', (message) => {
        setMessages((current) => {
          const existingIndex = current.findIndex((item) => item.id === message.id);
          const nextMessage = createAssistantMessage(message);

          if (existingIndex < 0) {
            return [...current, nextMessage];
          }

          const updated = [...current];
          updated[existingIndex] = nextMessage;
          return updated;
        });
      }),
      picoclawGateway.on('tool_action', (action) => {
        setMessages((current) => [...current, createToolActionMessage(action)]);
        setOverlay({
          visible: true,
          message: `${t('picoclaw.overlay.locked')} · ${action.action}`,
          x: action.x,
          y: action.y,
          action: action.action
        });
      }),
      picoclawGateway.on('tool_calls', ({ id, calls }) => {
        const lines = calls.map((call, index) =>
          createToolCallMessage(`${id}:${call.id || index}`, summarizeToolCall(call, t))
        );
        // an update of the message sends the same calls again
        setMessages((current) => {
          const known = new Set(current.map((item) => item.id));
          const fresh = lines.filter((line) => !known.has(line.id));
          return fresh.length > 0 ? [...current, ...fresh] : current;
        });

        const last = lines[lines.length - 1]?.text?.split('\n')[0].replace(/`/g, '');
        if (last) {
          setOverlay({
            visible: true,
            message: `${t('picoclaw.overlay.locked')} · ${last}`,
            action: last
          });
        }
      }),
      picoclawGateway.on('observation', (observation) => {
        setMessages((current) =>
          retainLatestObservationScreenshot([...current, createObservationMessage(observation)])
        );
      }),
      picoclawGateway.on('error', (error) => {
        setMessages((current) => [...current, createErrorMessage(error)]);
      }),
      picoclawGateway.on('close', (closeEvent) => {
        if (closeEvent.code === 1000) {
          setMessages((current) => [
            ...current,
            createStatusMessage(t('picoclaw.status.disconnected'))
          ]);
        }
      })
    ];

    return () => {
      unsubs.forEach((unsubscribe) => unsubscribe());
    };
  }, [setActiveSessionId, setMessages, setOverlay, setRunState, setTakeover, setTransportState, t]);
}

// The messages of the newest saved session, if there is one with something in it.
async function loadNewestSession(
  rsp: { code: number; data?: PicoclawSessionListItem[] } | null
): Promise<{ id: string; messages: PicoclawChatMessage[] } | undefined> {
  const newest = rsp?.code === 0 ? rsp.data?.[0] : undefined;
  if (!newest) {
    return undefined;
  }
  try {
    const detail = await getPicoclawSession(newest.id);
    if (detail.code !== 0 || !detail.data?.messages?.length) {
      return undefined;
    }
    return { id: newest.id, messages: sessionMessagesToChat(newest.id, detail.data.messages) };
  } catch {
    return undefined;
  }
}

export function usePicoclawSidebarLifecycle({
  t,
  refreshStateRef,
  setActiveSessionId,
  setIsFreshConversation,
  setMessages,
  setHistorySessions,
  setIsInitializing,
  setTakeover,
  setOverlay,
  setTransportState,
  setRunState
}: LifecycleOptions) {
  useEffect(() => {
    let cancelled = false;

    async function openSidebar() {
      const nextSessionId = picoclawGateway.rotateSession();
      setActiveSessionId(nextSessionId);
      setIsFreshConversation(true);
      setMessages([]);
      // The newest saved chat is the one to continue. It is asked for while the runtime is
      // checked, so that it is ready when the chat connects.
      const newestRequest = listPicoclawSessions({ limit: 1 }).catch(() => null);
      try {
        const nextRuntimeStatus = await refreshStateRef.current();
        if (cancelled) {
          return;
        }

        // the install and model screens say this themselves
        if (
          nextRuntimeStatus?.installing ||
          nextRuntimeStatus?.installed === false ||
          nextRuntimeStatus?.model_configured === false
        ) {
          return;
        }

        if (!canConnectGateway(nextRuntimeStatus ?? null)) {
          return;
        }

        const newest = await loadNewestSession(await newestRequest);
        if (cancelled) {
          return;
        }
        if (newest) {
          setMessages(newest.messages);
          setActiveSessionId(newest.id);
          setIsFreshConversation(false);
        }
        // the list of the history is wanted next
        void listPicoclawSessions({ limit: 100 })
          .then((rsp) => {
            if (!cancelled && rsp.code === 0) {
              setHistorySessions(rsp.data || []);
            }
          })
          .catch(() => undefined);

        setMessages((current) => [
          ...current,
          createStatusMessage(t('picoclaw.status.connecting'))
        ]);
        // The chat is shown now; the input is enabled once the connection is up.
        setIsInitializing(false);
        try {
          await connectGateway(newest?.id ?? nextSessionId);
        } catch {
          // handled by gateway events
        }
      } finally {
        if (!cancelled) {
          setIsInitializing(false);
        }
      }
    }

    void openSidebar();

    return () => {
      cancelled = true;
      void closeGateway();
      setTakeover((current) => ({
        ...current,
        active: false,
        reason: 'panel_closed'
      }));
      setOverlay(HIDDEN_OVERLAY);
      setTransportState('disconnected');
      setRunState('idle');
    };
  }, [
    refreshStateRef,
    setHistorySessions,
    setActiveSessionId,
    setIsFreshConversation,
    setIsInitializing,
    setMessages,
    setOverlay,
    setRunState,
    setTakeover,
    setTransportState,
    t
  ]);
}

export function usePicoclawInstallRefresh(
  isRuntimeInstallActive: boolean,
  refreshStateRef: RefObject<() => Promise<PicoclawRuntimeStatus | null>>
) {
  useEffect(() => {
    if (!isRuntimeInstallActive) {
      return;
    }

    const timer = window.setInterval(() => {
      void refreshStateRef.current();
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [isRuntimeInstallActive, refreshStateRef]);
}

export function usePicoclawInstallSnapshotSync({
  t,
  runtimeStatus,
  setInstallSnapshot,
  previousInstallStateRef,
  setMessages
}: InstallSnapshotOptions) {
  useEffect(() => {
    if (!runtimeStatus) {
      return;
    }

    const isInstalling = isPicoclawRuntimeInstalling(runtimeStatus);

    if (isInstalling) {
      const nextSnapshot = {
        installing: true,
        installProgress: runtimeStatus.install_progress,
        installStage: runtimeStatus.install_stage,
        status: runtimeStatus.status
      };
      setInstallSnapshot(nextSnapshot);
      setPicoclawRuntimeInstallSnapshot(nextSnapshot);
    } else {
      setInstallSnapshot(null);
      clearPicoclawRuntimeInstallSnapshot();
    }

    const previous = previousInstallStateRef.current;
    if (previous.installing && !isInstalling) {
      if (runtimeStatus.installed === true) {
        toast.success(t('picoclaw.install.success'));
      } else {
        setMessages((current) => [
          ...current,
          createErrorMessage({
            code: (runtimeStatus.status || 'runtime_install_failed').toUpperCase(),
            message: runtimeStatus.last_error || t('picoclaw.install.failed'),
            raw: runtimeStatus
          })
        ]);
      }
    }

    previousInstallStateRef.current = {
      installing: isInstalling,
      status: runtimeStatus.status
    };
  }, [runtimeStatus, setInstallSnapshot, setMessages, t, previousInstallStateRef]);
}
