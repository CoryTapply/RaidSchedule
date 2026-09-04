import {
  buildWindow,
  dateKey,
  groupEventsByDateKey,
  lockoutStart,
  type CharacterSignup,
  type RaidEvent,
  type RosterStatus,
} from '@raidschedule/shared';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createCustomEvent, deleteCustomEvent, updateCustomEvent, updateRaidHelperEventOverride } from '../../api/eventsClient.js';
import { getStoredClass, localDateTimeToIso, setStoredClass, toLocalHHMM } from '../composer.js';
import { composerDateLabel, timeRangeLabel } from '../format.js';
import { withStartTime, type MobileComposerState } from './mobileComposer.js';

export interface MobileCalendarDay {
  date: Date;
  key: string;
  isToday: boolean;
  isFirstOfMonth: boolean;
  /** The very first row in the whole range — the month tag also shows here even when the day isn't the 1st, so the reader knows what month they're starting in. */
  isFirstRow: boolean;
  lockoutWeekKey: string;
  events: RaidEvent[];
}

interface IdentityOverride {
  raidName?: string;
  character?: CharacterSignup;
  status?: RosterStatus;
  hidden?: boolean;
}

export interface ComposerSaveResult {
  dayKey: string;
  message: string;
}

export interface MobileCalendarState {
  days: MobileCalendarDay[];
  todayKey: string;
  selectedEvent: RaidEvent | null;
  composer: MobileComposerState | null;
  selectEvent: (event: RaidEvent) => void;
  closeDetail: () => void;
  openComposer: (day: MobileCalendarDay) => void;
  /** Opens the composer prefilled from an existing event — the mobile equivalent of desktop's Edit button. */
  openEditor: (event: RaidEvent) => void;
  updateComposer: (patch: Partial<MobileComposerState>) => void;
  /** Changing Start carries End along by the current duration — see mobileComposer.withStartTime. */
  setComposerStart: (start: string) => void;
  closeComposer: () => void;
  /** Resolves to the affected day + a toast message on success, undefined on a no-op or a failed save (surfaced via composer.saveError instead). */
  saveComposer: () => Promise<ComposerSaveResult | undefined>;
  deleteComposerEvent: () => Promise<ComposerSaveResult | undefined>;
}

/**
 * Mirrors useCalendarState.ts's mutation logic (same eventsClient calls, same local-override
 * shape) but as an entirely separate instance — mobile and desktop never share state, per
 * the plan's "separate hook, same API calls" decision. Unlike desktop, there's no view-mode
 * toggle, no anchor navigation, and no hover-driven lockout highlight: the range is fixed for
 * the surface's lifetime and the "active" day/lockout is driven by scroll position, owned by
 * the caller (MobileCalendarPage), not by this hook.
 */
