import type { CSSProperties, RefObject } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';

import type { Resolution } from '@/types';

type ScreenFit = {
  containerRef: RefObject<HTMLDivElement | null>;
  mediaStyle: CSSProperties;
};

const FALLBACK_SCREEN_WIDTH = 1920;
const FALLBACK_SCREEN_HEIGHT = 1080;
const SOURCE_SIZE_POLL_MS = 1000;

// The frame size the player shows: Auto follows the HDMI input, so its aspect can change.
function readSourceSize(container: HTMLElement): Resolution | null {
  const media = container.querySelector('#screen');
  if (media instanceof HTMLVideoElement && media.videoWidth > 0 && media.videoHeight > 0) {
    return { width: media.videoWidth, height: media.videoHeight };
  }
  if (media instanceof HTMLImageElement && media.naturalWidth > 0 && media.naturalHeight > 0) {
    return { width: media.naturalWidth, height: media.naturalHeight };
  }
  if (media instanceof HTMLCanvasElement) {
    const width = Number(media.dataset.mediaWidth);
    const height = Number(media.dataset.mediaHeight);
    if (width > 0 && height > 0) {
      return { width, height };
    }
  }
  return null;
}

export function useScreenFit(
  resolution: Resolution | null,
  videoScale: number,
  fallbackStyle: CSSProperties
): ScreenFit {
  const containerRef = useRef<HTMLDivElement>(null);
  const [fitScale, setFitScale] = useState(1);
  const [sourceSize, setSourceSize] = useState<Resolution | null>(null);
  const isAuto = !resolution?.width || !resolution?.height;
  const size = isAuto ? sourceSize : resolution;

  useEffect(() => {
    if (!isAuto) return;

    const timer = window.setInterval(() => {
      const container = containerRef.current;
      const next = container ? readSourceSize(container) : null;
      if (!next) return;
      setSourceSize((current) =>
        current?.width === next.width && current?.height === next.height ? current : next
      );
    }, SOURCE_SIZE_POLL_MS);
    return () => window.clearInterval(timer);
  }, [isAuto]);

  useEffect(() => {
    function updateFitScale() {
      if (!containerRef.current) {
        return;
      }

      const width = size?.width && size.width > 0 ? size.width : FALLBACK_SCREEN_WIDTH;
      const height = size?.height && size.height > 0 ? size.height : FALLBACK_SCREEN_HEIGHT;
      const rect = containerRef.current.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) {
        return;
      }

      const nextScale = Math.min(rect.width / width, rect.height / height, 1);
      setFitScale(Math.max(0.05, nextScale));
    }

    updateFitScale();

    const container = containerRef.current;
    if (typeof ResizeObserver === 'undefined' || !container) {
      window.addEventListener('resize', updateFitScale);
      window.addEventListener('orientationchange', updateFitScale);
      return () => {
        window.removeEventListener('resize', updateFitScale);
        window.removeEventListener('orientationchange', updateFitScale);
      };
    }

    const observer = new ResizeObserver(updateFitScale);
    observer.observe(container);
    window.addEventListener('orientationchange', updateFitScale);

    return () => {
      observer.disconnect();
      window.removeEventListener('orientationchange', updateFitScale);
    };
  }, [size?.height, size?.width]);

  useEffect(() => {
    if (!containerRef.current) return;

    const frame = window.requestAnimationFrame(() => {
      const container = containerRef.current;
      if (!container) return;

      container.scrollLeft = Math.max(0, (container.scrollWidth - container.clientWidth) / 2);
      container.scrollTop = Math.max(0, (container.scrollHeight - container.clientHeight) / 2);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [fitScale, size?.height, size?.width, videoScale]);

  const mediaStyle = useMemo<CSSProperties>(() => {
    const scale = fitScale * videoScale;
    const width = size?.width && size.width > 0 ? size.width : FALLBACK_SCREEN_WIDTH;
    const height = size?.height && size.height > 0 ? size.height : FALLBACK_SCREEN_HEIGHT;

    if (!size?.width || !size?.height) {
      return {
        ...fallbackStyle,
        width: Math.max(1, Math.round(width * scale)),
        height: Math.max(1, Math.round(height * scale)),
        maxWidth: undefined,
        maxHeight: undefined,
        objectFit: 'cover'
      };
    }

    return {
      width: Math.max(1, Math.round(size.width * scale)),
      height: Math.max(1, Math.round(size.height * scale)),
      objectFit: 'cover'
    };
  }, [fallbackStyle, fitScale, size, videoScale]);

  return { containerRef, mediaStyle };
}
