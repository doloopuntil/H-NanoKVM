import { useSyncExternalStore } from 'react';
import { useAtomValue } from 'jotai';

import { layoutModeAtom } from '@/jotai/settings.ts';

const NARROW_LAYOUT_MAX_WIDTH = 849;
const TOUCH_TABLET_MAX_WIDTH = 1366;

function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener('change', onChange);
      return () => list.removeEventListener('change', onChange);
    },
    () => window.matchMedia(query).matches,
    () => false
  );
}

export function useIsTouchLayout() {
  const layoutMode = useAtomValue(layoutModeAtom);
  const isNarrow = useMediaQuery(`(max-width: ${NARROW_LAYOUT_MAX_WIDTH}px)`);
  const isTabletOrSmaller = useMediaQuery(`(max-width: ${TOUCH_TABLET_MAX_WIDTH}px)`);
  const hasCoarsePointer = useMediaQuery('(pointer: coarse)');
  const hasNoHover = useMediaQuery('(hover: none)');

  return (
    layoutMode === 'mobile' || isNarrow || (isTabletOrSmaller && (hasCoarsePointer || hasNoHover))
  );
}

export function useIsDesktopLayout() {
  return !useIsTouchLayout();
}
