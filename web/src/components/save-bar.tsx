import { Button } from 'antd';

type SaveBarProps = {
  statusText?: string;
  statusKind?: 'error' | 'warning' | 'success' | '';
  label: string;
  loading?: boolean;
  disabled?: boolean;
  // without it the bar shows the status alone
  onSave?: () => void;
  // a second button that drops the changes; its label comes with it
  onDiscard?: () => void;
  discardLabel?: string;
};

const statusColors = {
  error: 'text-red-400',
  success: 'text-green-400',
  warning: 'text-yellow-400/80'
};

// The bar that sticks to the bottom of a settings page while it has changes to save. It is as wide
// as the content, in the colour of the panel behind it (as the System header), with a hairline
// above it and a shadow-sm that pushes up from there. The shadow-sm has
// a negative spread so that it is as wide as the bar and fades out before its sides: the scroll
// area clips what goes beyond the content width, and a wider shadow-sm would end in a hard edge.
export const SaveBar = ({
  statusText,
  statusKind = 'warning',
  label,
  loading = false,
  disabled = false,
  onSave,
  onDiscard,
  discardLabel
}: SaveBarProps) => (
  <div className="sticky bottom-0 z-10 flex min-w-0 flex-wrap items-center justify-end gap-3 border-t border-white/[0.06] bg-settings-panel py-4 shadow-[0_-20px_20px_-20px_rgba(0,0,0,0.5)]">
    {statusText && (
      <span className={`min-w-0 text-xs ${statusColors[statusKind || 'warning']}`}>
        {statusText}
      </span>
    )}
    {onDiscard && (
      <Button disabled={loading} onClick={onDiscard}>
        {discardLabel}
      </Button>
    )}
    {onSave && (
      <Button type="primary" loading={loading} disabled={disabled} onClick={onSave}>
        {label}
      </Button>
    )}
  </div>
);
