import { addDays, buildWindow, dateKey, groupEventsByDateKey, lockoutStart, startOfWeekSunday, type RaidEvent } from '@raidschedule/shared';
import { useCallback, useMemo, useState } from 'react';

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
  goPrev: () => void;
  goNext: () => void;
  goToday: () => void;
  selectEvent: (event: RaidEvent) => void;
  closeDialog: () => void;
  setHoverWeek: (key: string) => void;
  clearHoverWeek: () => void;
}

export function useCalendarState(events: RaidEvent[]): CalendarState {
  const [anchor, setAnchor] = useState(() => startOfWeekSunday(new Date()));
  const [selectedEvent, setSelectedEvent] = useState<RaidEvent | null>(null);
  const [hoverLockoutKey, setHoverLockoutKey] = useState<string | null>(null);

  const goPrev = useCallback(() => setAnchor((d) => addDays(d, -7)), []);
  const goNext = useCallback(() => setAnchor((d) => addDays(d, 7)), []);
  const goToday = useCallback(() => setAnchor(startOfWeekSunday(new Date())), []);
  const selectEvent = useCallback((event: RaidEvent) => setSelectedEvent(event), []);
  const closeDialog = useCallback(() => setSelectedEvent(null), []);
  const setHoverWeek = useCallback((key: string) => setHoverLockoutKey(key), []);
  const clearHoverWeek = useCallback(() => setHoverLockoutKey(null), []);

  const days = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayKey = dateKey(today);
    const activeLockoutKey = hoverLockoutKey ?? dateKey(lockoutStart(today));
    const eventsByDay = groupEventsByDateKey(events);

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
  }, [anchor, events, hoverLockoutKey]);

  const rangeEnd = useMemo(() => addDays(anchor, 20), [anchor]);

  return {
    anchor,
    rangeStart: anchor,
    rangeEnd,
    days,
    selectedEvent,
    goPrev,
    goNext,
    goToday,
    selectEvent,
    closeDialog,
    setHoverWeek,
    clearHoverWeek,
  };
}
