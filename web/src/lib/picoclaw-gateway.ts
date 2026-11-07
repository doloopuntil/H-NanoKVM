import i18n from 'i18next';

import {
  closeErrorFor,
  messageKindOf,
  toolCallsFromPayload,
  type GatewayToolCall
} from '@/lib/picoclaw-protocol.ts';
import { clearPicoclawSessionId, setPicoclawSessionId } from '@/lib/picoclaw-storage.ts';
import { getBaseUrl } from '@/lib/service.ts';

export type GatewayTransportState = 'disconnected' | 'connecting' | 'connected' | 'error';

export type GatewayRunState = 'idle' | 'busy';

export type GatewayRuntimeStatus = {
  ready: boolean;
  installed: boolean;
  installing: boolean;
  install_progress?: number;
  install_stage?: string;
  install_path?: string;
  model_configured: boolean;
  model_name?: string;
  status: string;
  config_error?: string;
  last_error?: string;
  checked_at?: string;
  current_session?: string;
};

export type GatewayAssistantMessage = {
  id: string;
  text: string;
  raw: Record<string, unknown>;
};

export type GatewayToolAction = {
  id: string;
  action: string;
  x?: number;
  y?: number;
  raw: Record<string, unknown>;
};

export type GatewayToolCalls = {
  // the id of the message, which the ids of its calls are built from
  id: string;
  calls: GatewayToolCall[];
  raw: Record<string, unknown>;
};

export type GatewayObservation = {
  id: string;
  text?: string;
  imageBase64?: string;
  raw: Record<string, unknown>;
};

export type GatewayError = {
  code: string;
  message: string;
  raw?: unknown;
};

export type GatewayClose = {
  code: number;
  reason: string;
};

type GatewayEventMap = {
  connected: { sessionId: string };
  transport_state: GatewayTransportState;
  run_state: GatewayRunState;
  assistant_message: GatewayAssistantMessage;
  tool_action: GatewayToolAction;
  tool_calls: GatewayToolCalls;
  observation: GatewayObservation;
  error: GatewayError;
  close: GatewayClose;
};

type EventName = keyof GatewayEventMap;
type Listener<T extends EventName> = (payload: GatewayEventMap[T]) => void;

type ConnectOptions = {
  sessionId?: string;
  autoReconnect?: boolean;
};

type SendMessageOptions = {
  id?: string;
  maxSteps?: number;
  maxRuntimeMs?: number;
  trackState?: boolean;
};

export function generateUUIDv4() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  if (typeof crypto === 'undefined' || typeof crypto.getRandomValues !== 'function') {
    throw new Error('secure random source is unavailable');
  }

  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

// PicoClaw says nothing when a run is over: it stops its typing signal with the first message,
// also an interim one such as "I'll list the logs", and the agent goes on to work. A text message
// is taken as the last one when no tool call follows it within this time (the call is sent right
// after the text).
const RUN_END_GRACE_MS = 1500;
// A run that says nothing for this long is taken as over, so that a lost message cannot leave
// the chat busy for good.
const RUN_SILENCE_LIMIT_MS = 2 * 60 * 1000;

class PicoClawGateway {
  private ws: WebSocket | null = null;
  private listeners = new Map<EventName, Set<Listener<EventName>>>();
  private connectPromise: Promise<string> | null = null;
  private sessionId = '';
  private connectionAttemptId = 0;
  private autoReconnect = false;
  private reconnectAttempts = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private explicitClose = false;
  private runEndTimer: ReturnType<typeof setTimeout> | null = null;
  private runSilenceTimer: ReturnType<typeof setTimeout> | null = null;

