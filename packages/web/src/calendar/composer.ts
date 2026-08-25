import { WOW_CLASSES, type RosterStatus, type WowClass } from '@raidschedule/shared';

export type ComposerMode = 'create' | 'edit-custom' | 'edit-raid-helper';

export interface ComposerState {
  mode: ComposerMode;
  /** PATCH/DELETE target: a `custom:…` id in edit-custom mode, the full `raid-helper:…` id in edit-raid-helper mode. Absent in create mode. */
  id?: string;
  /** date key of the event's day, e.g. "2026-08-18" */
  key: string;
  /** precomputed "Tue, August 18, 2026" */
  dateLabel: string;
  /** When true, the composer is centered in the viewport and `x`/`y` are unused — the "Edit" button in the detail dialog opens this way rather than anchored to wherever it was clicked. */
  centered: boolean;
  x: number;
  y: number;
  title: string;
  /** "HH:MM" */
  start: string;
  /** "HH:MM" */
  end: string;
  /** precomputed "8:00 PM – 11:00 PM", shown instead of Start/End inputs when the schedule isn't editable (edit-raid-helper mode) */
  timeLabel: string;
  character: string;
  cls: WowClass;
  status: RosterStatus;
  isHorde: boolean;
  saving: boolean;
  saveError: string | null;
}

/** Combines a local YYYY-MM-DD date key with a local "HH:MM" time into an ISO UTC string. */
export function localDateTimeToIso(dateKeyStr: string, hhmm: string): string {
  const [y, m, d] = dateKeyStr.split('-').map(Number);
  const [h, min] = hhmm.split(':').map(Number);
  return new Date(y!, m! - 1, d!, h!, min!, 0, 0).toISOString();
}

/** Local "HH:MM" for a Date, in the browser's own timezone (the inverse of localDateTimeToIso's time half). */
export function toLocalHHMM(date: Date): string {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

const LAST_CLASS_STORAGE_KEY = 'raidschedule.composer.lastClass';

/** The class picked in a previous session's composer, if any and still a recognized WowClass. */
export function getStoredClass(): WowClass | null {
  try {
    const value = localStorage.getItem(LAST_CLASS_STORAGE_KEY);
    return value && (WOW_CLASSES as readonly string[]).includes(value) ? (value as WowClass) : null;
  } catch {
    return null;
  }
}

export function setStoredClass(cls: WowClass): void {
  try {
    localStorage.setItem(LAST_CLASS_STORAGE_KEY, cls);
  } catch {
    // Storage can be unavailable (private browsing, quota, disabled) — the
    // class picker still works, it just won't remember the pick.
  }
}
