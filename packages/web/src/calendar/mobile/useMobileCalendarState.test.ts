import { act, fireEvent, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { dateKey, lockoutStart, type RaidEvent } from '@raidschedule/shared';
import { createCustomEvent, deleteCustomEvent, updateCustomEvent, updateRaidHelperEventOverride } from '../../api/eventsClient.js';
import { useMobileCalendarState } from './useMobileCalendarState.js';

vi.mock('../../api/eventsClient.js', () => ({
  createCustomEvent: vi.fn(),
  updateCustomEvent: vi.fn(),
  deleteCustomEvent: vi.fn(),
  updateRaidHelperEventOverride: vi.fn(),
}));

const mockCreateCustomEvent = vi.mocked(createCustomEvent);
const mockUpdateCustomEvent = vi.mocked(updateCustomEvent);
const mockDeleteCustomEvent = vi.mocked(deleteCustomEvent);
const mockUpdateRaidHelperEventOverride = vi.mocked(updateRaidHelperEventOverride);

// Wednesday, August 19, 2026 — a known "today" so the lockout anchor is deterministic.
const TODAY = new Date(2026, 7, 19);

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(TODAY);
  localStorage.clear();
  mockCreateCustomEvent.mockReset();
  mockCreateCustomEvent.mockImplementation(async (input) => ({ id: 'custom:server-id', source: 'custom', ...input }) as RaidEvent);
  mockUpdateCustomEvent.mockReset();
  mockUpdateCustomEvent.mockImplementation(
    async (id, patch) =>
      ({
        id,
        source: 'custom',
        raidName: 'Test Raid',
        startsAt: new Date().toISOString(),
        status: 'confirmed',
        character: { name: 'Thrashclaw', className: 'Druid' },
        isHorde: false,
        ...patch,
      }) as RaidEvent,
  );
  mockDeleteCustomEvent.mockReset();
  mockDeleteCustomEvent.mockResolvedValue(undefined);
  mockUpdateRaidHelperEventOverride.mockReset();
  mockUpdateRaidHelperEventOverride.mockImplementation(async (_eventId, patch) => patch);
});

afterEach(() => {
  vi.useRealTimers();
});