  public connect(options: ConnectOptions = {}) {
    if (options.sessionId) {
      this.sessionId = options.sessionId;
      setPicoclawSessionId(options.sessionId);
    } else if (!this.ws || this.ws.readyState === WebSocket.CLOSED) {
      this.sessionId = generateUUIDv4();
      setPicoclawSessionId(this.sessionId);
    }

    if (
      this.ws &&
      (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)
    ) {
      return this.connectPromise ?? Promise.resolve(this.sessionId);
    }

    this.autoReconnect = !!options.autoReconnect;
    this.explicitClose = false;
    this.clearReconnectTimer();
    this.setTransportState('connecting');

    const sessionId = this.sessionId || generateUUIDv4();
    const attemptId = ++this.connectionAttemptId;
    this.sessionId = sessionId;
    setPicoclawSessionId(sessionId);
    const url = `${getBaseUrl('ws')}/api/picoclaw/gateway/ws?session_id=${encodeURIComponent(sessionId)}`;

    this.connectPromise = new Promise<string>((resolve, reject) => {
      const ws = new WebSocket(url);
      this.ws = ws;

      ws.onopen = () => {
        if (this.ws !== ws || this.connectionAttemptId !== attemptId) {
          return;
        }
        this.reconnectAttempts = 0;
        this.emit('connected', { sessionId });
        this.setTransportState('connected');
        this.setRunState('idle');
        resolve(sessionId);
      };

      ws.onerror = () => {
        if (this.ws !== ws || this.connectionAttemptId !== attemptId) {
          return;
        }
        this.setTransportState('error');
      };

      ws.onclose = (event) => {
        if (this.ws !== ws || this.connectionAttemptId !== attemptId) {
          return;
        }
        this.ws = null;

        if (event.code !== 1000) {
          const closeError = closeErrorFor(event.code);
          if (closeError) {
            this.emit('error', {
              code: closeError.code,
              message: i18n.t(closeError.key),
              raw: { code: event.code, reason: event.reason }
            });
          }
        }

        this.emit('close', {
          code: event.code,
          reason: event.reason
        });

        this.setTransportState(event.code === 1000 ? 'disconnected' : 'error');
        this.setRunState('idle');

        if (!this.explicitClose) {
          reject(new Error(event.reason || 'gateway closed'));
          if (this.autoReconnect) {
            this.scheduleReconnect();
          }
        }
      };

      ws.onmessage = (event) => {
        if (this.ws !== ws || this.connectionAttemptId !== attemptId) {
          return;
        }
        this.handleMessage(event.data);
      };
    }).finally(() => {
      if (this.connectionAttemptId === attemptId) {
        this.connectPromise = null;
      }
    });

    return this.connectPromise;
  }

  public on<T extends EventName>(eventName: T, listener: Listener<T>) {
    const current = this.listeners.get(eventName) || new Set();
    current.add(listener as Listener<EventName>);
    this.listeners.set(eventName, current);

    return () => {
      current.delete(listener as Listener<EventName>);
      if (current.size === 0) {
        this.listeners.delete(eventName);
      }
    };
  }

  public sendChatMessage(content: string, options: SendMessageOptions = {}) {
    const trimmed = content.trim();
    if (!trimmed || !this.ws || this.ws.readyState !== WebSocket.OPEN) {
      return null;
    }

    const id = options.id || generateUUIDv4();
    if (options.trackState !== false) {
      this.setRunState('busy');
    }

    this.ws.send(
      JSON.stringify({
        id,
        session_id: this.sessionId,
        type: 'message.send',
        payload: {
          content: trimmed,
          max_steps: options.maxSteps,
          max_runtime_ms: options.maxRuntimeMs
        }
      })
    );

    return { id, sessionId: this.sessionId };
  }

  public sendStopMessage() {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      return false;
    }

