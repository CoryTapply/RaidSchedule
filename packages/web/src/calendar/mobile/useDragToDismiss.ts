import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react';

export interface DragToDismissHandlers {
  onPointerDown: (e: ReactPointerEvent) => void;
  onPointerMove: (e: ReactPointerEvent) => void;
  onPointerUp: (e: ReactPointerEvent) => void;
  onPointerCancel: (e: ReactPointerEvent) => void;
}

export interface DragToDismissResult {
  /** Apply to the whole sheet root — transform tracks the drag, transition springs it back or lets the dismiss animation play. */
  style: CSSProperties;
  /** Apply only to the drag surface (the header's center column). Needs `touch-action: none` in CSS so the browser doesn't intercept the gesture as a page scroll. */
  handleProps: DragToDismissHandlers;
}

const DISMISS_TRANSFORM = 900;
const DISMISS_TRANSITION_MS = 280;

/** Downward-only drag on a full-screen sheet's header; past `threshold`px it animates off and calls onDismiss. */
export function useDragToDismiss(onDismiss: () => void, threshold = 90): DragToDismissResult {
  const [dragY, setDragY] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startY = useRef(0);
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (dismissTimer.current != null) clearTimeout(dismissTimer.current);
    };
  }, []);

  function onPointerDown(e: ReactPointerEvent) {
    startY.current = e.clientY;
    setDragging(true);
    // Not implemented in jsdom (undefined in the test environment) — real browsers all support it.
    e.currentTarget.setPointerCapture?.(e.pointerId);
  }

  function onPointerMove(e: ReactPointerEvent) {
    if (!dragging) return;
    setDragY(Math.max(0, e.clientY - startY.current));
  }

  function release() {
    if (!dragging) return;
    setDragging(false);
    if (dragY > threshold) {
      setDragY(DISMISS_TRANSFORM);
      dismissTimer.current = setTimeout(() => {
        onDismiss();
        // Reset for the next open — the sheet stays mounted (see MobileComposerSheet), so
        // without this the transform would still be sitting at DISMISS_TRANSFORM next time
        // it's reopened, and it would come back stuck off-screen.
        setDragY(0);
      }, DISMISS_TRANSITION_MS);
    } else {
      setDragY(0);
    }
  }

  return {
    style: {
      transform: `translateY(${dragY}px)`,
      transition: dragging ? 'none' : `transform ${DISMISS_TRANSITION_MS}ms var(--zp-ease)`,
    },
    handleProps: {
      onPointerDown,
      onPointerMove,
      onPointerUp: release,
      onPointerCancel: release,
    },
  };
}
