import { message, Modal, notification, type ModalFuncProps } from 'antd';
import i18n from 'i18next';

const ERROR_SECONDS = 5;

type CardOptions = { key?: string; description?: string };

function card(type: 'error' | 'warning', content: string, options: CardOptions) {
  notification[type]({
    title: content,
    description: options.description,
    key: options.key,
    duration: ERROR_SECONDS,
    placement: 'topRight'
  });
}

// Transient result of a user action. Failures and warnings are cards from the right so they
// stand out; the rest are one-line messages at the top.
export const toast = {
  success: (content: string) => message.success(content),
  info: (content: string) => message.info(content),
  warning: (content: string, options: CardOptions = {}) => card('warning', content, options),
  error: (content: string, options: CardOptions = {}) => card('error', content, options)
};

const LOAD_FAILED_KEY = 'load-failed';

// One shared toast, however many loads fail at once.
export function toastLoadFailed() {
  toast.error(i18n.t('common.loadFailed'), { key: LOAD_FAILED_KEY });
}

type ConfirmOptions = ModalFuncProps & { danger?: boolean };

// Set `danger` for destructive or irreversible actions.
export function confirm({ danger, ...props }: ConfirmOptions) {
  return Modal.confirm({
    centered: true,
    okText: i18n.t('common.confirm'),
    cancelText: i18n.t('common.cancel'),
    okButtonProps: { danger },
    ...props
  });
}

type Rsp = { code: number; msg?: string };

// BadRequest and Conflict messages are written for users; other codes carry raw errors.
const READABLE_CODES = [-1, -409];

function failureDetail(rsp?: Rsp) {
  return rsp && READABLE_CODES.includes(rsp.code) ? rsp.msg : undefined;
}

// Keyed by text: identical failures at once show a single toast.
function toastFailure(rsp?: Rsp) {
  const detail = failureDetail(rsp);
  toast.error(i18n.t('common.actionFailed'), {
    description: detail,
    key: `failed:${detail ?? ''}`
  });
}

// Run an API call; on failure show one error toast and return undefined. Pass
// `quiet` for refreshes nobody asked for, which only log.
export async function attempt<T extends Rsp>(
  call: () => Promise<T>,
  { quiet = false }: { quiet?: boolean } = {}
): Promise<T | undefined> {
  try {
    const rsp = await call();
    if (rsp.code === 0) return rsp;

    console.log(rsp.msg);
    if (!quiet) toastFailure(rsp);
  } catch (err) {
    console.log(err);
    if (!quiet) toastFailure((err as { response?: { data?: Rsp } }).response?.data);
  }

  return undefined;
}