    this.ws.send(
      JSON.stringify({
        type: 'message.cancel',
        session_id: this.sessionId,
        payload: {}
      })
    );
    return true;
  }

  public close(code = 1000, reason = 'NORMAL_CLOSURE') {
    this.explicitClose = true;
    this.clearReconnectTimer();

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.close(code, reason);
    } else if (this.ws && this.ws.readyState === WebSocket.CONNECTING) {
      this.ws.close();
    }

    this.ws = null;
    this.setTransportState('disconnected');
    this.setRunState('idle');
  }

  public rotateSession() {
    this.close();
    clearPicoclawSessionId();
    this.sessionId = generateUUIDv4();
    setPicoclawSessionId(this.sessionId);
    return this.sessionId;
  }

  public getSessionId() {
    return this.sessionId;
  }

  private scheduleReconnect() {
    this.clearReconnectTimer();
    this.reconnectAttempts += 1;
    const delay = Math.min(1000 * this.reconnectAttempts, 5000);
    this.reconnectTimer = setTimeout(() => {
      this.connect({ sessionId: this.sessionId, autoReconnect: true }).catch(() => undefined);
    }, delay);
  }

  private clearReconnectTimer() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  private setTransportState(state: GatewayTransportState) {
    this.emit('transport_state', state);
  }

  private setRunState(state: GatewayRunState) {
    this.clearRunTimers();
    if (state === 'busy') {
      this.runSilenceTimer = setTimeout(() => this.setRunState('idle'), RUN_SILENCE_LIMIT_MS);
    }
    this.emit('run_state', state);
  }

  // The last message was text: the run is over unless the agent goes on within the grace time.
  private endRunSoon() {
    this.clearRunTimers();
    this.runEndTimer = setTimeout(() => this.setRunState('idle'), RUN_END_GRACE_MS);
  }

  private clearRunTimers() {
    if (this.runEndTimer) {
      clearTimeout(this.runEndTimer);
      this.runEndTimer = null;
    }
    if (this.runSilenceTimer) {
      clearTimeout(this.runSilenceTimer);
      this.runSilenceTimer = null;
    }
  }

  private handleMessage(rawData: string | ArrayBuffer | Blob) {
    if (typeof rawData !== 'string') {
      return;
    }

    let message: Record<string, unknown>;
    try {
      message = JSON.parse(rawData) as Record<string, unknown>;
    } catch {
      this.emit('error', {
        code: 'INVALID_MESSAGE',
        message: i18n.t('common.actionFailed'),
        raw: rawData
      });
      return;
    }

    const type = String(message.type || '');
    if (type === 'typing.start') {
      this.setRunState('busy');
      return;
    }
    if (type === 'typing.stop') {
      return;
    }
    if (type === 'pong') {
      return;
    }
    if (type === 'error') {
      this.setTransportState('error');
      this.setRunState('idle');
      this.emit('error', {
        code: String(message.code || 'ERROR'),
        message: String(message.message || i18n.t('common.actionFailed')),
        raw: message
      });
      return;
    }
    if (type === 'message.create' || type === 'message.update') {
      const payload = (message.payload || {}) as Record<string, unknown>;
      const kind = messageKindOf(payload);
      const id = String(message.id || generateUUIDv4());

      if (kind === 'tool_calls') {
        // the agent is acting: it is not done
        this.setRunState('busy');
        const calls = toolCallsFromPayload(payload);
        if (calls.length > 0) {
          this.emit('tool_calls', { id, calls, raw: message });
        }
        return;
      }

      this.emit('assistant_message', { id, text: extractText(message), raw: message });
      if (kind === 'thought') {
        this.setRunState('busy');
      } else {
        this.endRunSoon();
      }
      return;
    }

    const imageBase64 = extractImageBase64(message);
    if (imageBase64) {
      this.emit('observation', {
        id: String(message.id || generateUUIDv4()),
        text: extractText(message),
        imageBase64,
        raw: message
      });
      return;
    }

    const action = extractAction(message);
    if (action) {
      this.emit('tool_action', {
        id: String(message.id || generateUUIDv4()),
        action: action.action,
        x: action.x,
        y: action.y,
        raw: message
      });
      return;
    }
  }

  private emit<T extends EventName>(eventName: T, payload: GatewayEventMap[T]) {
    const current = this.listeners.get(eventName);
    if (!current) {
      return;
    }

    current.forEach((listener) => {
      (listener as Listener<T>)(payload);
    });
  }
}

function extractText(message: Record<string, unknown>) {
  const payload = (message.payload || {}) as Record<string, unknown>;
  const content = payload.content ?? message.content ?? payload.text ?? message.text;

  if (typeof content === 'string') {
    return normalizeLiteralEmptyText(content);
  }
  if (Array.isArray(content)) {
    return content
      .map((item) => {
        if (typeof item === 'string') {
          return normalizeLiteralEmptyText(item);
        }
        if (item && typeof item === 'object' && 'text' in item) {
          return normalizeLiteralEmptyText(String((item as Record<string, unknown>).text || ''));
        }
        return '';
      })
      .filter(Boolean)
      .join('\n')
      .trim();
  }

  return '';
}

function extractImageBase64(message: Record<string, unknown>) {
  const payload = (message.payload || {}) as Record<string, unknown>;
  const data = (payload.data || message.data || {}) as Record<string, unknown>;

  const value = data.image_base64 || payload.image_base64 || message.image_base64;

  return typeof value === 'string' ? value : undefined;
}

function extractAction(message: Record<string, unknown>) {
  const payload = (message.payload || {}) as Record<string, unknown>;
  const actionValue = payload.action || message.action || payload.tool_name || message.tool_name;

  if (typeof actionValue !== 'string') {
    return null;
  }

  const action = normalizeLiteralEmptyText(actionValue);
  if (!action) {
    return null;
  }

  const x = typeof payload.x === 'number' ? payload.x : undefined;
  const y = typeof payload.y === 'number' ? payload.y : undefined;

  return {
    action,
    x,
    y
  };
}

function normalizeLiteralEmptyText(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return '';
  }

  const normalized = trimmed.toLowerCase();
  if (normalized === 'null' || normalized === 'undefined') {
    return '';
  }

  return trimmed;
}

export const picoclawGateway = new PicoClawGateway();
