import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useMediaQuery } from './useMediaQuery.js';

interface FakeMql {
  matches: boolean;
  listeners: Set<(e: MediaQueryListEvent) => void>;
  addEventListener: (type: string, cb: (e: MediaQueryListEvent) => void) => void;
  removeEventListener: (type: string, cb: (e: MediaQueryListEvent) => void) => void;
}

function fakeMatchMedia(initial: boolean) {
  const mql: FakeMql = {
    matches: initial,
    listeners: new Set(),
    addEventListener(_type, cb) {
      mql.listeners.add(cb);
    },
    removeEventListener(_type, cb) {
      mql.listeners.delete(cb);
    },
  };
  const fn = vi.fn().mockReturnValue(mql);
  window.matchMedia = fn as unknown as typeof window.matchMedia;
  return mql;
}

describe('useMediaQuery', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns the initial match state', () => {
    fakeMatchMedia(true);
    const { result } = renderHook(() => useMediaQuery('(max-width: 767px)'));
    expect(result.current).toBe(true);
  });

  it('updates when the media query change event fires', () => {
    const mql = fakeMatchMedia(false);
    const { result } = renderHook(() => useMediaQuery('(max-width: 767px)'));
    expect(result.current).toBe(false);

    act(() => {
      mql.matches = true;
      for (const cb of mql.listeners) cb({ matches: true } as MediaQueryListEvent);
    });

    expect(result.current).toBe(true);
  });
});
