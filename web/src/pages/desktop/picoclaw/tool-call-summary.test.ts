import { describe, expect, it } from 'vitest';

import { summarizeToolCall, type Translate } from './tool-call-summary.ts';

// the translation of English is the key with its values, so that the tests read the same
const t: Translate = (key, options) =>
  options
    ? `${key}(${Object.entries(options)
        .map(([k, v]) => `${k}=${v}`)
        .join(',')})`
    : key;

const call = (name: string, args = '{}', explanation?: string) => ({
  id: '1',
  name,
  arguments: args,
  explanation
});

describe('summarizeToolCall', () => {
  it('names the tools of PicoClaw and the KVM', () => {
    expect(summarizeToolCall(call('mcp_hnanokvm_kvm_screenshot'), t)).toBe(
      'picoclaw.tool.screenshot'
    );
    expect(summarizeToolCall(call('load_image'), t)).toBe('picoclaw.tool.loadImage');
    expect(summarizeToolCall(call('web_search'), t)).toBe('picoclaw.tool.generic(name=web_search)');
  });

  it('describes what is typed and pressed', () => {
    const args = JSON.stringify({
      actions: [
        { action: 'type', text: 'clear; ls -la /var/log' },
        { action: 'hotkey', keys: ['enter'] },
        { action: 'hotkey', keys: ['ctrl', 'c'] }
      ]
    });
    expect(summarizeToolCall(call('mcp_hnanokvm_kvm_actions', args), t)).toBe(
      'picoclaw.tool.type(text=`clear; ls -la /var/log`) · ' +
        'picoclaw.tool.hotkey(keys=`Enter`) · picoclaw.tool.hotkey(keys=`Ctrl + C`)'
    );
  });

  it('reads a batch that was cut off', () => {
    const args =
      '{"actions":[{"action":"type","text":"journalctl -n 100"},{"action":"hotkey","keys":["enter"]},{"action":"wa';
    expect(summarizeToolCall(call('mcp_hnanokvm_kvm_actions', args), t)).toBe(
      'picoclaw.tool.type(text=`journalctl -n 100`) · picoclaw.tool.hotkey(keys=`Enter`)'
    );
  });

  it('keeps long text short, and a backtick out of the code', () => {
    const text = 'echo `date` ' + 'x'.repeat(100);
    const out = summarizeToolCall(
      call('mcp_hnanokvm_kvm_actions', JSON.stringify({ actions: [{ action: 'type', text }] })),
      t
    );
    expect(out).toContain("echo 'date' xxx");
    expect(out.endsWith('…`)')).toBe(true);
    expect(out.match(/`/g)?.length).toBe(2);
  });

  it('describes mouse actions once each, and falls back when it cannot tell', () => {
    const scrolls = JSON.stringify({ actions: [{ action: 'scroll' }, { action: 'scroll' }] });
    expect(summarizeToolCall(call('mcp_hnanokvm_kvm_actions', scrolls), t)).toBe(
      'picoclaw.tool.scroll'
    );
    expect(summarizeToolCall(call('mcp_hnanokvm_kvm_actions', 'nonsense'), t)).toBe(
      'picoclaw.tool.actions'
    );
  });

  it("does not repeat the agent's own reason", () => {
    expect(
      summarizeToolCall(call('mcp_hnanokvm_kvm_screenshot', '{}', 'Check the screen first'), t)
    ).toBe('picoclaw.tool.screenshot');
  });
});
