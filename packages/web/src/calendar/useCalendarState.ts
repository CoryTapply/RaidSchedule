import {
  addDays,
  buildWindow,
  dateKey,
  groupEventsByDateKey,
  lockoutStart,
  startOfWeekSunday,
  type CharacterSignup,
  type RaidEvent,
  type RosterStatus,
} from '@raidschedule/shared';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { createCustomEvent, deleteCustomEvent, updateCustomEvent, updateRaidHelperEventOverride } from '../api/eventsClient.js';
import {
  getStoredClass,
  localDateTimeToIso,
  setStoredClass,
  toLocalHHMM,
  type ComposerState,
} from './composer.js';
import { composerDateLabel, timeLabel } from './format.js';

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

interface IdentityOverride {
  raidName?: string;
  character?: CharacterSignup;
  status?: RosterStatus;
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
  /** Anchors the composer at `e` (a right-click on an event) when given; centers it in the viewport (the detail dialog's "Edit" button) when omitted. */
  openEditor: (event: RaidEvent, e?: { clientX: number; clientY: number }) => void;
  updateComposer: (patch: Partial<ComposerState>) => void;
  closeComposer: () => void;
  saveComposer: () => void;
  deleteComposerEvent: () => void;
}

/**
 * Composer anchor point, clamped to the viewport — ported from the design prototype's
 * popover placement. Only pins the initial top-left corner (width is fixed, so `x` can be
 * clamped exactly here); the panel's height varies with content, so `EventComposer` itself
 * re-clamps `top` against its actual measured height after render, keeping the whole panel
 * — footer included — on screen without needing to scroll.
 */
function clampComposerPosition(e: { clientX: number; clientY: number }): { x: number; y: number } {
  const x = Math.max(8, Math.min(e.clientX, window.innerWidth - 348));
  const y = Math.max(12, e.clientY);
  return { x, y };
}

export function useCalendarState(events: RaidEvent[]): CalendarState {
  const [anchor, setAnchor] = useState(() => startOfWeekSunday(new Date()));
  const [selectedEvent, setSelectedEvent] = useState<RaidEvent | null>(null);
  const [hoverLockoutKey, setHoverLockoutKey] = useState<string | null>(null);
  const [composer, setComposer] = useState<ComposerState | null>(null);
  const [custom, setCustom] = useState<RaidEvent[]>([]);
  /** Full-replacement edits for a custom event, by id — applies whether the base object came from the initial `events` prop or from `custom`. */
  const [customEdits, setCustomEdits] = useState<ReadonlyMap<string, RaidEvent>>(new Map());
  const [deletedIds, setDeletedIds] = useState<ReadonlySet<string>>(new Set());
  /** Local Horde-tag echo for Raid-Helper events, keyed by raidHelperEventId (the whole raid, every sign-up). */
  const [hordeOverrides, setHordeOverrides] = useState<ReadonlyMap<string, boolean>>(new Map());
  /** Local identity-edit echo for Raid-Helper events, keyed by the specific sign-up's full RaidEvent id. */
  const [identityOverrides, setIdentityOverrides] = useState<ReadonlyMap<string, IdentityOverride>>(new Map());

  const goPrev = useCallback(() => setAnchor((d) => addDays(d, -7)), []);
  const goNext = useCallback(() => setAnchor((d) => addDays(d, 7)), []);
  const goToday = useCallback(() => setAnchor(startOfWeekSunday(new Date())), []);
  const selectEvent = useCallback((event: RaidEvent) => setSelectedEvent(event), []);
  const closeDialog = useCallback(() => setSelectedEvent(null), []);
  const setHoverWeek = useCallback((key: string) => setHoverLockoutKey(key), []);
  const clearHoverWeek = useCallback(() => setHoverLockoutKey(null), []);

  const openComposer = useCallback((day: CalendarDay, e: { clientX: number; clientY: number }) => {
    setSelectedEvent(null);
    const { x, y } = clampComposerPosition(e);
    setComposer({
      mode: 'create',
      key: day.key,
      dateLabel: composerDateLabel(day.date),
      centered: false,
      x,
      y,
      title: '',
      start: '20:00',
      end: '23:00',
      timeLabel: '',
      character: '',
      cls: getStoredClass() ?? 'Druid',
      status: 'confirmed',
      isHorde: false,
      saving: false,
      saveError: null,
    });
  }, []);

  const openEditor = useCallback((event: RaidEvent, e?: { clientX: number; clientY: number }) => {
    setSelectedEvent(null);
    const { x, y } = e ? clampComposerPosition(e) : { x: 0, y: 0 };
    const startDate = new Date(event.startsAt);
    const endDate = event.endsAt ? new Date(event.endsAt) : null;
    const cls = event.character.className === 'Unknown' ? getStoredClass() ?? 'Druid' : event.character.className;
    setComposer({
      mode: event.source === 'custom' ? 'edit-custom' : 'edit-raid-helper',
      id: event.id,
      key: dateKey(startDate),
      dateLabel: composerDateLabel(startDate),
      centered: !e,
      x,
      y,
      title: event.raidName,
      start: toLocalHHMM(startDate),
      end: endDate ? toLocalHHMM(endDate) : toLocalHHMM(startDate),
      timeLabel: endDate ? `${timeLabel(event.startsAt)} – ${timeLabel(event.endsAt!)}` : timeLabel(event.startsAt),
      character: event.character.name,
      cls,
      status: event.status,
      isHorde: Boolean(event.isHorde),
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
      } else if (composer.mode === 'edit-custom') {
        const event = await updateCustomEvent(composer.id!, {
          raidName: composer.title.trim(),
          startsAt: localDateTimeToIso(composer.key, composer.start),
          endsAt: localDateTimeToIso(composer.key, composer.end),
          status: composer.status,
          character,
          isHorde: composer.isHorde,
        });
        setCustomEdits((prev) => new Map(prev).set(event.id, event));
      } else {
        const eventId = composer.id!;
        const raidHelperEventId = eventId.split(':')[1]!;
        await updateRaidHelperEventOverride(eventId, {
          raidName: composer.title.trim(),
          character,
          status: composer.status,
          isHorde: composer.isHorde,
        });
        setIdentityOverrides((prev) => new Map(prev).set(eventId, { raidName: composer.title.trim(), character, status: composer.status }));
        setHordeOverrides((prev) => new Map(prev).set(raidHelperEventId, composer.isHorde));
      }
      setComposer(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save event';
      setComposer((c) => (c ? { ...c, saving: false, saveError: message } : c));
    }
  }, [composer]);

  const deleteComposerEvent = useCallback(() => {
    if (!composer || composer.mode !== 'edit-custom' || !composer.id || composer.saving) return;
    const id = composer.id;
    setComposer((c) => (c ? { ...c, saving: true, saveError: null } : c));
    void (async () => {
      try {
        await deleteCustomEvent(id);
        setCustom((prev) => prev.filter((e) => e.id !== id));
        setDeletedIds((prev) => new Set(prev).add(id));
        setComposer(null);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to delete event';
        setComposer((c) => (c ? { ...c, saving: false, saveError: message } : c));
      }
    })();
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
          };
        }
        return merged;
      });
    const eventsByDay = groupEventsByDateKey(withOverrides);

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
  }, [anchor, events, custom, customEdits, deletedIds, hordeOverrides, identityOverrides, hoverLockoutKey]);

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
    openEditor,
    updateComposer,
    closeComposer,
    saveComposer,
    deleteComposerEvent,
  };
}
