export const INPUT_ID = 'nanokvm-mobile-local-keyboard';

export function focusMobileLocalKeyboard() {
  const input = document.getElementById(INPUT_ID) as HTMLTextAreaElement | null;
  input?.focus({ preventScroll: true });
}

export function blurMobileLocalKeyboard() {
  const input = document.getElementById(INPUT_ID) as HTMLTextAreaElement | null;
  input?.blur();
}
