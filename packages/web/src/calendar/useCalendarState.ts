import { addDays, buildWindow, dateKey, groupEventsByDateKey, lockoutStart, startOfWeekSunday, type RaidEvent } from '@raidschedule/shared';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { getStoredClass, localDateTimeToIso, makeCustomEventId, setStoredClass, type ComposerState } from './composer.js';
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
  composer: ComposerState | null;
  goPrev: () => void;
  goNext: () => void;
  goToday: () => void;
  selectEvent: (event: RaidEvent) => void;
  closeDialog: () => void;
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

  const goPrev = useCallback(() => setAnchor((d) => addDays(d, -7)), []);
  const goNext = useCallback(() => setAnchor((d) => addDays(d, 7)), []);
  const goToday = useCallback(() => setAnchor(startOfWeekSunday(new Date())), []);
  const selectEvent = useCallback((event: RaidEvent) => setSelectedEvent(event), []);
  const closeDialog = useCallback(() => setSelectedEvent(null), []);
  const setHoverWeek = useCallback((key: string) => setHoverLockoutKey(key), []);
  const clearHoverWeek = useCallback(() => setHoverLockoutKey(null), []);

  const openComposer = useCallback((day: CalendarDay, e: { clientX: number; clientY: number }) => {
    setSelectedEvent(null);
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
    });
  }, []);

  const updateComposer = useCallback((patch: Partial<ComposerState>) => {
    if (patch.cls) setStoredClass(patch.cls);
    setComposer((c) => (c ? { ...c, ...patch } : c));
  }, []);

  const closeComposer = useCallback(() => setComposer(null), []);

  const saveComposer = useCallback(() => {
    if (!composer || !composer.title.trim()) return;
    const event: RaidEvent = {
      id: makeCustomEventId(),
      source: 'custom',
      raidName: composer.title.trim(),
      startsAt: localDateTimeToIso(composer.key, composer.start),
      endsAt: localDateTimeToIso(composer.key, composer.end),
      status: 'confirmed',
      character: { name: composer.character.trim() || '—', className: composer.cls },
    };
    setCustom((prev) => [...prev, event]);
    setComposer(null);
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
    const eventsByDay = groupEventsByDateKey([...events, ...custom]);

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
  }, [anchor, events, custom, hoverLockoutKey]);

  const rangeEnd = useMemo(() => addDays(anchor, 20), [anchor]);

  return {
    anchor,
    rangeStart: anchor,
    rangeEnd,
    days,
    selectedEvent,
    composer,
    goPrev,
    goNext,
    goToday,
    selectEvent,
    closeDialog,
    setHoverWeek,
    clearHoverWeek,
    openComposer,
    updateComposer,
    closeComposer,
    saveComposer,
  };
}
