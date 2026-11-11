import { getCsrfToken, removeToken } from '@/lib/cookie.ts';
import { capitalizeFirst } from '@/lib/text.ts';

// The browser side of an upload to the NanoKVM, shared by the image and the update bundle
// uploads: a multipart POST with the session's CSRF token, progress, an abort, and a stall
// watchdog instead of a fixed timeout, so that a slow upload that still moves goes on and a dead
// one stops. What an upload is for (which URL, which checks before and after) is the caller's.

// No byte moved for this long: the upload has stalled.
export const UPLOAD_STALL_MS = 90_000;

export type UploadResponse = { code: number; msg: string; data: any };

type FailureKind = 'http' | 'network' | 'stalled' | 'aborted';

export class UploadError extends Error {
  readonly kind: FailureKind;
  readonly status?: number;
  // what the server said, when it said anything
  readonly serverMessage?: string;

  constructor(kind: FailureKind, message: string, status?: number, serverMessage?: string) {
    super(message);
    this.kind = kind;
    this.status = status;
    this.serverMessage = serverMessage;
  }
}

type StartOptions = {
  url: string;
  data: FormData;
  headers?: Record<string, string>;
  // `total` is null while the browser does not know it
  onProgress?: (loaded: number, total: number | null) => void;
  stallMs?: number;
  // for tests
  createRequest?: () => XMLHttpRequest;
};

export type Upload = {
  // Resolves with the server's reply to any 2xx answer, whatever its `code`; rejects with an
  // UploadError for the rest.
  promise: Promise<UploadResponse>;
  abort: () => void;
};

function parseBody(raw: string): { code?: number; msg?: unknown; data?: unknown } | null {
  try {
    const body = JSON.parse(raw);
    return body && typeof body === 'object' ? body : null;
  } catch {
    return null;
  }
}

export function startUpload({
  url,
  data,
  headers,
  onProgress,
  stallMs = UPLOAD_STALL_MS,
  createRequest = () => new XMLHttpRequest()
}: StartOptions): Upload {
  const xhr = createRequest();
  let reason: 'stalled' | 'aborted' | null = null;
  let timer: ReturnType<typeof setTimeout> | undefined;

  const stopTimer = () => {
    if (timer) clearTimeout(timer);
    timer = undefined;
  };
  const armTimer = () => {
    stopTimer();
    if (stallMs <= 0) return;
    timer = setTimeout(() => {
      reason = 'stalled';
      xhr.abort();
    }, stallMs);
  };

  const promise = new Promise<UploadResponse>((resolve, reject) => {
    xhr.open('POST', url);
    xhr.withCredentials = true;
    const csrfToken = getCsrfToken();
    if (csrfToken) xhr.setRequestHeader('x-csrf-token', csrfToken);
    for (const [name, value] of Object.entries(headers ?? {})) {
      xhr.setRequestHeader(name, value);
    }

    xhr.upload.onprogress = (event) => {
      armTimer();
      onProgress?.(event.loaded, event.lengthComputable && event.total > 0 ? event.total : null);
    };

    xhr.onload = () => {
      stopTimer();
      const body = parseBody(xhr.responseText);
      const serverMessage = typeof body?.msg === 'string' ? capitalizeFirst(body.msg) : undefined;

      if (xhr.status >= 200 && xhr.status < 300 && typeof body?.code === 'number') {
        // as the rest of the app does, only a refusal is capitalised
        resolve({
          code: body.code,
          msg: body.code === 0 ? String(body.msg ?? '') : (serverMessage ?? ''),
          data: body.data
        });
        return;
      }

      // the same as any other request of the app: a lost session or token logs out
      if (
        xhr.status === 401 ||
        (xhr.status === 403 && serverMessage?.toLowerCase().includes('csrf'))
      ) {
        removeToken();
        window.location.reload();
      }
      reject(
        new UploadError('http', serverMessage ?? `HTTP ${xhr.status}`, xhr.status, serverMessage)
      );
    };

    xhr.onerror = () => {
      stopTimer();
      reject(new UploadError('network', 'Network error'));
    };

    xhr.onabort = () => {
      stopTimer();
      reject(
        reason === 'stalled'
          ? new UploadError('stalled', 'The upload stalled')
          : new UploadError('aborted', 'The upload was canceled')
      );
    };

    armTimer();
    xhr.send(data);
  });

  return {
    promise,
    abort: () => {
      reason ??= 'aborted';
      xhr.abort();
    }
  };
}
