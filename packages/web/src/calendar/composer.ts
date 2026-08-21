import { WOW_CLASSES, type RosterStatus, type WowClass } from '@raidschedule/shared';

export interface ComposerState {
  /** date key of the clicked day, e.g. "2026-08-18" */
  key: string;
  /** precomputed "Tue, August 18, 2026" */
  dateLabel: string;
  x: number;
  y: number;
  title: string;
  /** "HH:MM" */
  start: string;
  /** "HH:MM" */
  end: string;
  character: string;
  cls: WowClass;
  status: RosterStatus;
  saving: boolean;
  saveError: string | null;
}

/** Combines a local YYYY-MM-DD date key with a local "HH:MM" time into an ISO UTC string. */
export function localDateTimeToIso(dateKeyStr: string, hhmm: string): string {
  const [y, m, d] = dateKeyStr.split('-').map(Number);
  const [h, min] = hhmm.split(':').map(Number);
  return new Date(y!, m! - 1, d!, h!, min!, 0, 0).toISOString();
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
