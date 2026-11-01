import { Tooltip } from 'antd';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { useKeyboardLedStatus } from './use-keyboard-led-status';

const LOCK_INDICATORS = {
  numLock: {
    label: 'settings.keyboardLedStatus.numLock',
    shortLabel: 'settings.keyboardLedStatus.numLockShort'
  },
  capsLock: {
    label: 'settings.keyboardLedStatus.capsLock',
    shortLabel: 'settings.keyboardLedStatus.capsLockShort'
  },
  scrollLock: {
    label: 'settings.keyboardLedStatus.scrollLock',
    shortLabel: 'settings.keyboardLedStatus.scrollLockShort'
  }
} as const;

type LockIndicatorProps = {
  labelKey: 'numLock' | 'capsLock' | 'scrollLock';
  active: boolean;
  known: boolean;
};

function LockIndicator({ labelKey, active, known }: LockIndicatorProps) {
  const { t } = useTranslation();

  const { label, shortLabel } = LOCK_INDICATORS[labelKey];
  const state = known
    ? active
      ? t('settings.keyboardLedStatus.on')
      : t('settings.keyboardLedStatus.off')
    : t('settings.keyboardLedStatus.unknown');
  const indicatorLabel = t('settings.keyboardLedStatus.indicatorLabel', {
    label: t(label),
    state
  });

  return (
    <Tooltip title={indicatorLabel} placement="bottom" mouseEnterDelay={0.6}>
      <div
        className="flex h-2 items-center gap-1 px-1 text-[8px] leading-[8px] font-medium text-neutral-400"
        aria-label={indicatorLabel}
        role="img"
      >
        <span
          aria-hidden="true"
          className={clsx(
            'flex size-2 items-center justify-center rounded-full text-[7px] leading-none',
            known
              ? active
                ? 'bg-emerald-400'
                : 'bg-neutral-600'
              : 'border border-dashed border-neutral-500 text-neutral-300'
          )}
        >
          {!known && '?'}
        </span>
        <span className="hidden sm:inline">{t(shortLabel)}</span>
      </div>
    </Tooltip>
  );
}

export function KeyboardLedStatus() {
  const { t } = useTranslation();

  const status = useKeyboardLedStatus();
  const known = status?.known ?? false;

  return (
    <div
      className="flex h-full w-10 flex-col items-start justify-center rounded-sm bg-neutral-800/80"
      aria-label={t('settings.keyboardLedStatus.groupLabel')}
      role="group"
    >
      <LockIndicator labelKey="numLock" active={status?.numLock ?? false} known={known} />
      <LockIndicator labelKey="capsLock" active={status?.capsLock ?? false} known={known} />
      <LockIndicator labelKey="scrollLock" active={status?.scrollLock ?? false} known={known} />
    </div>
  );
}
