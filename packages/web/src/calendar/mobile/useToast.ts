import { useCallback, useEffect, useRef, useState } from 'react';

export interface ToastMessage {
  id: number;
  text: string;
}

const AUTO_DISMISS_MS = 2200;

export interface UseToastResult {
  toast: ToastMessage | null;
  push: (text: string) => void;
}

/** A single toast at a time — pushing a new one replaces whatever's showing and restarts the auto-dismiss timer. */
export function useToast(): UseToastResult {
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nextId = useRef(0);

  const push = useCallback((text: string) => {
    if (timer.current != null) clearTimeout(timer.current);
    const id = nextId.current++;
    setToast({ id, text });
    timer.current = setTimeout(() => setToast(null), AUTO_DISMISS_MS);
  }, []);

  useEffect(() => {
    return () => {
      if (timer.current != null) clearTimeout(timer.current);
    };
  }, []);

  return { toast, push };
}
