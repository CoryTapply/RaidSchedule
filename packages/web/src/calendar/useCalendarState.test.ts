import { act, fireEvent, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { dateKey, startOfWeekSunday } from '@raidschedule/shared';
import { useCalendarState } from './useCalendarState.js';

// Wednesday, August 19, 2026 — a known "today" so lockout-week fallback is deterministic.
const TODAY = new Date(2026, 7, 19);

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(TODAY);
  localStorage.clear();
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

  describe('composer', () => {
    it('opens with clamped position and clears any open detail dialog', () => {
      const { result } = renderHook(() => useCalendarState([]));
      const day = result.current.days[3]!;

      act(() => result.current.selectEvent({
        id: 'evt-1',
        source: 'custom',
        raidName: 'Test Raid',
        startsAt: new Date().toISOString(),
        status: 'confirmed',
        character: { name: 'Thrashclaw', className: 'Druid' },
      }));
      expect(result.current.selectedEvent).not.toBeNull();

      act(() => result.current.openComposer(day, { clientX: 100, clientY: 100 }));
      expect(result.current.composer).toMatchObject({ key: day.key, x: 100, y: 100, title: '', start: '20:00', end: '23:00', character: '', cls: 'Druid' });
      expect(result.current.selectedEvent).toBeNull();
    });

    it('clamps position near the viewport edges', () => {
      const { result } = renderHook(() => useCalendarState([]));
      const day = result.current.days[0]!;

      act(() => result.current.openComposer(day, { clientX: window.innerWidth, clientY: window.innerHeight }));
      expect(result.current.composer!.x).toBe(window.innerWidth - 320);
      expect(result.current.composer!.y).toBe(window.innerHeight - 500);

      act(() => result.current.openComposer(day, { clientX: -100, clientY: -100 }));
      expect(result.current.composer!.x).toBe(8);
      expect(result.current.composer!.y).toBe(8);
    });

    it('updateComposer patches fields, closeComposer clears it', () => {
      const { result } = renderHook(() => useCalendarState([]));
      const day = result.current.days[0]!;

      act(() => result.current.openComposer(day, { clientX: 10, clientY: 10 }));
      act(() => result.current.updateComposer({ title: 'Nerub-ar Palace', cls: 'Mage' }));
      expect(result.current.composer).toMatchObject({ title: 'Nerub-ar Palace', cls: 'Mage' });

      act(() => result.current.closeComposer());
      expect(result.current.composer).toBeNull();
    });

    it('remembers the last class picked and defaults future composers to it', () => {
      const { result } = renderHook(() => useCalendarState([]));
      const day = result.current.days[0]!;

      act(() => result.current.openComposer(day, { clientX: 10, clientY: 10 }));
      expect(result.current.composer!.cls).toBe('Druid');

      act(() => result.current.updateComposer({ cls: 'Shaman' }));
      act(() => result.current.closeComposer());

      act(() => result.current.openComposer(day, { clientX: 10, clientY: 10 }));
      expect(result.current.composer!.cls).toBe('Shaman');
    });

    it('saveComposer is a no-op with an empty or whitespace-only title', () => {
      const { result } = renderHook(() => useCalendarState([]));
      const day = result.current.days[0]!;

      act(() => result.current.openComposer(day, { clientX: 10, clientY: 10 }));
      act(() => result.current.updateComposer({ title: '   ' }));
      act(() => result.current.saveComposer());

      expect(result.current.composer).not.toBeNull();
      expect(result.current.days.find((d) => d.key === day.key)?.events).toHaveLength(0);
    });

    it('saveComposer appends a confirmed custom event to the clicked day and closes the composer', () => {
      const { result } = renderHook(() => useCalendarState([]));
      const day = result.current.days[3]!;

      act(() => result.current.openComposer(day, { clientX: 10, clientY: 10 }));
      act(() => result.current.updateComposer({ title: 'Nerub-ar Palace', cls: 'Mage' }));
      act(() => result.current.saveComposer());

      expect(result.current.composer).toBeNull();
      const savedDay = result.current.days.find((d) => d.key === day.key)!;
      expect(savedDay.events).toHaveLength(1);
      expect(savedDay.events[0]).toMatchObject({
        source: 'custom',
        raidName: 'Nerub-ar Palace',
        status: 'confirmed',
        character: { name: '—', className: 'Mage' },
      });
    });

    it('defaults an empty character name to an em dash', () => {
      const { result } = renderHook(() => useCalendarState([]));
      const day = result.current.days[0]!;

      act(() => result.current.openComposer(day, { clientX: 10, clientY: 10 }));
      act(() => result.current.updateComposer({ title: 'Test Raid', character: '  ' }));
      act(() => result.current.saveComposer());

      const savedDay = result.current.days.find((d) => d.key === day.key)!;
      expect(savedDay.events[0]?.character.name).toBe('—');
    });

    it('Escape closes the composer when it is open', () => {
      const { result } = renderHook(() => useCalendarState([]));
      const day = result.current.days[0]!;

      act(() => result.current.openComposer(day, { clientX: 10, clientY: 10 }));
      expect(result.current.composer).not.toBeNull();

      act(() => {
        fireEvent.keyDown(window, { key: 'Escape' });
      });
      expect(result.current.composer).toBeNull();
    });

    it('Escape closes the detail dialog when the composer is not open', () => {
      const { result } = renderHook(() => useCalendarState([]));

      act(() => result.current.selectEvent({
        id: 'evt-1',
        source: 'custom',
        raidName: 'Test Raid',
        startsAt: new Date().toISOString(),
        status: 'confirmed',
        character: { name: 'Thrashclaw', className: 'Druid' },
      }));
      expect(result.current.selectedEvent).not.toBeNull();

      act(() => {
        fireEvent.keyDown(window, { key: 'Escape' });
      });
      expect(result.current.selectedEvent).toBeNull();
    });
  });
});
