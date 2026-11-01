import * as React from 'react';
import clsx from 'clsx';

// A box that scrolls vertically with a thin scrollbar on the dark panels. Chrome and Safari draw
// it from the ::-webkit-scrollbar variants, which have no arrow buttons; Chrome would ignore them
// if scrollbar-width or scrollbar-color were set, so those apply only where ::-webkit-scrollbar
// does not exist (Firefox).
function ScrollArea({
  className,
  viewportRef,
  ...props
}: React.ComponentProps<'div'> & { viewportRef?: React.Ref<HTMLDivElement> }) {
  return (
    <div
      ref={viewportRef}
      className={clsx(
        'overflow-y-auto',
        '[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-600 [&::-webkit-scrollbar-track]:bg-transparent',
        '[@supports_not_selector(::-webkit-scrollbar)]:scrollbar-thin [@supports_not_selector(::-webkit-scrollbar)]:[scrollbar-color:var(--color-neutral-600)_transparent]',
        className
      )}
      {...props}
    />
  );
}

export { ScrollArea };
