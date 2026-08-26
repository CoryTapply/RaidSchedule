import { act, fireEvent, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { dateKey, lockoutStart, startOfWeekSunday, type RaidEvent } from '@raidschedule/shared';
import { createCustomEvent, deleteCustomEvent, updateCustomEvent, updateRaidHelperEventOverride } from '../api/eventsClient.js';
import { useCalendarState } from './useCalendarState.js';

vi.mock('../api/eventsClient.js', () => ({
  createCustomEvent: vi.fn(),
  updateCustomEvent: vi.fn(),
  deleteCustomEvent: vi.fn(),
  updateRaidHelperEventOverride: vi.fn(),
}));

const mockCreateCustomEvent = vi.mocked(createCustomEvent);
const mockUpdateCustomEvent = vi.mocked(updateCustomEvent);
const mockDeleteCustomEvent = vi.mocked(deleteCustomEvent);
const mockUpdateRaidHelperEventOverride = vi.mocked(updateRaidHelperEventOverride);

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
  mockUpdateCustomEvent.mockReset();
  mockUpdateCustomEvent.mockImplementation(async (id, patch) => ({
    id,
    source: 'custom',
    raidName: 'Test Raid',
    startsAt: new Date().toISOString(),
    status: 'confirmed',
    character: { name: 'Thrashclaw', className: 'Druid' },
    isHorde: false,
    ...patch,
  }) as RaidEvent);
  mockDeleteCustomEvent.mockReset();
  mockDeleteCustomEvent.mockResolvedValue(undefined);
  mockUpdateRaidHelperEventOverride.mockReset();
  mockUpdateRaidHelperEventOverride.mockImplementation(async (_eventId, patch) => patch);
});

afterEach(() => {
  vi.useRealTimers();
});

