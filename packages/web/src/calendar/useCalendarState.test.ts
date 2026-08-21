import { act, fireEvent, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { dateKey, startOfWeekSunday, type RaidEvent } from '@raidschedule/shared';
import { confirmCustomEvent, createCustomEvent, deleteCustomEvent } from '../api/eventsClient.js';
import { useCalendarState } from './useCalendarState.js';

vi.mock('../api/eventsClient.js', () => ({
  createCustomEvent: vi.fn(),
  deleteCustomEvent: vi.fn(),
  confirmCustomEvent: vi.fn(),
}));

const mockCreateCustomEvent = vi.mocked(createCustomEvent);
const mockDeleteCustomEvent = vi.mocked(deleteCustomEvent);
const mockConfirmCustomEvent = vi.mocked(confirmCustomEvent);

// Wednesday, August 19, 2026 — a known "today" so lockout-week fallback is deterministic.
const TODAY = new Date(2026, 7, 19);

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(TODAY);
  localStorage.clear();
  mockCreateCustomEvent.mockReset();
  mockCreateCustomEvent.mockImplementation(async (input) => ({
    id: 'custom:server-id',
    source: 'custom',
    ...input,
  }) as RaidEvent);
  mockDeleteCustomEvent.mockReset();
  mockDeleteCustomEvent.mockResolvedValue(undefined);
  mockConfirmCustomEvent.mockReset();
  mockConfirmCustomEvent.mockImplementation(async (id) => ({
    id,
    source: 'custom',
    raidName: 'Test Raid',
    startsAt: new Date().toISOString(),
    status: 'confirmed',
    character: { name: 'Thrashclaw', className: 'Druid' },
  }) as RaidEvent);
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
      expect(result.current.composer).toMatchObject({ key: day.key, x: 100, y: 100, title: '', start: '20:00', end: '23:00', character: '', cls: 'Druid', status: 'confirmed' });
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

    it('saveComposer is a no-op with an empty or whitespace-only title', async () => {
      const { result } = renderHook(() => useCalendarState([]));
      const day = result.current.days[0]!;

      act(() => result.current.openComposer(day, { clientX: 10, clientY: 10 }));
      act(() => result.current.updateComposer({ title: '   ' }));
      await act(async () => result.current.saveComposer());

      expect(mockCreateCustomEvent).not.toHaveBeenCalled();
      expect(result.current.composer).not.toBeNull();
      expect(result.current.days.find((d) => d.key === day.key)?.events).toHaveLength(0);
    });

    it('saveComposer appends a confirmed custom event to the clicked day and closes the composer', async () => {
      const { result } = renderHook(() => useCalendarState([]));
      const day = result.current.days[3]!;

      act(() => result.current.openComposer(day, { clientX: 10, clientY: 10 }));
      act(() => result.current.updateComposer({ title: 'Nerub-ar Palace', cls: 'Mage' }));
      await act(async () => result.current.saveComposer());

      expect(mockCreateCustomEvent).toHaveBeenCalledWith(
        expect.objectContaining({ raidName: 'Nerub-ar Palace', status: 'confirmed', character: { name: '—', className: 'Mage' } }),
      );
      expect(result.current.composer).toBeNull();
      const savedDay = result.current.days.find((d) => d.key === day.key)!;
      expect(savedDay.events).toHaveLength(1);
      expect(savedDay.events[0]).toMatchObject({
        id: 'custom:server-id',
        source: 'custom',
        raidName: 'Nerub-ar Palace',
        status: 'confirmed',
        character: { name: '—', className: 'Mage' },
      });
    });

    it('saveComposer sends the pending status when Tentative is selected', async () => {
      const { result } = renderHook(() => useCalendarState([]));
      const day = result.current.days[3]!;

      act(() => result.current.openComposer(day, { clientX: 10, clientY: 10 }));
      act(() => result.current.updateComposer({ title: 'Nerub-ar Palace', status: 'pending' }));
      await act(async () => result.current.saveComposer());

      expect(mockCreateCustomEvent).toHaveBeenCalledWith(expect.objectContaining({ status: 'pending' }));
      const savedDay = result.current.days.find((d) => d.key === day.key)!;
      expect(savedDay.events[0]).toMatchObject({ status: 'pending' });
    });

    it('defaults an empty character name to an em dash', async () => {
      const { result } = renderHook(() => useCalendarState([]));
      const day = result.current.days[0]!;

      act(() => result.current.openComposer(day, { clientX: 10, clientY: 10 }));
      act(() => result.current.updateComposer({ title: 'Test Raid', character: '  ' }));
      await act(async () => result.current.saveComposer());

      const savedDay = result.current.days.find((d) => d.key === day.key)!;
      expect(savedDay.events[0]?.character.name).toBe('—');
    });

    it('saveComposer keeps the composer open and surfaces an error when the request fails', async () => {
      mockCreateCustomEvent.mockRejectedValueOnce(new Error('Failed to create event (500)'));
      const { result } = renderHook(() => useCalendarState([]));
      const day = result.current.days[0]!;

      act(() => result.current.openComposer(day, { clientX: 10, clientY: 10 }));
      act(() => result.current.updateComposer({ title: 'Nerub-ar Palace' }));
      await act(async () => result.current.saveComposer());

      expect(result.current.composer).not.toBeNull();
      expect(result.current.composer!.saving).toBe(false);
      expect(result.current.composer!.saveError).toBe('Failed to create event (500)');
      expect(result.current.days.find((d) => d.key === day.key)?.events).toHaveLength(0);
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

  describe('delete', () => {
    const customEvent: RaidEvent = {
      id: 'custom:evt-1',
      source: 'custom',
      raidName: 'Test Raid',
      startsAt: new Date().toISOString(),
      status: 'confirmed',
      character: { name: 'Thrashclaw', className: 'Druid' },
    };

    it('deletes the selected custom event and closes the dialog', async () => {
      const { result } = renderHook(() => useCalendarState([customEvent]));
      const day = result.current.days.find((d) => d.events.some((e) => e.id === customEvent.id))!;
      expect(day.events).toHaveLength(1);

      act(() => result.current.selectEvent(customEvent));
      await act(async () => result.current.deleteSelectedEvent());

      expect(mockDeleteCustomEvent).toHaveBeenCalledWith(customEvent.id);
      expect(result.current.selectedEvent).toBeNull();
    });

    it('removes a deleted event from the calendar even when it came from the initial events prop, without a reload', async () => {
      const { result } = renderHook(() => useCalendarState([customEvent]));
      const dayKey = result.current.days.find((d) => d.events.some((e) => e.id === customEvent.id))!.key;

      act(() => result.current.selectEvent(customEvent));
      await act(async () => result.current.deleteSelectedEvent());

      const day = result.current.days.find((d) => d.key === dayKey)!;
      expect(day.events).toHaveLength(0);
    });

    it('is a no-op for a raid-helper event', async () => {
      const raidHelperEvent: RaidEvent = { ...customEvent, id: 'raid-helper:1:1', source: 'raid-helper' };
      const { result } = renderHook(() => useCalendarState([]));

      act(() => result.current.selectEvent(raidHelperEvent));
      await act(async () => result.current.deleteSelectedEvent());

      expect(mockDeleteCustomEvent).not.toHaveBeenCalled();
      expect(result.current.selectedEvent).not.toBeNull();
    });

    it('surfaces an error and keeps the dialog open when the request fails', async () => {
      mockDeleteCustomEvent.mockRejectedValueOnce(new Error('Failed to delete event (500)'));
      const { result } = renderHook(() => useCalendarState([customEvent]));

      act(() => result.current.selectEvent(customEvent));
      await act(async () => result.current.deleteSelectedEvent());

      expect(result.current.selectedEvent).not.toBeNull();
      expect(result.current.deletingEvent).toBe(false);
      expect(result.current.deleteError).toBe('Failed to delete event (500)');
    });

    it('clears a stale delete error when a different event is selected', async () => {
      mockDeleteCustomEvent.mockRejectedValueOnce(new Error('Failed to delete event (500)'));
      const { result } = renderHook(() => useCalendarState([customEvent]));

      act(() => result.current.selectEvent(customEvent));
      await act(async () => result.current.deleteSelectedEvent());
      expect(result.current.deleteError).not.toBeNull();

      act(() => result.current.selectEvent(customEvent));
      expect(result.current.deleteError).toBeNull();
    });
  });

  describe('confirm', () => {
    const pendingCustomEvent: RaidEvent = {
      id: 'custom:evt-1',
      source: 'custom',
      raidName: 'Test Raid',
      startsAt: new Date().toISOString(),
      status: 'pending',
      character: { name: 'Thrashclaw', className: 'Druid' },
    };

    it('confirms the selected pending custom event and keeps the dialog open with the updated status', async () => {
      const { result } = renderHook(() => useCalendarState([pendingCustomEvent]));

      act(() => result.current.selectEvent(pendingCustomEvent));
      await act(async () => result.current.confirmSelectedEvent());

      expect(mockConfirmCustomEvent).toHaveBeenCalledWith(pendingCustomEvent.id);
      expect(result.current.selectedEvent).toMatchObject({ id: pendingCustomEvent.id, status: 'confirmed' });
    });

    it('updates the event on the calendar even when it came from the initial events prop, without a reload', async () => {
      const { result } = renderHook(() => useCalendarState([pendingCustomEvent]));
      const dayKey = result.current.days.find((d) => d.events.some((e) => e.id === pendingCustomEvent.id))!.key;

      act(() => result.current.selectEvent(pendingCustomEvent));
      await act(async () => result.current.confirmSelectedEvent());

      const day = result.current.days.find((d) => d.key === dayKey)!;
      expect(day.events[0]).toMatchObject({ status: 'confirmed' });
    });

    it('is a no-op for an already-confirmed custom event', async () => {
      const confirmedEvent: RaidEvent = { ...pendingCustomEvent, status: 'confirmed' };
      const { result } = renderHook(() => useCalendarState([confirmedEvent]));

      act(() => result.current.selectEvent(confirmedEvent));
      await act(async () => result.current.confirmSelectedEvent());

      expect(mockConfirmCustomEvent).not.toHaveBeenCalled();
    });

    it('is a no-op for a raid-helper event', async () => {
      const raidHelperEvent: RaidEvent = { ...pendingCustomEvent, id: 'raid-helper:1:1', source: 'raid-helper' };
      const { result } = renderHook(() => useCalendarState([]));

      act(() => result.current.selectEvent(raidHelperEvent));
      await act(async () => result.current.confirmSelectedEvent());

      expect(mockConfirmCustomEvent).not.toHaveBeenCalled();
    });

    it('surfaces an error and keeps the dialog open when the request fails', async () => {
      mockConfirmCustomEvent.mockRejectedValueOnce(new Error('Failed to confirm event (500)'));
      const { result } = renderHook(() => useCalendarState([pendingCustomEvent]));

      act(() => result.current.selectEvent(pendingCustomEvent));
      await act(async () => result.current.confirmSelectedEvent());

      expect(result.current.selectedEvent).not.toBeNull();
      expect(result.current.confirmingEvent).toBe(false);
      expect(result.current.confirmError).toBe('Failed to confirm event (500)');
    });

    it('clears a stale confirm error when a different event is selected', async () => {
      mockConfirmCustomEvent.mockRejectedValueOnce(new Error('Failed to confirm event (500)'));
      const { result } = renderHook(() => useCalendarState([pendingCustomEvent]));

      act(() => result.current.selectEvent(pendingCustomEvent));
      await act(async () => result.current.confirmSelectedEvent());
      expect(result.current.confirmError).not.toBeNull();

      act(() => result.current.selectEvent(pendingCustomEvent));
      expect(result.current.confirmError).toBeNull();
    });
  });
});
