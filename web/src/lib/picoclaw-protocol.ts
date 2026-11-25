// What PicoClaw's pico channel puts in the payload of a message, as far as the chat needs it.

export type GatewayToolCall = {
  id: string;
  // the name of the tool, such as mcp_hnanokvm_kvm_actions
  name: string;
  // a preview of the arguments, cut after a few hundred characters, so not always valid JSON
  arguments: string;
  // the agent's own one line on why it makes the call
  explanation?: string;
};

// The codes the server closes a chat connection with when something is wrong, and the translated
// text that says what it is. The server's own reason is English.
const CLOSE_ERRORS: Record<number, { code: string; key: string }> = {
  4001: { code: 'AI_LOCK_HELD', key: 'picoclaw.error.lockHeld' },
  4002: { code: 'RUNTIME_UNAVAILABLE', key: 'picoclaw.connection.runtime.unavailable' },
  4003: { code: 'AUTH_FAILED', key: 'picoclaw.error.authFailed' },
  4004: { code: 'AI_TAKEN_OVER', key: 'picoclaw.error.takenOver' },
  4005: { code: 'UPSTREAM_CLOSED', key: 'picoclaw.error.upstreamClosed' }
};

export function closeErrorFor(closeCode: number): { code: string; key: string } | undefined {
  return CLOSE_ERRORS[closeCode];
}

export type GatewayMessageKind = 'text' | 'thought' | 'tool_calls';

export function messageKindOf(payload: Record<string, unknown>): GatewayMessageKind {
  const kind = typeof payload.kind === 'string' ? payload.kind.trim().toLowerCase() : '';
  if (kind === 'tool_calls') {
    return 'tool_calls';
  }
  // older servers marked a thought with a boolean
  if (kind === 'thought' || payload.thought === true) {
    return 'thought';
  }
  return 'text';
}

export function toolCallsFromPayload(payload: Record<string, unknown>): GatewayToolCall[] {
  const calls = payload.tool_calls;
  if (!Array.isArray(calls)) {
    return [];
  }

  return calls.flatMap((raw, index) => {
    if (!raw || typeof raw !== 'object') {
      return [];
    }
    const call = raw as Record<string, unknown>;
    const fn = (call.function || {}) as Record<string, unknown>;
    const extra = (call.extra_content || {}) as Record<string, unknown>;
    const explanation =
      typeof extra.tool_feedback_explanation === 'string'
        ? extra.tool_feedback_explanation.trim()
        : '';

    return [
      {
        id: typeof call.id === 'string' && call.id ? call.id : String(index),
        name: typeof fn.name === 'string' ? fn.name : '',
        arguments: typeof fn.arguments === 'string' ? fn.arguments : '',
        explanation: explanation || undefined
      }
    ];
  });
}
