/**
 * Measures with rects, not offsetTop — offsetTop is only correct when the scroller is the
 * element's offsetParent, which requires the scroller to be `position: relative` (see
 * MobileDayList.module.css). Measuring by rect delta sidesteps that requirement entirely.
 */
export function rowTop(scroller: HTMLElement, el: HTMLElement): number {
  return scroller.scrollTop + (el.getBoundingClientRect().top - scroller.getBoundingClientRect().top);
}

export function scrollToKey(
  scroller: HTMLElement,
  rowEls: ReadonlyMap<string, HTMLElement>,
  key: string,
  behavior: ScrollBehavior,
): void {
  const el = rowEls.get(key);
  if (!el) return;
  // Not implemented in jsdom (undefined in the test environment) — real browsers all support it.
  scroller.scrollTo?.({ top: Math.max(0, rowTop(scroller, el) - 6), behavior });
}

/**
 * The row with the greatest rowTop that's still at or above the scroller's current top edge
 * (plus an 8px tolerance so a row's own top rule doesn't flicker the pick). Rows detached
 * from the document (e.g. mid re-render) are skipped. Returns null if nothing qualifies yet
 * (rows not measured, or the scroller hasn't laid out).
 */
export function pickActiveKey(scroller: HTMLElement, rowEls: ReadonlyMap<string, HTMLElement>): string | null {
  const threshold = scroller.scrollTop + 8;
  let bestKey: string | null = null;
  let bestTop = -Infinity;
  for (const [key, el] of rowEls) {
    if (!el.isConnected) continue;
    const top = rowTop(scroller, el);
    if (top <= threshold && top > bestTop) {
      bestTop = top;
      bestKey = key;
    }
  }
  return bestKey;
}
