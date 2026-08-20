import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import { addDays, buildWindow, dateKey, groupEventsByDateKey, lockoutStart, startOfWeekSunday } from './calendar.js';
import type { RaidEvent } from './types.js';

const anyDate = fc.date({
  min: new Date(2000, 0, 1),
  max: new Date(2100, 0, 1),
  noInvalidDate: true,
});

describe('startOfWeekSunday', () => {
  it('always returns a Sunday at local midnight', () => {
    fc.assert(
      fc.property(anyDate, (d) => {
        const sunday = startOfWeekSunday(d);
        expect(sunday.getDay()).toBe(0);
        expect([sunday.getHours(), sunday.getMinutes(), sunday.getSeconds(), sunday.getMilliseconds()]).toEqual([
          0, 0, 0, 0,
        ]);
      }),
    );
  });

  it('is on or before the input date', () => {
    fc.assert(
      fc.property(anyDate, (d) => {
        expect(startOfWeekSunday(d).getTime()).toBeLessThanOrEqual(d.getTime());
      }),
    );
  });

  it('is idempotent', () => {
    fc.assert(
      fc.property(anyDate, (d) => {
        const once = startOfWeekSunday(d);
        const twice = startOfWeekSunday(once);
        expect(twice.getTime()).toBe(once.getTime());
      }),
    );
  });
});

describe('lockoutStart', () => {
  it('always returns a Tuesday at local midnight', () => {
    fc.assert(
      fc.property(anyDate, (d) => {
        const tuesday = lockoutStart(d);
        expect(tuesday.getDay()).toBe(2);
        expect([tuesday.getHours(), tuesday.getMinutes(), tuesday.getSeconds(), tuesday.getMilliseconds()]).toEqual([
          0, 0, 0, 0,
        ]);
      }),
    );
  });

  it('is within the same calendar week (at most 6 days before) the input date', () => {
    fc.assert(
      fc.property(anyDate, (d) => {
        const midnight = new Date(d);
        midnight.setHours(0, 0, 0, 0);
        const daysBefore = Math.round((midnight.getTime() - lockoutStart(d).getTime()) / 86_400_000);
        expect(daysBefore).toBeGreaterThanOrEqual(0);
        expect(daysBefore).toBeLessThanOrEqual(6);
      }),
    );
  });

  it('is idempotent', () => {
    fc.assert(
      fc.property(anyDate, (d) => {
        const once = lockoutStart(d);
        const twice = lockoutStart(once);
        expect(twice.getTime()).toBe(once.getTime());
      }),
    );
  });
});

describe('buildWindow', () => {
  it('always produces 21 consecutive days starting at anchor', () => {
    fc.assert(
      fc.property(anyDate, (d) => {
        const anchor = startOfWeekSunday(d);
        const days = buildWindow(anchor);
        expect(days).toHaveLength(21);
        expect(days[0]!.getTime()).toBe(anchor.getTime());
        for (let i = 1; i < days.length; i++) {
          expect(days[i]!.getTime()).toBe(addDays(days[i - 1]!, 1).getTime());
        }
      }),
    );
  });

  it('respects a custom length', () => {
    fc.assert(
      fc.property(anyDate, fc.integer({ min: 0, max: 60 }), (d, length) => {
        expect(buildWindow(d, length)).toHaveLength(length);
      }),
    );
  });
});

describe('groupEventsByDateKey', () => {
  function makeEvent(id: string, isoTime: string): RaidEvent {
    return {
      id,
      source: 'custom',
      raidName: `Raid ${id}`,
      startsAt: isoTime,
      status: 'pending',
      character: { name: 'Char', className: 'Unknown' },
    };
  }

  it('sorts each day\'s events earliest-first, regardless of input order', () => {
    const late = makeEvent('late', '2026-08-19T22:00:00.000Z');
    const early = makeEvent('early', '2026-08-19T18:00:00.000Z');
    const mid = makeEvent('mid', '2026-08-19T20:00:00.000Z');

    const grouped = groupEventsByDateKey([late, early, mid]);
    const key = dateKey(new Date(early.startsAt));

    expect(grouped[key]!.map((e) => e.id)).toEqual(['early', 'mid', 'late']);
  });

  it('keeps different days separate', () => {
    const day1 = makeEvent('d1', '2026-08-19T18:00:00.000Z');
    const day2 = makeEvent('d2', '2026-08-20T18:00:00.000Z');
    const grouped = groupEventsByDateKey([day1, day2]);
    expect(Object.keys(grouped)).toHaveLength(2);
  });
});

describe('dateKey', () => {
  it('is stable for times on the same local calendar day', () => {
    fc.assert(
      fc.property(anyDate, (d) => {
        const start = new Date(d);
        start.setHours(0, 0, 0, 0);
        const end = new Date(d);
        end.setHours(23, 59, 59, 999);
        expect(dateKey(start)).toBe(dateKey(end));
      }),
    );
  });
});
