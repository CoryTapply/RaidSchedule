import { useRef } from 'react';
import type { PointerEvent as ReactPointerEvent, MouseEvent as ReactMouseEvent } from 'react';

export interface LongPressHandlers {
  onPointerDown: (e: ReactPointerEvent) => void;
  onPointerUp: (e: ReactPointerEvent) => void;
  onPointerLeave: (e: ReactPointerEvent) => void;
  onPointerCancel: (e: ReactPointerEvent) => void;
  onContextMenu: (e: ReactMouseEvent) => void;
}

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
    timer.current = setTimeout(() => {
      fired.current = true;
      onTrigger();
    }, delay);
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

  return {
    onPointerDown,
    onPointerUp: cancel,
    onPointerLeave: cancel,
    onPointerCancel: cancel,
    onContextMenu,
  };
}
