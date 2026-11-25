import { describe, expect, it } from 'vitest';

import { closeErrorFor, messageKindOf, toolCallsFromPayload } from './picoclaw-protocol.ts';

describe('messageKindOf', () => {
  it('tells tool calls and thoughts from text', () => {
    expect(messageKindOf({ kind: 'tool_calls' })).toBe('tool_calls');
    expect(messageKindOf({ kind: ' Thought ' })).toBe('thought');
    expect(messageKindOf({ thought: true })).toBe('thought');
    expect(messageKindOf({ content: 'hello' })).toBe('text');
    expect(messageKindOf({ kind: 'something else' })).toBe('text');
  });
});

describe('closeErrorFor', () => {
  it('knows the codes of the server and says them in the translation', () => {
    expect(closeErrorFor(4001)).toEqual({ code: 'AI_LOCK_HELD', key: 'picoclaw.error.lockHeld' });
    expect(closeErrorFor(4004)?.key).toBe('picoclaw.error.takenOver');
    expect(closeErrorFor(4005)?.key).toBe('picoclaw.error.upstreamClosed');
    expect(closeErrorFor(4002)?.key).toBe('picoclaw.connection.runtime.unavailable');
    expect(closeErrorFor(1006)).toBeUndefined();
  });
});

describe('toolCallsFromPayload', () => {
  it('reads the calls PicoClaw sends', () => {
    const calls = toolCallsFromPayload({
      kind: 'tool_calls',
      tool_calls: [
        {
          id: 'toolu_1',
          type: 'function',
          function: { name: 'mcp_hnanokvm_kvm_screenshot', arguments: '{}' }
        },
        {
          function: { name: 'mcp_hnanokvm_kvm_actions', arguments: '{"actions":[' },
          extra_content: { tool_feedback_explanation: '  List the logs  ' }
        }
      ]
    });

    expect(calls).toEqual([
      {
        id: 'toolu_1',
        name: 'mcp_hnanokvm_kvm_screenshot',
        arguments: '{}',
        explanation: undefined
      },
      {
        id: '1',
        name: 'mcp_hnanokvm_kvm_actions',
        arguments: '{"actions":[',
        explanation: 'List the logs'
      }
    ]);
  });

  it('ignores a payload without calls or with odd entries', () => {
    expect(toolCallsFromPayload({})).toEqual([]);
    expect(toolCallsFromPayload({ tool_calls: 'x' })).toEqual([]);
    expect(toolCallsFromPayload({ tool_calls: [null, 3] })).toEqual([]);
  });
});
