import { http } from '@/lib/http.ts';

// Asks the server whether it will take an upload of this size (and name), before the browser
// sends a byte: a refusal after the body has started reaches it only as a connection reset.
// Returns why not, or null; a check that could not be made does not hold the upload back.
export async function checkUpload(
  url: string,
  params: Record<string, string | number>
): Promise<string | null> {
  try {
    const rsp = await http.get(url, params);
    return rsp.code === 0 ? null : rsp.msg || 'The upload was refused';
  } catch (err) {
    const reason = (err as { response?: { data?: { msg?: unknown } } })?.response?.data?.msg;
    return typeof reason === 'string' ? reason : null;
  }
}
