import { addDays, buildWindow, dateKey, groupEventsByDateKey, lockoutStart, startOfWeekSunday, type RaidEvent } from '@raidschedule/shared';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  confirmCustomEvent,
  createCustomEvent,
  deleteCustomEvent,
  setCustomEventFaction,
  setHordeTag,
} from '../api/eventsClient.js';
import { getStoredClass, localDateTimeToIso, setStoredClass, type ComposerState } from './composer.js';
import { composerDateLabel } from './format.js';

export interface CalendarDay {
  date: Date;
  key: string;
  isToday: boolean;
  isFirstOfMonth: boolean;
  isLockoutReset: boolean;
  isHighlighted: boolean;
  events: RaidEvent[];
  lockoutWeekKey: string;
}

export interface CalendarState {
  anchor: Date;
  rangeStart: Date;
  rangeEnd: Date;
  days: CalendarDay[];
  selectedEvent: RaidEvent | null;
  deletingEvent: boolean;
  deleteError: string | null;
  confirmingEvent: boolean;
  confirmError: string | null;
  togglingHorde: boolean;
  hordeError: string | null;
  composer: ComposerState | null;
  goPrev: () => void;
  goNext: () => void;
  goToday: () => void;
  selectEvent: (event: RaidEvent) => void;
  closeDialog: () => void;
  deleteSelectedEvent: () => void;
  confirmSelectedEvent: () => void;
  toggleHordeSelectedEvent: () => void;
  setHoverWeek: (key: string) => void;
  clearHoverWeek: () => void;
  openComposer: (day: CalendarDay, e: { clientX: number; clientY: number }) => void;
  updateComposer: (patch: Partial<ComposerState>) => void;
  closeComposer: () => void;
  saveComposer: () => void;
}