export function useMobileCalendarState(events: RaidEvent[], spanDays = 28): MobileCalendarState {
  const anchor = useMemo(() => lockoutStart(new Date()), []);
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);
  const todayKey = useMemo(() => dateKey(today), [today]);

  const [selectedEvent, setSelectedEvent] = useState<RaidEvent | null>(null);
  const [composer, setComposer] = useState<MobileComposerState | null>(null);
  const [custom, setCustom] = useState<RaidEvent[]>([]);
  const [customEdits, setCustomEdits] = useState<ReadonlyMap<string, RaidEvent>>(new Map());
  const [deletedIds, setDeletedIds] = useState<ReadonlySet<string>>(new Set());
  const [hordeOverrides, setHordeOverrides] = useState<ReadonlyMap<string, boolean>>(new Map());
  const [identityOverrides, setIdentityOverrides] = useState<ReadonlyMap<string, IdentityOverride>>(new Map());

  const selectEvent = useCallback((event: RaidEvent) => setSelectedEvent(event), []);
  const closeDetail = useCallback(() => setSelectedEvent(null), []);

  const openComposer = useCallback((day: MobileCalendarDay) => {
    setSelectedEvent(null);
    setComposer({
      mode: 'create',
      key: day.key,
      dateLabel: composerDateLabel(day.date),
      title: '',
      start: '20:00',
      end: '23:00',
      timeLabel: '',
      character: '',
      cls: getStoredClass() ?? 'Druid',
      status: 'confirmed',
      isHorde: false,
      hidden: false,
      saving: false,
      saveError: null,
    });
  }, []);

  const openEditor = useCallback((event: RaidEvent) => {
    setSelectedEvent(null);
    const startDate = new Date(event.startsAt);
    const endDate = event.endsAt ? new Date(event.endsAt) : null;
    const cls = event.character.className === 'Unknown' ? getStoredClass() ?? 'Druid' : event.character.className;
    setComposer({
      mode: event.source === 'custom' ? 'edit-custom' : 'edit-raid-helper',
      id: event.id,
      key: dateKey(startDate),
      dateLabel: composerDateLabel(startDate),
      title: event.raidName,
      start: toLocalHHMM(startDate),
      end: endDate ? toLocalHHMM(endDate) : toLocalHHMM(startDate),
      timeLabel: timeRangeLabel(event.startsAt, event.endsAt),
      character: event.character.name,
      cls,
      status: event.status,
      isHorde: Boolean(event.isHorde),
      hidden: Boolean(event.hidden),
      saving: false,
      saveError: null,
    });
  }, []);

  const updateComposer = useCallback((patch: Partial<MobileComposerState>) => {
    if (patch.cls) setStoredClass(patch.cls);
    setComposer((c) => (c ? { ...c, ...patch, saveError: patch.saveError !== undefined ? patch.saveError : null } : c));
  }, []);

  const setComposerStart = useCallback((start: string) => {
    setComposer((c) => (c ? { ...c, ...withStartTime(c, start) } : c));
  }, []);

  const closeComposer = useCallback(() => setComposer(null), []);

  const saveComposer = useCallback(async (): Promise<ComposerSaveResult | undefined> => {
    if (!composer || !composer.title.trim() || composer.saving) return undefined;
    setComposer((c) => (c ? { ...c, saving: true, saveError: null } : c));
    const character: CharacterSignup = { name: composer.character.trim() || '—', className: composer.cls };

    try {
      if (composer.mode === 'create') {
        const event = await createCustomEvent({
          raidName: composer.title.trim(),
          startsAt: localDateTimeToIso(composer.key, composer.start),
          endsAt: localDateTimeToIso(composer.key, composer.end),
          status: composer.status,
          character,
          isHorde: composer.isHorde,
        });
        setCustom((prev) => [...prev, event]);
        setComposer(null);
        return { dayKey: composer.key, message: 'Event published' };
      }

      if (composer.mode === 'edit-custom') {
        const event = await updateCustomEvent(composer.id!, {
          raidName: composer.title.trim(),
          startsAt: localDateTimeToIso(composer.key, composer.start),
          endsAt: localDateTimeToIso(composer.key, composer.end),
          status: composer.status,
          character,
          isHorde: composer.isHorde,
        });
        setCustomEdits((prev) => new Map(prev).set(event.id, event));
        setComposer(null);
        return { dayKey: composer.key, message: 'Event updated' };
      }

      const eventId = composer.id!;
      const raidHelperEventId = eventId.split(':')[1]!;
      await updateRaidHelperEventOverride(eventId, {
        raidName: composer.title.trim(),
        character,
        status: composer.status,
        isHorde: composer.isHorde,
        hidden: composer.hidden,
      });
      setIdentityOverrides((prev) =>
        new Map(prev).set(eventId, { raidName: composer.title.trim(), character, status: composer.status, hidden: composer.hidden }),
      );
      setHordeOverrides((prev) => new Map(prev).set(raidHelperEventId, composer.isHorde));
      setComposer(null);
      return { dayKey: composer.key, message: 'Event updated' };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save event';
      setComposer((c) => (c ? { ...c, saving: false, saveError: message } : c));
      return undefined;
    }
  }, [composer]);

  const deleteComposerEvent = useCallback(async (): Promise<ComposerSaveResult | undefined> => {
    if (!composer || composer.mode !== 'edit-custom' || !composer.id || composer.saving) return undefined;
    const id = composer.id;
    const dayKey = composer.key;
    setComposer((c) => (c ? { ...c, saving: true, saveError: null } : c));
    try {
      await deleteCustomEvent(id);
      setCustom((prev) => prev.filter((e) => e.id !== id));
      setDeletedIds((prev) => new Set(prev).add(id));
      setComposer(null);
      return { dayKey, message: 'Event deleted' };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete event';
      setComposer((c) => (c ? { ...c, saving: false, saveError: message } : c));
      return undefined;
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

  // iOS back-swipe is how users expect to dismiss a sheet — without this it navigates away
  // from the app instead. Push one history entry while either overlay is open (switching
  // straight from detail to editor doesn't push a second one, since `isOpen` stays true across
  // that transition) and pop it again once closed by any other means (Cancel/Save/tap-outside/
  // drag/Escape), so a single back-swipe or back-button press always closes exactly one layer.
  const pushedHistoryRef = useRef(false);
  const closedViaPopStateRef = useRef(false);

  useEffect(() => {
    function onPopState() {
      closedViaPopStateRef.current = true;
      pushedHistoryRef.current = false;
      if (composer) setComposer(null);
      else if (selectedEvent) setSelectedEvent(null);
    }
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [composer, selectedEvent]);

  useEffect(() => {
    const isOpen = composer !== null || selectedEvent !== null;
    if (isOpen && !pushedHistoryRef.current) {
      window.history.pushState({ mobileOverlay: true }, '');
      pushedHistoryRef.current = true;
      return;
    }
    if (!isOpen && pushedHistoryRef.current) {
      pushedHistoryRef.current = false;
      if (closedViaPopStateRef.current) {
        closedViaPopStateRef.current = false;
      } else {
        window.history.back();
      }
    }
  }, [composer, selectedEvent]);

  const days = useMemo(() => {
    const withOverrides = [...events, ...custom]
      .filter((e) => !deletedIds.has(e.id))
      .map((e) => (e.source === 'custom' && customEdits.has(e.id) ? customEdits.get(e.id)! : e))
      .map((e) => {
        if (e.source !== 'raid-helper') return e;
        let merged = e;
        if (e.raidHelperEventId && hordeOverrides.has(e.raidHelperEventId)) {
          merged = { ...merged, isHorde: hordeOverrides.get(e.raidHelperEventId) };
        }
        const identity = identityOverrides.get(e.id);
        if (identity) {
          merged = {
            ...merged,
            raidName: identity.raidName ?? merged.raidName,
            status: identity.status ?? merged.status,
            character: identity.character ?? merged.character,
            hidden: identity.hidden ?? merged.hidden,
          };
        }
        return merged;
      })
      .filter((e) => !e.hidden);
    const eventsByDay = groupEventsByDateKey(withOverrides);

    return buildWindow(anchor, spanDays).map((date, index): MobileCalendarDay => {
      const key = dateKey(date);
      return {
        date,
        key,
        isToday: key === todayKey,
        isFirstOfMonth: date.getDate() === 1,
        isFirstRow: index === 0,
        lockoutWeekKey: dateKey(lockoutStart(date)),
        events: eventsByDay[key] ?? [],
      };
    });
  }, [anchor, spanDays, events, custom, customEdits, deletedIds, hordeOverrides, identityOverrides, todayKey]);

  return {
    days,
    todayKey,
    selectedEvent,
    composer,
    selectEvent,
    closeDetail,
    openComposer,
    openEditor,
    updateComposer,
    setComposerStart,
    closeComposer,
    saveComposer,
    deleteComposerEvent,
  };
}
