import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { startUpload, UPLOAD_STALL_MS, UploadError } from './upload.ts';

class FakeRequest {
  upload: { onprogress: ((event: unknown) => void) | null } = { onprogress: null };
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  onabort: (() => void) | null = null;
  status = 0;
  responseText = '';
  withCredentials = false;
  headers: Record<string, string> = {};
  opened: [string, string] | null = null;
  sent: unknown = null;
  aborted = false;

  open(method: string, url: string) {
    this.opened = [method, url];
  }
  setRequestHeader(name: string, value: string) {
    this.headers[name] = value;
  }
  send(data: unknown) {
    this.sent = data;
  }
  abort() {
    this.aborted = true;
    this.onabort?.();
  }
  reply(status: number, body: string) {
    this.status = status;
    this.responseText = body;
    this.onload?.();
  }
}

function start(options: { stallMs?: number; headers?: Record<string, string> } = {}) {
  const request = new FakeRequest();
  const progress: Array<[number, number | null]> = [];
  const upload = startUpload({
    url: '/api/x/upload',
    data: new FormData(),
    headers: options.headers,
    stallMs: options.stallMs,
    onProgress: (loaded, total) => progress.push([loaded, total]),
    createRequest: () => request as unknown as XMLHttpRequest
  });
  return { request, progress, upload };
}

async function failure(promise: Promise<unknown>) {
  try {
    await promise;
  } catch (error) {
    return error as UploadError;
  }
  throw new Error('the upload did not fail');
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.stubGlobal('window', { location: { reload: vi.fn() } });
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('startUpload', () => {
  it('posts to the url with credentials and the given headers', () => {
    const { request } = start({ headers: { 'X-SHA256-Sum': 'abc' } });
    expect(request.opened).toEqual(['POST', '/api/x/upload']);
    expect(request.withCredentials).toBe(true);
    expect(request.headers['X-SHA256-Sum']).toBe('abc');
  });

  it('resolves with the reply of a 2xx answer, also when its code is not 0', async () => {
    const { request, upload } = start();
    request.reply(200, JSON.stringify({ code: -1, msg: 'no space left', data: null }));
    expect(await upload.promise).toEqual({ code: -1, msg: 'No space left', data: null });
  });

  it('reports the bytes sent, and no total while the browser does not know it', () => {
    const { request, progress } = start();
    request.upload.onprogress?.({ loaded: 5, total: 10, lengthComputable: true });
    request.upload.onprogress?.({ loaded: 7, total: 0, lengthComputable: false });
    expect(progress).toEqual([
      [5, 10],
      [7, null]
    ]);
  });

  it('rejects an error answer with what the server said, or with its status', async () => {
    const refused = start();
    refused.request.reply(400, JSON.stringify({ code: -1, msg: 'sha256 mismatch' }));
    const error = await failure(refused.upload.promise);
    expect(error.kind).toBe('http');
    expect(error.status).toBe(400);
    expect(error.serverMessage).toBe('Sha256 mismatch');

    const broken = start();
    broken.request.reply(502, '<html>bad gateway</html>');
    const unreadable = await failure(broken.upload.promise);
    expect(unreadable.message).toBe('HTTP 502');
    expect(unreadable.serverMessage).toBeUndefined();
  });

  it('rejects a connection failure as a network error', async () => {
    const { request, upload } = start();
    request.onerror?.();
    expect((await failure(upload.promise)).kind).toBe('network');
  });

  it('rejects an abort as aborted', async () => {
    const { request, upload } = start();
    upload.abort();
    expect(request.aborted).toBe(true);
    expect((await failure(upload.promise)).kind).toBe('aborted');
  });

  it('aborts and rejects as stalled when nothing moves for the stall time', async () => {
    const { request, upload } = start();
    vi.advanceTimersByTime(UPLOAD_STALL_MS + 1);
    expect(request.aborted).toBe(true);
    expect((await failure(upload.promise)).kind).toBe('stalled');
  });

  it('does not stall while bytes keep arriving', async () => {
    const { request, upload } = start({ stallMs: 1000 });
    for (let sent = 1; sent <= 5; sent += 1) {
      vi.advanceTimersByTime(900);
      request.upload.onprogress?.({ loaded: sent, total: 10, lengthComputable: true });
    }
    expect(request.aborted).toBe(false);
    request.reply(200, JSON.stringify({ code: 0, msg: 'success', data: {} }));
    expect((await upload.promise).code).toBe(0);
  });
});