describe('useCalendarState', () => {
  it('starts anchored to the Tuesday of the current lockout week (Lockout is the default view)', () => {
    const { result } = renderHook(() => useCalendarState([]));
    expect(result.current.viewMode).toBe('lockout');
    expect(result.current.anchor.getTime()).toBe(lockoutStart(TODAY).getTime());
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

  it('goToday resets the anchor to the current lockout week regardless of navigation', () => {
    const { result } = renderHook(() => useCalendarState([]));
    act(() => result.current.goNext());
    act(() => result.current.goNext());
    act(() => result.current.goToday());
    expect(result.current.anchor.getTime()).toBe(lockoutStart(TODAY).getTime());
  });

  it('setViewMode switches between Week and Lockout, re-aligning the anchor to the new mode', () => {
    const { result } = renderHook(() => useCalendarState([]));
    expect(result.current.viewMode).toBe('lockout');
    expect(result.current.anchor.getTime()).toBe(lockoutStart(TODAY).getTime());

    act(() => result.current.setViewMode('week'));
    expect(result.current.viewMode).toBe('week');
    expect(result.current.anchor.getTime()).toBe(startOfWeekSunday(lockoutStart(TODAY)).getTime());

    act(() => result.current.setViewMode('lockout'));
    expect(result.current.viewMode).toBe('lockout');
    expect(result.current.anchor.getTime()).toBe(lockoutStart(startOfWeekSunday(lockoutStart(TODAY))).getTime());
  });

  it('goToday re-aligns to the current mode after switching view modes', () => {
    const { result } = renderHook(() => useCalendarState([]));
    act(() => result.current.setViewMode('week'));
    act(() => result.current.goNext());
    act(() => result.current.goToday());
    expect(result.current.anchor.getTime()).toBe(startOfWeekSunday(TODAY).getTime());
  });

  it('shows Raid-Helper events by default; a per-event hidden flag hides just that one until revealed via showHiddenEvents', () => {
    const visibleRaidHelperEvent: RaidEvent = {
      id: 'raid-helper:evt1:1',
      raidHelperEventId: 'evt1',
      source: 'raid-helper',
      raidName: 'Test Raid',
      startsAt: TODAY.toISOString(),
      status: 'confirmed',
      character: { name: 'Thrashclaw', className: 'Druid' },
      isHorde: false,
    };
    const hiddenRaidHelperEvent: RaidEvent = {
      id: 'raid-helper:evt2:1',
      raidHelperEventId: 'evt2',
      source: 'raid-helper',
      raidName: 'Old Raid',
      startsAt: TODAY.toISOString(),
      status: 'confirmed',
      character: { name: 'Ironhide', className: 'Warrior' },
      isHorde: false,
      hidden: true,
    };

    const { result } = renderHook(() => useCalendarState([visibleRaidHelperEvent, hiddenRaidHelperEvent]));
    expect(result.current.showHiddenEvents).toBe(false);
    const idsBefore = result.current.days.flatMap((d) => d.events).map((e) => e.id);
    expect(idsBefore).toContain('raid-helper:evt1:1');
    expect(idsBefore).not.toContain('raid-helper:evt2:1');

    act(() => result.current.toggleShowHiddenEvents());
    expect(result.current.showHiddenEvents).toBe(true);
    const idsAfter = result.current.days.flatMap((d) => d.events).map((e) => e.id);
    expect(idsAfter).toContain('raid-helper:evt1:1');
    expect(idsAfter).toContain('raid-helper:evt2:1');
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
    const anchor = lockoutStart(TODAY);
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

  describe('composer: new event', () => {
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
      expect(result.current.composer).toMatchObject({
        mode: 'create',
        key: day.key,
        x: 100,
        y: 100,
        title: '',
        start: '20:00',
        end: '23:00',
        character: '',
        cls: 'Druid',
        status: 'confirmed',
      });
      expect(result.current.selectedEvent).toBeNull();
    });

    it('clamps position near the viewport edges', () => {
      const { result } = renderHook(() => useCalendarState([]));
      const day = result.current.days[0]!;

      act(() => result.current.openComposer(day, { clientX: window.innerWidth, clientY: window.innerHeight }));
      expect(result.current.composer!.x).toBe(window.innerWidth - 348);
      expect(result.current.composer!.y).toBe(window.innerHeight);

      act(() => result.current.openComposer(day, { clientX: -100, clientY: -100 }));
      expect(result.current.composer!.x).toBe(8);
      expect(result.current.composer!.y).toBe(12);
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

    it('saveComposer sends the pending status when Signed up is selected', async () => {
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

  describe('openEditor', () => {
    it('prefills the composer from a custom event, in edit-custom mode', () => {
      const customEvent: RaidEvent = {
        id: 'custom:evt-1',
        source: 'custom',
        raidName: 'Test Raid',
        startsAt: '2026-08-18T20:00:00.000Z',
        endsAt: '2026-08-18T23:00:00.000Z',
        status: 'pending',
        character: { name: 'Thrashclaw', className: 'Druid' },
        isHorde: true,
      };
      const { result } = renderHook(() => useCalendarState([customEvent]));

      act(() => result.current.openEditor(customEvent, { clientX: 50, clientY: 50 }));
      expect(result.current.composer).toMatchObject({
        mode: 'edit-custom',
        id: 'custom:evt-1',
        title: 'Test Raid',
        character: 'Thrashclaw',
        cls: 'Druid',
        status: 'pending',
        isHorde: true,
      });
    });

    it('prefills the composer from a raid-helper event, in edit-raid-helper mode, with a read-only time label', () => {
      const raidHelperEvent: RaidEvent = {
        id: 'raid-helper:evt1:1',
        raidHelperEventId: 'evt1',
        source: 'raid-helper',
        raidName: 'Nerub-ar Palace',
        startsAt: '2026-08-18T20:00:00.000Z',
        endsAt: '2026-08-18T23:00:00.000Z',
        status: 'confirmed',
        character: { name: 'Thrashclaw', className: 'Druid' },
        isHorde: false,
      };
      const { result } = renderHook(() => useCalendarState([raidHelperEvent]));

      act(() => result.current.openEditor(raidHelperEvent, { clientX: 50, clientY: 50 }));
      expect(result.current.composer).toMatchObject({ mode: 'edit-raid-helper', id: 'raid-helper:evt1:1' });
      expect(result.current.composer!.timeLabel.length).toBeGreaterThan(0);
    });

    it('clears any open detail dialog', () => {
      const customEvent: RaidEvent = {
        id: 'custom:evt-1',
        source: 'custom',
        raidName: 'Test Raid',
        startsAt: new Date().toISOString(),
        status: 'confirmed',
        character: { name: 'Thrashclaw', className: 'Druid' },
      };
      const { result } = renderHook(() => useCalendarState([customEvent]));

      act(() => result.current.selectEvent(customEvent));
      act(() => result.current.openEditor(customEvent, { clientX: 50, clientY: 50 }));
      expect(result.current.selectedEvent).toBeNull();
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

    it('saves the full patch and reflects it on the calendar, even though the event came from the initial events prop', async () => {
      const { result } = renderHook(() => useCalendarState([customEvent]));

      act(() => result.current.openEditor(customEvent, { clientX: 10, clientY: 10 }));
      act(() => result.current.updateComposer({ title: 'Renamed Raid', character: 'Windrunner', cls: 'Hunter', isHorde: true }));
      await act(async () => result.current.saveComposer());

      expect(mockUpdateCustomEvent).toHaveBeenCalledWith(
        'custom:evt-1',
        expect.objectContaining({
          raidName: 'Renamed Raid',
          character: { name: 'Windrunner', className: 'Hunter' },
          isHorde: true,
        }),
      );
      expect(result.current.composer).toBeNull();

      const events = result.current.days.flatMap((d) => d.events);
      const updated = events.find((e) => e.id === 'custom:evt-1');
      expect(updated).toMatchObject({ raidName: 'Renamed Raid', character: { name: 'Windrunner', className: 'Hunter' } });
      // No duplicate: the edited copy replaces the original from the events prop, doesn't sit alongside it.
      expect(events.filter((e) => e.id === 'custom:evt-1')).toHaveLength(1);
    });

    it('surfaces an error and keeps the composer open when the request fails', async () => {
      mockUpdateCustomEvent.mockRejectedValueOnce(new Error('Failed to save event (500)'));
      const { result } = renderHook(() => useCalendarState([customEvent]));

      act(() => result.current.openEditor(customEvent, { clientX: 10, clientY: 10 }));
      await act(async () => result.current.saveComposer());

      expect(result.current.composer).not.toBeNull();
      expect(result.current.composer!.saving).toBe(false);
      expect(result.current.composer!.saveError).toBe('Failed to save event (500)');
    });

    it('deleteComposerEvent deletes the event and closes the composer', async () => {
      const { result } = renderHook(() => useCalendarState([customEvent]));

      act(() => result.current.openEditor(customEvent, { clientX: 10, clientY: 10 }));
      await act(async () => result.current.deleteComposerEvent());

      expect(mockDeleteCustomEvent).toHaveBeenCalledWith('custom:evt-1');
      expect(result.current.composer).toBeNull();
      const events = result.current.days.flatMap((d) => d.events);
      expect(events.find((e) => e.id === 'custom:evt-1')).toBeUndefined();
    });

    it('deleteComposerEvent surfaces an error and keeps the composer open when the request fails', async () => {
      mockDeleteCustomEvent.mockRejectedValueOnce(new Error('Failed to delete event (500)'));
      const { result } = renderHook(() => useCalendarState([customEvent]));

      act(() => result.current.openEditor(customEvent, { clientX: 10, clientY: 10 }));
      await act(async () => result.current.deleteComposerEvent());

      expect(result.current.composer).not.toBeNull();
      expect(result.current.composer!.saving).toBe(false);
      expect(result.current.composer!.saveError).toBe('Failed to delete event (500)');
    });

    it('deleteComposerEvent is a no-op outside edit-custom mode', async () => {
      const { result } = renderHook(() => useCalendarState([]));
      const day = result.current.days[0]!;
      act(() => result.current.openComposer(day, { clientX: 10, clientY: 10 }));

      await act(async () => result.current.deleteComposerEvent());

      expect(mockDeleteCustomEvent).not.toHaveBeenCalled();
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

    it('saves identity fields scoped to the one sign-up, and Horde scoped to the whole raid', async () => {
      const { result } = renderHook(() => useCalendarState([raidHelperEvent, otherSignUpSameRaid]));

      act(() => result.current.openEditor(raidHelperEvent, { clientX: 10, clientY: 10 }));
      act(() => result.current.updateComposer({ title: 'Renamed Raid', character: 'Renamed', cls: 'Mage', status: 'pending', isHorde: true }));
      await act(async () => result.current.saveComposer());

      expect(mockUpdateRaidHelperEventOverride).toHaveBeenCalledWith(
        'raid-helper:evt1:1',
        expect.objectContaining({
          raidName: 'Renamed Raid',
          character: { name: 'Renamed', className: 'Mage' },
          status: 'pending',
          isHorde: true,
        }),
      );
      expect(result.current.composer).toBeNull();

      const events = result.current.days.flatMap((d) => d.events);
      const edited = events.find((e) => e.id === 'raid-helper:evt1:1')!;
      expect(edited).toMatchObject({ raidName: 'Renamed Raid', character: { name: 'Renamed', className: 'Mage' }, status: 'pending', isHorde: true });
      // isHorde applies to every sign-up on the raid; the identity edit does not.
      const other = events.find((e) => e.id === 'raid-helper:evt1:2')!;
      expect(other).toMatchObject({ character: { name: 'Ironhide', className: 'Warrior' }, isHorde: true });
    });

    it('marking a sign-up Hidden removes it from view, and it reappears when showHiddenEvents is toggled on', async () => {
      const { result } = renderHook(() => useCalendarState([raidHelperEvent, otherSignUpSameRaid]));

      act(() => result.current.openEditor(raidHelperEvent, { clientX: 10, clientY: 10 }));
      act(() => result.current.updateComposer({ hidden: true }));
      await act(async () => result.current.saveComposer());

      expect(mockUpdateRaidHelperEventOverride).toHaveBeenCalledWith('raid-helper:evt1:1', expect.objectContaining({ hidden: true }));

      const idsAfterHide = result.current.days.flatMap((d) => d.events).map((e) => e.id);
      expect(idsAfterHide).not.toContain('raid-helper:evt1:1');
      // Hiding one sign-up doesn't affect the other sign-up on the same raid.
      expect(idsAfterHide).toContain('raid-helper:evt1:2');

      act(() => result.current.toggleShowHiddenEvents());
      const idsShown = result.current.days.flatMap((d) => d.events).map((e) => e.id);
      expect(idsShown).toContain('raid-helper:evt1:1');
    });

    it('does not offer a Start/End edit — the schedule stays whatever came from raid-helper', () => {
      const { result } = renderHook(() => useCalendarState([raidHelperEvent]));
      act(() => result.current.openEditor(raidHelperEvent, { clientX: 10, clientY: 10 }));
      expect(result.current.composer!.mode).toBe('edit-raid-helper');
    });

    it('surfaces an error and keeps the composer open when the request fails', async () => {
      mockUpdateRaidHelperEventOverride.mockRejectedValueOnce(new Error('Failed to save event (500)'));
      const { result } = renderHook(() => useCalendarState([raidHelperEvent]));

      act(() => result.current.openEditor(raidHelperEvent, { clientX: 10, clientY: 10 }));
      await act(async () => result.current.saveComposer());

      expect(result.current.composer).not.toBeNull();
      expect(result.current.composer!.saving).toBe(false);
      expect(result.current.composer!.saveError).toBe('Failed to save event (500)');
    });
  });
});
