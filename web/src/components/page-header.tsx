import type { ReactNode } from 'react';

import { useIsTouchLayout } from '@/hooks/useResponsiveLayout.ts';
import { LoadBanner } from '@/components/settings-load-group.tsx';

type PageHeaderProps = {
  title: string;
  // what sits on the right of the title, such as a sub-navigation
  children?: ReactNode;
};

// The title of a Settings page, which stays in view while the page scrolls. The touch layout has
// none: the navigation above the page names it. The load banner of the
// page comes right below it, where the header's cover would not hide it.
export const PageHeader = ({ title, children }: PageHeaderProps) => {
  const isTouchLayout = useIsTouchLayout();

  // the navigation on top of the touch layout already names the page
  if (isTouchLayout) {
    return <LoadBanner />;
  }

  return (
    <>
      <div className="bg-settings-panel before:bg-settings-panel sticky top-0 z-20 mb-8 min-w-0 border-b border-white/[0.06] pb-6 shadow-[0_20px_20px_-20px_rgba(0,0,0,0.5)] backdrop-blur-sm before:absolute before:right-0 before:bottom-full before:left-0 before:h-10 before:content-[''] sm:top-10">
        {/* The shadow-sm has a negative spread, so it is as wide as the header and fades out before
            its sides: the scroll area clips whatever goes beyond the content width, and a shadow-sm
            that reached it would end in a hard edge beside the title. The cover above leaves room
            for the dialog's own title bar. The shadow-sm box is the header's height minus 40px, so
            the header's own padding is what keeps the shadow-sm visible. */}
        <div className="flex items-center justify-between gap-3">
          <div className="shrink-0 text-base leading-7">{title}</div>
          {children && <div className="flex min-w-0 items-center justify-end">{children}</div>}
        </div>
      </div>

      <LoadBanner />
    </>
  );
};
