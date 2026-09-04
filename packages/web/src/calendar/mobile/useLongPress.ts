import { useRef } from 'react';
import type { PointerEvent as ReactPointerEvent, MouseEvent as ReactMouseEvent, TouchEvent as ReactTouchEvent } from 'react';

export interface LongPressHandlers {
  onPointerDown: (e: ReactPointerEvent) => void;
  onPointerMove: (e: ReactPointerEvent) => void;
  onPointerUp: (e: ReactPointerEvent) => void;
  onPointerLeave: (e: ReactPointerEvent) => void;
  onPointerCancel: (e: ReactPointerEvent) => void;
  onContextMenu: (e: ReactMouseEvent) => void;
  onTouchEnd: (e: ReactTouchEvent) => void;
}

const MOVE_TOLERANCE_PX = 10;

/**
 * Press-and-hold to trigger, wired on pointer events (not touch events) so a right-click or
 * mouse hold works in a desktop browser too. Right-click skips the timer entirely (button !==
 * 0) and fires via onContextMenu instead; the `fired` guard exists because Android Chrome can
 * still raise a native contextmenu around its own long-press threshold in addition to our
 * timer — whichever path wins fires once, the other is a no-op.
 */
export function useLongPress(onTrigger: () => void, delay = 420): LongPressHandlers {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fired = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);

  function clear() {
    if (timer.current != null) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }

  function onPointerDown(e: ReactPointerEvent) {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    fired.current = false;
    clear();
    startX.current = e.clientX;
    startY.current = e.clientY;
    timer.current = setTimeout(() => {
      fired.current = true;
      onTrigger();
    }, delay);
  }

  // A long press that survives a scroll is a bug — cancel as soon as the finger has moved past
  // a small tolerance, same as a scroll gesture would.
  function onPointerMove(e: ReactPointerEvent) {
    if (timer.current == null) return;
    const dx = e.clientX - startX.current;
    const dy = e.clientY - startY.current;
    if (Math.hypot(dx, dy) > MOVE_TOLERANCE_PX) clear();
  }

  function cancel() {
    clear();
  }

  function onContextMenu(e: ReactMouseEvent) {
    e.preventDefault();
    clear();
    if (fired.current) return;
    fired.current = true;
    onTrigger();
  }

  // Fix for click-through / ghost taps: without this, the synthetic click iOS fires ~300ms
  // after touchend lands on whatever is now under the finger (e.g. a control in the sheet the
  // long press just opened).
  function onTouchEnd(e: ReactTouchEvent) {
    if (fired.current) e.preventDefault();
  }

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp: cancel,
    onPointerLeave: cancel,
    onPointerCancel: cancel,
    onContextMenu,
    onTouchEnd,
  };
}
