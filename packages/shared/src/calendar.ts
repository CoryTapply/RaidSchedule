import type { RaidEvent } from './types.js';

function pad(n: number): string {
  return n < 10 ? '0' + n : '' + n;
}

/** YYYY-MM-DD in local time. */
export function dateKey(d: Date): string {
  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
}

/** The Sunday on/before `d`, midnight-normalized. Ported verbatim from the design prototype. */
export function startOfWeekSunday(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  x.setDate(x.getDate() - x.getDay());
  return x;
}

/**
 * The Tuesday on/before `d`, midnight-normalized — the start of the raid lockout week.
 * Reset day (Tuesday) is hardcoded for the US/NA realm reset. Ported verbatim from the
 * design prototype.
 */
export function lockoutStart(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  const diff = (x.getDay() - 2 + 7) % 7;
  x.setDate(x.getDate() - diff);
  return x;
}

export function addDays(d: Date, n: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

/** `length` consecutive days starting at `anchor` (`anchor + i` for `i` in `0…length-1`). */
export function buildWindow(anchor: Date, length = 21): Date[] {
  return Array.from({ length }, (_, i) => addDays(anchor, i));
}

/** Groups events by local date, with each day's events sorted earliest-first. */
export function groupEventsByDateKey(events: RaidEvent[]): Record<string, RaidEvent[]> {
  const byKey: Record<string, RaidEvent[]> = {};
  for (const event of events) {
    const key = dateKey(new Date(event.startsAt));
    (byKey[key] ??= []).push(event);
  }
  for (const key in byKey) {
    byKey[key]!.sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
  }
  return byKey;
}
