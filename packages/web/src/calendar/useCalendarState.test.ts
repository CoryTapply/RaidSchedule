import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { dateKey, startOfWeekSunday } from '@raidschedule/shared';
import { useCalendarState } from './useCalendarState.js';

// Wednesday, August 19, 2026 — a known "today" so lockout-week fallback is deterministic.
const TODAY = new Date(2026, 7, 19);

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(TODAY);
});

afterEach(() => {
  vi.useRealTimers();
});

describe('useCalendarState', () => {
  it('starts anchored to the Sunday of the current week', () => {
    const { result } = renderHook(() => useCalendarState([]));
    expect(result.current.anchor.getTime()).toBe(startOfWeekSunday(TODAY).getTime());
  });

  it('goPrev/goNext shift the anchor by exactly 7 days', () => {
    const { result } = renderHook(() => useCalendarState([]));
    const initialAnchor = result.current.anchor;

    act(() => result.current.goNext());
    expect(result.current.anchor.getTime()).toBe(initialAnchor.getTime() + 7 * 86_400_000);

    act(() => result.current.goPrev());
    act(() => result.current.goPrev());
    expect(result.current.anchor.getTime()).toBe(initialAnchor.getTime() - 7 * 86_400_000);
  });

  it('goToday resets the anchor to the current week regardless of navigation', () => {
    const { result } = renderHook(() => useCalendarState([]));
    act(() => result.current.goNext());
    act(() => result.current.goNext());
    act(() => result.current.goToday());
    expect(result.current.anchor.getTime()).toBe(startOfWeekSunday(TODAY).getTime());
  });

  it('produces 21 days starting at the anchor', () => {
    const { result } = renderHook(() => useCalendarState([]));
    expect(result.current.days).toHaveLength(21);
    expect(result.current.days[0]!.key).toBe(dateKey(result.current.anchor));
  });

  it('highlights today\'s lockout week by default, spanning both grid rows it touches', () => {
    const { result } = renderHook(() => useCalendarState([]));
    const todayDay = result.current.days.find((d) => d.isToday);
    expect(todayDay).toBeDefined();

    const highlightedKeys = result.current.days.filter((d) => d.isHighlighted).map((d) => d.key);
    expect(highlightedKeys).toContain(todayDay!.key);
    // The lockout week (Tue-Mon) always spans exactly 7 days.
    const withinWindow = result.current.days.filter((d) => d.lockoutWeekKey === todayDay!.lockoutWeekKey);
    expect(withinWindow.every((d) => d.isHighlighted)).toBe(true);
  });

  it('hovering a different day highlights that day\'s lockout week instead, and clearing falls back to today', () => {
    const { result } = renderHook(() => useCalendarState([]));
    const otherWeekDay = result.current.days.find((d) => !d.isHighlighted);
    expect(otherWeekDay).toBeDefined();

    act(() => result.current.setHoverWeek(otherWeekDay!.lockoutWeekKey));
    const rerenderedOther = result.current.days.find((d) => d.key === otherWeekDay!.key)!;
    expect(rerenderedOther.isHighlighted).toBe(true);

    act(() => result.current.clearHoverWeek());
    const todayDay = result.current.days.find((d) => d.isToday)!;
    expect(todayDay.isHighlighted).toBe(true);
  });

  it('groups events by their start date', () => {
    const anchor = startOfWeekSunday(TODAY);
    const eventDate = new Date(anchor);
    eventDate.setDate(eventDate.getDate() + 2);
    eventDate.setHours(20, 0, 0, 0);

    const { result } = renderHook(() =>
      useCalendarState([
        {
          id: 'evt-1',
          source: 'custom',
          raidName: 'Test Raid',
          startsAt: eventDate.toISOString(),
          status: 'pending',
          character: { name: 'Thrashclaw', className: 'Druid' },
        },
      ]),
    );

    const day = result.current.days.find((d) => d.key === dateKey(eventDate));
    expect(day?.events).toHaveLength(1);
    expect(day?.events[0]?.raidName).toBe('Test Raid');
  });
});
