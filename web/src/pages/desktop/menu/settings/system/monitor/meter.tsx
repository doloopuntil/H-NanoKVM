import { CPU_SYSTEM_COLOR, CPU_USER_COLOR, type Tone } from './scale';

const BAR_COLORS: Record<Tone, string> = {
  normal: 'bg-blue-600',
  warn: 'bg-amber-500',
  crit: 'bg-red-500'
};

// A labelled value with a bar under it. Blocks of the same kind share a height on wide screens,
// so the two columns of the page line up.
export const Meter = ({
  label,
  caption,
  value,
  percent,
  tone = 'normal'
}: {
  label: string;
  caption: string;
  value: string;
  percent: number;
  tone?: Tone;
}) => (
  <div className="flex min-w-0 flex-col lg:min-h-14">
    <div className="flex items-end justify-between gap-4">
      <div className="flex min-w-0 flex-col space-y-0.5">
        <span className="text-sm text-neutral-300">{label}</span>
        <span className="wrap-break-word text-xs text-neutral-500">{caption}</span>
      </div>
      <div className="shrink-0 whitespace-nowrap text-[15px] tabular-nums text-neutral-200">
        {value}
      </div>
    </div>
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(percent)}
      className="mt-2 h-2 overflow-hidden rounded-sm bg-neutral-700/60"
    >
      <div className={`h-full rounded-sm ${BAR_COLORS[tone]}`} style={{ width: `${percent}%` }} />
    </div>
  </div>
);

// A bar made of two shares, such as the user and system time of the CPU.
export const SplitMeter = ({
  label,
  caption,
  value,
  first,
  second
}: {
  label: string;
  caption: string;
  value: string;
  first: number;
  second: number;
}) => {
  const firstWidth = Math.min(100, Math.max(0, first));
  const secondWidth = Math.min(100 - firstWidth, Math.max(0, second));
  return (
    <div className="flex min-w-0 flex-col lg:min-h-14">
      <div className="flex items-end justify-between gap-4">
        <div className="flex min-w-0 flex-col space-y-0.5">
          <span className="text-sm text-neutral-300">{label}</span>
          <span className="wrap-break-word text-xs text-neutral-500">{caption}</span>
        </div>
        <div className="shrink-0 whitespace-nowrap text-[15px] tabular-nums text-neutral-200">
          {value}
        </div>
      </div>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(firstWidth + secondWidth)}
        className="mt-2 flex h-2 overflow-hidden rounded-sm bg-neutral-700/60"
      >
        <div className={`h-full ${CPU_USER_COLOR}`} style={{ width: `${firstWidth}%` }} />
        <div className={`h-full ${CPU_SYSTEM_COLOR}`} style={{ width: `${secondWidth}%` }} />
      </div>
    </div>
  );
};
