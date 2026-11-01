import { useId } from 'react';

import type { Axis } from './scale';
import { HISTORY_LENGTH, TONE_COLORS } from './scale';

const WIDTH = 300;
const HEIGHT = 44;

type SparklineProps = {
  values: number[];
  axis: Axis;
  warn: number;
  crit: number;
  label: string;
};

// A line that turns orange and red above the marks. It fills from the right, so a page that has
// just opened shows its few readings next to the current value.
export const Sparkline = ({ values, axis, warn, crit, label }: SparklineProps) => {
  const id = useId().replace(/:/g, '');
  const y = (value: number) =>
    HEIGHT - 2 - ((value - axis.min) / (axis.max - axis.min)) * (HEIGHT - 4);
  const clampedY = (value: number) => Math.min(Math.max(y(value), 0), HEIGHT);

  const offset = HISTORY_LENGTH - values.length;
  const points = values.map(
    (value, index) =>
      `${(((index + offset) / (HISTORY_LENGTH - 1)) * WIDTH).toFixed(1)},${y(value).toFixed(1)}`
  );
  const line = points.join(' ');
  const firstX = (offset / (HISTORY_LENGTH - 1)) * WIDTH;

  const crit0 = (clampedY(crit) / HEIGHT).toFixed(3);
  const warn0 = (clampedY(warn) / HEIGHT).toFixed(3);

  return (
    <div className="relative mt-2.5 pl-8.5">
      <div className="absolute inset-y-0 left-0 w-7.5" aria-hidden>
        {axis.ticks.map((tick) => (
          <span
            key={tick}
            className="absolute right-0 -translate-y-1/2 text-xs text-neutral-500 tabular-nums"
            style={{ top: `${(y(tick) / HEIGHT) * 100}%` }}
          >
            {tick}
          </span>
        ))}
      </div>
      <svg
        role="img"
        aria-label={label}
        className="block w-full"
        height={HEIGHT}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={id} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={HEIGHT}>
            <stop offset="0" stopColor={TONE_COLORS.crit} />
            <stop offset={crit0} stopColor={TONE_COLORS.crit} />
            <stop offset={crit0} stopColor={TONE_COLORS.warn} />
            <stop offset={warn0} stopColor={TONE_COLORS.warn} />
            <stop offset={warn0} stopColor={TONE_COLORS.normal} />
            <stop offset="1" stopColor={TONE_COLORS.normal} />
          </linearGradient>
        </defs>
        {axis.ticks.map((tick) => (
          <line
            key={tick}
            x1="0"
            x2={WIDTH}
            y1={y(tick)}
            y2={y(tick)}
            stroke="#303030"
            strokeDasharray="3 3"
            vectorEffect="non-scaling-stroke"
          />
        ))}
        {values.length > 1 && (
          <>
            <polygon
              points={`${firstX.toFixed(1)},${HEIGHT} ${line} ${WIDTH},${HEIGHT}`}
              fill={`url(#${id})`}
              opacity="0.16"
            />
            <polyline
              points={line}
              fill="none"
              stroke={`url(#${id})`}
              strokeWidth="1.5"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </>
        )}
      </svg>
    </div>
  );
};