export function useCalendarState(events: RaidEvent[]): CalendarState {
  const [anchor, setAnchor] = useState(() => startOfWeekSunday(new Date()));
  const [selectedEvent, setSelectedEvent] = useState<RaidEvent | null>(null);
  const [hoverLockoutKey, setHoverLockoutKey] = useState<string | null>(null);
  const [composer, setComposer] = useState<ComposerState | null>(null);
  const [custom, setCustom] = useState<RaidEvent[]>([]);
  const [deletedIds, setDeletedIds] = useState<ReadonlySet<string>>(new Set());
  const [confirmedIds, setConfirmedIds] = useState<ReadonlySet<string>>(new Set());
  const [deletingEvent, setDeletingEvent] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [confirmingEvent, setConfirmingEvent] = useState(false);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [hordeOverrides, setHordeOverrides] = useState<ReadonlyMap<string, boolean>>(new Map());
  const [togglingHorde, setTogglingHorde] = useState(false);
  const [hordeError, setHordeError] = useState<string | null>(null);

  const goPrev = useCallback(() => setAnchor((d) => addDays(d, -7)), []);
  const goNext = useCallback(() => setAnchor((d) => addDays(d, 7)), []);
  const goToday = useCallback(() => setAnchor(startOfWeekSunday(new Date())), []);
  const selectEvent = useCallback((event: RaidEvent) => {
    setDeleteError(null);
    setConfirmError(null);
    setHordeError(null);
    setSelectedEvent(event);
  }, []);
  const closeDialog = useCallback(() => {
    setSelectedEvent(null);
    setDeleteError(null);
    setConfirmError(null);
    setHordeError(null);
  }, []);
  const setHoverWeek = useCallback((key: string) => setHoverLockoutKey(key), []);
  const clearHoverWeek = useCallback(() => setHoverLockoutKey(null), []);

  const deleteSelectedEvent = useCallback(() => {
    if (!selectedEvent || selectedEvent.source !== 'custom' || deletingEvent) return;
    const target = selectedEvent;
    setDeletingEvent(true);
    setDeleteError(null);
    void (async () => {
      try {
        await deleteCustomEvent(target.id);
        setCustom((prev) => prev.filter((e) => e.id !== target.id));
        setDeletedIds((prev) => new Set(prev).add(target.id));
        setSelectedEvent(null);
      } catch (err) {
        setDeleteError(err instanceof Error ? err.message : 'Failed to delete event');
      } finally {
        setDeletingEvent(false);
      }
    })();
  }, [selectedEvent, deletingEvent]);

  const confirmSelectedEvent = useCallback(() => {
    if (!selectedEvent || selectedEvent.source !== 'custom' || selectedEvent.status !== 'pending' || confirmingEvent) return;
    const target = selectedEvent;
    setConfirmingEvent(true);
    setConfirmError(null);
    void (async () => {
      try {
        const updated = await confirmCustomEvent(target.id);
        setCustom((prev) => prev.map((e) => (e.id === target.id ? updated : e)));
        setConfirmedIds((prev) => new Set(prev).add(target.id));
        setSelectedEvent(updated);
      } catch (err) {
        setConfirmError(err instanceof Error ? err.message : 'Failed to confirm event');
      } finally {
        setConfirmingEvent(false);
      }
    })();
  }, [selectedEvent, confirmingEvent]);

  const toggleHordeSelectedEvent = useCallback(() => {
    if (!selectedEvent || togglingHorde) return;
    const target = selectedEvent;
    const nextIsHorde = !target.isHorde;

    if (target.source === 'raid-helper' && target.raidHelperEventId) {
      const raidHelperEventId = target.raidHelperEventId;
      setTogglingHorde(true);
      setHordeError(null);
      void (async () => {
        try {
          await setHordeTag(raidHelperEventId, nextIsHorde);
          setHordeOverrides((prev) => new Map(prev).set(raidHelperEventId, nextIsHorde));
          setSelectedEvent((current) =>
            current && current.raidHelperEventId === raidHelperEventId ? { ...current, isHorde: nextIsHorde } : current,
          );
        } catch (err) {
          setHordeError(err instanceof Error ? err.message : 'Failed to update Horde tag');
        } finally {
          setTogglingHorde(false);
        }
      })();
      return;
    }

    if (target.source === 'custom') {
      const id = target.id;
      setTogglingHorde(true);
      setHordeError(null);
      void (async () => {
        try {
          await setCustomEventFaction(id, nextIsHorde);
          setHordeOverrides((prev) => new Map(prev).set(id, nextIsHorde));
          setSelectedEvent((current) => (current && current.id === id ? { ...current, isHorde: nextIsHorde } : current));
        } catch (err) {
          setHordeError(err instanceof Error ? err.message : 'Failed to update Horde tag');
        } finally {
          setTogglingHorde(false);
        }
      })();
    }
  }, [selectedEvent, togglingHorde]);

  const openComposer = useCallback((day: CalendarDay, e: { clientX: number; clientY: number }) => {
    setSelectedEvent(null);
    setDeleteError(null);
    setConfirmError(null);
    setHordeError(null);
    const x = Math.max(8, Math.min(e.clientX, window.innerWidth - 320));
    const y = Math.max(8, Math.min(e.clientY, window.innerHeight - 500));
    setComposer({
      key: day.key,
      dateLabel: composerDateLabel(day.date),
      x,
      y,
      title: '',
      start: '20:00',
      end: '23:00',
      character: '',
      cls: getStoredClass() ?? 'Druid',
      status: 'confirmed',
      isHorde: false,
      saving: false,
      saveError: null,
    });
  }, []);

  const updateComposer = useCallback((patch: Partial<ComposerState>) => {
    if (patch.cls) setStoredClass(patch.cls);
    setComposer((c) => (c ? { ...c, ...patch, saveError: patch.saveError !== undefined ? patch.saveError : null } : c));
  }, []);

  const closeComposer = useCallback(() => setComposer(null), []);

  const saveComposer = useCallback(async () => {
    if (!composer || !composer.title.trim() || composer.saving) return;
    setComposer((c) => (c ? { ...c, saving: true, saveError: null } : c));
    try {
      const event = await createCustomEvent({
        raidName: composer.title.trim(),
        startsAt: localDateTimeToIso(composer.key, composer.start),
        endsAt: localDateTimeToIso(composer.key, composer.end),
        status: composer.status,
        character: { name: composer.character.trim() || '—', className: composer.cls },
        isHorde: composer.isHorde,
      });
      setCustom((prev) => [...prev, event]);
      setComposer(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save event';
      setComposer((c) => (c ? { ...c, saving: false, saveError: message } : c));
    }
  }, [composer]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Escape') return;
      if (composer) setComposer(null);
      else if (selectedEvent) setSelectedEvent(null);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [composer, selectedEvent]);

  const days = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayKey = dateKey(today);
    const activeLockoutKey = hoverLockoutKey ?? dateKey(lockoutStart(today));
    const eventsByDay = groupEventsByDateKey(
      [...events, ...custom]
        .filter((e) => !deletedIds.has(e.id))
        .map((e) => (confirmedIds.has(e.id) ? { ...e, status: 'confirmed' as const } : e))
        .map((e) => {
          const overrideKey = e.raidHelperEventId ?? e.id;
          return hordeOverrides.has(overrideKey) ? { ...e, isHorde: hordeOverrides.get(overrideKey) } : e;
        }),
    );

    return buildWindow(anchor, 21).map((date): CalendarDay => {
      const key = dateKey(date);
      const lockoutWeekKey = dateKey(lockoutStart(date));
      return {
        date,
        key,
        isToday: key === todayKey,
        isFirstOfMonth: date.getDate() === 1,
        isLockoutReset: date.getDay() === 2,
        isHighlighted: lockoutWeekKey === activeLockoutKey,
        events: eventsByDay[key] ?? [],
        lockoutWeekKey,
      };
    });
  }, [anchor, events, custom, deletedIds, confirmedIds, hordeOverrides, hoverLockoutKey]);

  const rangeEnd = useMemo(() => addDays(anchor, 20), [anchor]);

  return {
    anchor,
    rangeStart: anchor,
    rangeEnd,
    days,
    selectedEvent,
    deletingEvent,
    deleteError,
    confirmingEvent,
    confirmError,
    togglingHorde,
    hordeError,
    composer,
    goPrev,
    goNext,
    goToday,
    selectEvent,
    closeDialog,
    deleteSelectedEvent,
    confirmSelectedEvent,
    toggleHordeSelectedEvent,
    setHoverWeek,
    clearHoverWeek,
    openComposer,
    updateComposer,
    closeComposer,
    saveComposer,
  };
}
