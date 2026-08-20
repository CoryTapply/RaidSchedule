import { useEffect, useRef, useState, type RefObject } from 'react';

/**
 * Reports whether the observed element's inline size has crossed `thresholdPx`.
 * Drives the discrete content differences between the standard and 4K designs
 * (full vs. abbreviated weekday names, the reset/today day annotation) — the
 * purely visual scaling (padding/gaps/font sizes) is handled separately via
 * CSS clamp()/container queries, not this hook.
 */
export function useContainerBreakpoint<T extends HTMLElement>(thresholdPx: number): [RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null);
  const [isLarge, setIsLarge] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const inlineSize = entry.contentBoxSize?.[0]?.inlineSize ?? entry.contentRect.width;
      setIsLarge(inlineSize >= thresholdPx);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [thresholdPx]);

  return [ref, isLarge];
}
