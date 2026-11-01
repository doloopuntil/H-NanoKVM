import type { ReactNode } from 'react';

type EmptyStateProps = {
  // the icon in the tile, 22px
  icon: ReactNode;
  title: string;
  description?: string;
  // what the user can do about it: a button, a progress bar
  children?: ReactNode;
};

// The screens of the sidebar that have nothing to show yet (start, install, no history, no
// messages): an icon tile, a title, a caption and an optional action, centred.
export const EmptyState = ({ icon, title, description, children }: EmptyStateProps) => (
  <div className="flex flex-1 flex-col items-center justify-center px-6 pt-6 pb-12 text-center">
    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04] text-neutral-500">
      {icon}
    </div>
    <div className="text-sm font-medium text-neutral-200">{title}</div>
    {description && (
      <div className="mt-1.5 max-w-xs text-xs leading-5 text-neutral-500">{description}</div>
    )}
    {children && <div className="mt-5 flex w-full max-w-xs flex-col items-center">{children}</div>}
  </div>
);