describe('useMobileCalendarState', () => {
  it('builds a spanDays-length window anchored at the current lockout start', () => {
    const { result } = renderHook(() => useMobileCalendarState([]));
    expect(result.current.days).toHaveLength(28);
    expect(result.current.days[0]!.key).toBe(dateKey(lockoutStart(TODAY)));
    expect(result.current.days[0]!.isFirstRow).toBe(true);
  });

  it('respects a custom spanDays', () => {
    const { result } = renderHook(() => useMobileCalendarState([], 10));
    expect(result.current.days).toHaveLength(10);
  });

  it('flags today and exposes a matching todayKey', () => {
    const { result } = renderHook(() => useMobileCalendarState([]));
    const todayDay = result.current.days.find((d) => d.isToday);
    expect(todayDay).toBeDefined();
    expect(todayDay!.key).toBe(result.current.todayKey);
  });

  it('groups events by their start date', () => {
    const anchor = lockoutStart(TODAY);
    const eventDate = new Date(anchor);
    eventDate.setDate(eventDate.getDate() + 2);
    eventDate.setHours(20, 0, 0, 0);

    const { result } = renderHook(() =>
      useMobileCalendarState([
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

  it('always filters out hidden events — there is no mobile toggle to reveal them', () => {
    const hidden: RaidEvent = {
      id: 'raid-helper:evt1:1',
      raidHelperEventId: 'evt1',
      source: 'raid-helper',
      raidName: 'Old Raid',
      startsAt: TODAY.toISOString(),
      status: 'confirmed',
      character: { name: 'Ironhide', className: 'Warrior' },
      isHorde: false,
      hidden: true,
    };
    const { result } = renderHook(() => useMobileCalendarState([hidden]));
    expect(result.current.days.flatMap((d) => d.events)).toHaveLength(0);
  });

  describe('composer: create', () => {
    it('opens with defaults for the given day, clearing any open detail sheet', () => {
      const { result } = renderHook(() => useMobileCalendarState([]));
      const day = result.current.days[3]!;
      const event: RaidEvent = {
        id: 'evt-1',
        source: 'custom',
        raidName: 'Test Raid',
        startsAt: new Date().toISOString(),
        status: 'confirmed',
        character: { name: 'Thrashclaw', className: 'Druid' },
      };

      act(() => result.current.selectEvent(event));
      expect(result.current.selectedEvent).not.toBeNull();

      act(() => result.current.openComposer(day));
      expect(result.current.composer).toMatchObject({
        mode: 'create',
        key: day.key,
        title: '',
        start: '20:00',
        end: '23:00',
        cls: 'Druid',
        status: 'confirmed',
      });
      expect(result.current.selectedEvent).toBeNull();
    });

    it('is a no-op with an empty or whitespace-only title', async () => {
      const { result } = renderHook(() => useMobileCalendarState([]));
      const day = result.current.days[0]!;

      act(() => result.current.openComposer(day));
      act(() => result.current.updateComposer({ title: '   ' }));
      let saveResult;
      await act(async () => {
        saveResult = await result.current.saveComposer();
      });

      expect(mockCreateCustomEvent).not.toHaveBeenCalled();
      expect(saveResult).toBeUndefined();
      expect(result.current.composer).not.toBeNull();
    });

    it('saves a confirmed custom event, closes the composer, and reports the affected day + a toast message', async () => {
      const { result } = renderHook(() => useMobileCalendarState([]));
      const day = result.current.days[3]!;

      act(() => result.current.openComposer(day));
      act(() => result.current.updateComposer({ title: 'Nerub-ar Palace', cls: 'Mage' }));

      let saveResult;
      await act(async () => {
        saveResult = await result.current.saveComposer();
      });

      expect(mockCreateCustomEvent).toHaveBeenCalledWith(
        expect.objectContaining({ raidName: 'Nerub-ar Palace', status: 'confirmed', character: { name: '—', className: 'Mage' } }),
      );
      expect(result.current.composer).toBeNull();
      expect(saveResult).toEqual({ dayKey: day.key, message: 'Event published' });
      const savedDay = result.current.days.find((d) => d.key === day.key)!;
      expect(savedDay.events).toHaveLength(1);
    });

    it('surfaces an error and keeps the composer open when the request fails', async () => {
      mockCreateCustomEvent.mockRejectedValueOnce(new Error('Failed to create event (500)'));
      const { result } = renderHook(() => useMobileCalendarState([]));
      const day = result.current.days[0]!;

      act(() => result.current.openComposer(day));
      act(() => result.current.updateComposer({ title: 'Nerub-ar Palace' }));
      let saveResult;
      await act(async () => {
        saveResult = await result.current.saveComposer();
      });

      expect(saveResult).toBeUndefined();
      expect(result.current.composer).not.toBeNull();
      expect(result.current.composer!.saving).toBe(false);
      expect(result.current.composer!.saveError).toBe('Failed to create event (500)');
    });

    it('Escape closes the composer when open, otherwise the detail sheet', () => {
      const { result } = renderHook(() => useMobileCalendarState([]));
      const day = result.current.days[0]!;

      act(() => result.current.openComposer(day));
      act(() => fireEvent.keyDown(window, { key: 'Escape' }));
      expect(result.current.composer).toBeNull();

      act(() =>
        result.current.selectEvent({
          id: 'evt-1',
          source: 'custom',
          raidName: 'Test Raid',
          startsAt: new Date().toISOString(),
          status: 'confirmed',
          character: { name: 'Thrashclaw', className: 'Druid' },
        }),
      );
      act(() => fireEvent.keyDown(window, { key: 'Escape' }));
      expect(result.current.selectedEvent).toBeNull();
    });
  });

  describe('setComposerStart', () => {
    it('carries End along by the current duration', () => {
      const { result } = renderHook(() => useMobileCalendarState([]));
      act(() => result.current.openComposer(result.current.days[0]!));
      expect(result.current.composer).toMatchObject({ start: '20:00', end: '23:00' });

      act(() => result.current.setComposerStart('21:00'));
      expect(result.current.composer).toMatchObject({ start: '21:00', end: '23:59' });
    });
  });

  describe('composer: edit-custom', () => {
    const customEvent: RaidEvent = {
      id: 'custom:evt-1',
      source: 'custom',
      raidName: 'Test Raid',
      startsAt: '2026-08-18T20:00:00.000Z',
      endsAt: '2026-08-18T23:00:00.000Z',
      status: 'pending',
      character: { name: 'Thrashclaw', className: 'Druid' },
      isHorde: false,
    };

    it('prefills from the event and saves the full patch without duplicating it', async () => {
      const { result } = renderHook(() => useMobileCalendarState([customEvent]));

      act(() => result.current.openEditor(customEvent));
      expect(result.current.composer).toMatchObject({ mode: 'edit-custom', id: 'custom:evt-1', title: 'Test Raid' });
      const expectedDayKey = result.current.composer!.key;

      act(() => result.current.updateComposer({ title: 'Renamed Raid', character: 'Windrunner', cls: 'Hunter' }));
      let saveResult;
      await act(async () => {
        saveResult = await result.current.saveComposer();
      });

      expect(mockUpdateCustomEvent).toHaveBeenCalledWith(
        'custom:evt-1',
        expect.objectContaining({ raidName: 'Renamed Raid', character: { name: 'Windrunner', className: 'Hunter' } }),
      );
      expect(saveResult).toEqual({ dayKey: expectedDayKey, message: 'Event updated' });
      const events = result.current.days.flatMap((d) => d.events);
      expect(events.filter((e) => e.id === 'custom:evt-1')).toHaveLength(1);
      expect(events.find((e) => e.id === 'custom:evt-1')).toMatchObject({ raidName: 'Renamed Raid' });
    });

    it('deleteComposerEvent deletes the event, closes the composer, and reports a toast message', async () => {
      const { result } = renderHook(() => useMobileCalendarState([customEvent]));
      act(() => result.current.openEditor(customEvent));

      let deleteResult;
      await act(async () => {
        deleteResult = await result.current.deleteComposerEvent();
      });

      expect(mockDeleteCustomEvent).toHaveBeenCalledWith('custom:evt-1');
      expect(result.current.composer).toBeNull();
      expect(deleteResult).toMatchObject({ message: 'Event deleted' });
      expect(result.current.days.flatMap((d) => d.events).find((e) => e.id === 'custom:evt-1')).toBeUndefined();
    });

    it('deleteComposerEvent is a no-op outside edit-custom mode', async () => {
      const { result } = renderHook(() => useMobileCalendarState([]));
      act(() => result.current.openComposer(result.current.days[0]!));

      let deleteResult;
      await act(async () => {
        deleteResult = await result.current.deleteComposerEvent();
      });

      expect(mockDeleteCustomEvent).not.toHaveBeenCalled();
      expect(deleteResult).toBeUndefined();
      expect(result.current.composer).not.toBeNull();
    });
  });

  describe('composer: edit-raid-helper', () => {
    const raidHelperEvent: RaidEvent = {
      id: 'raid-helper:evt1:1',
      raidHelperEventId: 'evt1',
      source: 'raid-helper',
      raidName: 'Test Raid',
      startsAt: '2026-08-18T20:00:00.000Z',
      endsAt: '2026-08-18T23:00:00.000Z',
      status: 'confirmed',
      character: { name: 'Thrashclaw', className: 'Druid' },
      isHorde: false,
    };
    const otherSignUpSameRaid: RaidEvent = {
      ...raidHelperEvent,
      id: 'raid-helper:evt1:2',
      character: { name: 'Ironhide', className: 'Warrior' },
    };

    it('prefills in edit-raid-helper mode with a precomputed time label', () => {
      const { result } = renderHook(() => useMobileCalendarState([raidHelperEvent]));
      act(() => result.current.openEditor(raidHelperEvent));
      expect(result.current.composer).toMatchObject({ mode: 'edit-raid-helper', id: 'raid-helper:evt1:1' });
      // Local-timezone-dependent, like desktop's equivalent test — just assert it's populated.
      expect(result.current.composer!.timeLabel).toContain(' – ');
    });

    it('saves identity fields scoped to the one sign-up, and Horde scoped to the whole raid', async () => {
      const { result } = renderHook(() => useMobileCalendarState([raidHelperEvent, otherSignUpSameRaid]));

      act(() => result.current.openEditor(raidHelperEvent));
      act(() => result.current.updateComposer({ title: 'Renamed Raid', character: 'Renamed', cls: 'Mage', status: 'pending', isHorde: true }));
      await act(async () => {
        await result.current.saveComposer();
      });

      expect(mockUpdateRaidHelperEventOverride).toHaveBeenCalledWith(
        'raid-helper:evt1:1',
        expect.objectContaining({ raidName: 'Renamed Raid', character: { name: 'Renamed', className: 'Mage' }, status: 'pending', isHorde: true }),
      );
      const events = result.current.days.flatMap((d) => d.events);
      expect(events.find((e) => e.id === 'raid-helper:evt1:1')).toMatchObject({ raidName: 'Renamed Raid', isHorde: true });
      expect(events.find((e) => e.id === 'raid-helper:evt1:2')).toMatchObject({ character: { name: 'Ironhide', className: 'Warrior' }, isHorde: true });
    });

    it('marking a sign-up Hidden removes it from view', async () => {
      const { result } = renderHook(() => useMobileCalendarState([raidHelperEvent, otherSignUpSameRaid]));
      act(() => result.current.openEditor(raidHelperEvent));
      act(() => result.current.updateComposer({ hidden: true }));
      await act(async () => {
        await result.current.saveComposer();
      });

      const ids = result.current.days.flatMap((d) => d.events).map((e) => e.id);
      expect(ids).not.toContain('raid-helper:evt1:1');
      expect(ids).toContain('raid-helper:evt1:2');
    });
  });
});
