import type { GatewayToolCall } from '@/lib/picoclaw-protocol.ts';

export type Translate = (key: string, options?: Record<string, unknown>) => string;

const MAX_TYPED_TEXT = 60;

type KvmAction = {
  action: string;
  text?: string;
  keys?: string[];
};

// What the agent is doing with one tool call, in a few words (not why: the agent's own reason
// is a long line of its thinking, and PicoClaw fills it in with a fallback sentence): "Taking a screenshot", "Typing
// `ls -la`" or "Pressing `Enter`". A call to the keyboard and mouse can hold several actions.
export function summarizeToolCall(call: GatewayToolCall, t: Translate): string {
  const name = call.name.replace(/^mcp_hnanokvm_/, '');

  let summary: string;
  switch (name) {
    case 'kvm_screenshot':
      summary = t('picoclaw.tool.screenshot');
      break;
    case 'load_image':
      summary = t('picoclaw.tool.loadImage');
      break;
    case 'kvm_actions':
      summary = summarizeActions(call.arguments, t) || t('picoclaw.tool.actions');
      break;
    default:
      summary = t('picoclaw.tool.generic', { name: name || '?' });
  }

  return summary;
}

function summarizeActions(args: string, t: Translate): string {
  const lines: string[] = [];
  for (const action of parseActions(args)) {
    const line = summarizeAction(action, t);
    // a scroll in ten steps is one line
    if (line && lines[lines.length - 1] !== line) {
      lines.push(line);
    }
  }
  return lines.join(' · ');
}

function summarizeAction(action: KvmAction, t: Translate): string {
  switch (action.action) {
    case 'type':
      return action.text ? t('picoclaw.tool.type', { text: code(action.text) }) : '';
    case 'hotkey': {
      const keys = (action.keys || []).map(keyLabel).filter(Boolean);
      return keys.length > 0 ? t('picoclaw.tool.hotkey', { keys: code(keys.join(' + ')) }) : '';
    }
    case 'click':
      return t('picoclaw.tool.click');
    case 'double-click':
    case 'double_click':
      return t('picoclaw.tool.doubleClick');
    case 'move':
      return t('picoclaw.tool.move');
    case 'drag':
      return t('picoclaw.tool.drag');
    case 'scroll':
      return t('picoclaw.tool.scroll');
    case 'wait':
      return t('picoclaw.tool.wait');
    default:
      return '';
  }
}

// The arguments are cut after a few hundred characters, so a long batch is not valid JSON:
// read what is there.
function parseActions(args: string): KvmAction[] {
  try {
    const parsed = JSON.parse(args) as { actions?: unknown };
    if (Array.isArray(parsed.actions)) {
      return parsed.actions.flatMap((item) => {
        const action = item as Record<string, unknown>;
        if (!action || typeof action.action !== 'string') {
          return [];
        }
        return [
          {
            action: action.action,
            text: typeof action.text === 'string' ? action.text : undefined,
            keys: Array.isArray(action.keys) ? action.keys.map(String) : undefined
          }
        ];
      });
    }
  } catch {
    // cut off: read it piece by piece
  }

  return args
    .split(/(?=\{\s*"action")/)
    .map((piece): KvmAction | null => {
      const action = /"action"\s*:\s*"([^"]+)"/.exec(piece)?.[1];
      if (!action) {
        return null;
      }
      const text = /"text"\s*:\s*"((?:[^"\\]|\\.)*)/.exec(piece)?.[1];
      const keys = /"keys"\s*:\s*\[([^\]]*)/.exec(piece)?.[1];
      return {
        action,
        text: text === undefined ? undefined : unescapeJson(text),
        keys: keys === undefined ? undefined : [...keys.matchAll(/"([^"]*)"/g)].map((m) => m[1])
      };
    })
    .filter((action): action is KvmAction => action !== null);
}

function unescapeJson(text: string): string {
  try {
    return JSON.parse(`"${text}"`) as string;
  } catch {
    return text.replace(/\\"/g, '"').replace(/\\n/g, ' ');
  }
}

// Inline code for the markdown of the chat.
function code(text: string): string {
  const flat = text.replace(/\s+/g, ' ').replace(/`/g, "'").trim();
  const shown = flat.length > MAX_TYPED_TEXT ? `${flat.slice(0, MAX_TYPED_TEXT)}…` : flat;
  return `\`${shown}\``;
}

function keyLabel(key: string): string {
  const trimmed = key.trim();
  return trimmed.length > 1 ? trimmed[0].toUpperCase() + trimmed.slice(1) : trimmed.toUpperCase();
}
