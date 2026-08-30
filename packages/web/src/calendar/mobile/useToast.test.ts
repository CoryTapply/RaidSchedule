import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useToast } from './useToast.js';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('useToast', () => {
  it('starts with no toast', () => {
    const { result } = renderHook(() => useToast());
    expect(result.current.toast).toBeNull();
  });

  it('shows a pushed message', () => {
    const { result } = renderHook(() => useToast());
    act(() => result.current.push('Event published'));
    expect(result.current.toast?.text).toBe('Event published');
  });

  it('auto-dismisses after 2.2s', () => {
    const { result } = renderHook(() => useToast());
    act(() => result.current.push('Event published'));
    act(() => vi.advanceTimersByTime(2199));
    expect(result.current.toast).not.toBeNull();
    act(() => vi.advanceTimersByTime(1));
    expect(result.current.toast).toBeNull();
  });

  it('replaces an in-flight toast and restarts the dismiss timer', () => {
    const { result } = renderHook(() => useToast());
    act(() => result.current.push('First'));
    act(() => vi.advanceTimersByTime(1000));
    act(() => result.current.push('Second'));
    expect(result.current.toast?.text).toBe('Second');

    act(() => vi.advanceTimersByTime(1999));
    expect(result.current.toast?.text).toBe('Second');

    act(() => vi.advanceTimersByTime(201));
    expect(result.current.toast).toBeNull();
  });
});
