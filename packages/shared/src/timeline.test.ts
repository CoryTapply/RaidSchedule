import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import { computeRowWindow, DEFAULT_END_HOUR, DEFAULT_START_HOUR, layoutDayEvents } from './timeline.js';

function ev(startsAt: string, endsAt?: string) {
  return { startsAt, endsAt };
}

describe('computeRowWindow', () => {
  it('falls back to the default window when there are no events', () => {
    expect(computeRowWindow([])).toEqual({ startHour: DEFAULT_START_HOUR, endHour: DEFAULT_END_HOUR });
  });

  it('widens the start hour for an event earlier than the default window', () => {
    const window = computeRowWindow([ev('2026-08-18T11:15:00')]);
    expect(window.startHour).toBe(11);
    expect(window.endHour).toBe(DEFAULT_END_HOUR);
  });

  it('widens the end hour for an event later than the default window', () => {
    const window = computeRowWindow([ev('2026-08-18T22:00:00', '2026-08-19T01:30:00')]);
    expect(window.endHour).toBe(26);
  });

  it('never narrows past the default window', () => {
    const window = computeRowWindow([ev('2026-08-18T20:00:00', '2026-08-18T21:00:00')]);
    expect(window).toEqual({ startHour: DEFAULT_START_HOUR, endHour: DEFAULT_END_HOUR });
  });

  it('startHour never exceeds endHour for arbitrary event sets', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            hour: fc.integer({ min: 0, max: 23 }),
            minute: fc.integer({ min: 0, max: 59 }),
            durationMin: fc.integer({ min: 1, max: 600 }),
          }),
        ),
        (events) => {
          const rowEvents = events.map((e) => {
            const start = new Date(2026, 7, 18, e.hour, e.minute);
            const end = new Date(start.getTime() + e.durationMin * 60_000);
            return ev(start.toISOString(), end.toISOString());
          });
          const window = computeRowWindow(rowEvents);
          expect(window.startHour).toBeLessThanOrEqual(window.endHour);
          expect(window.startHour).toBeLessThanOrEqual(DEFAULT_START_HOUR);
          expect(window.endHour).toBeGreaterThanOrEqual(DEFAULT_END_HOUR);
        },
      ),
    );
  });
});

describe('layoutDayEvents', () => {
  const window = { startHour: 17, endHour: 24 };

  it('gives a lone event the full lane and correct top/height offsets', () => {
    const [placement] = layoutDayEvents([ev('2026-08-18T20:00:00', '2026-08-18T22:00:00')], window);
    expect(placement).toMatchObject({ topHours: 3, heightHours: 2, laneIndex: 0, laneCount: 1 });
  });

  it('clips an event that extends past the row window', () => {
    const [placement] = layoutDayEvents([ev('2026-08-18T23:00:00', '2026-08-19T02:00:00')], window);
    expect(placement).toMatchObject({ topHours: 6, heightHours: 1 });
  });

  it('splits two overlapping events into two equal lanes', () => {
    const placements = layoutDayEvents(
      [ev('2026-08-18T20:00:00', '2026-08-18T22:00:00'), ev('2026-08-18T20:30:00', '2026-08-18T21:30:00')],
      window,
    );
    expect(placements).toHaveLength(2);
    expect(placements.every((p) => p.laneCount === 2)).toBe(true);
    expect(placements.map((p) => p.laneIndex).sort()).toEqual([0, 1]);
  });

  it('does not lane-share two events that touch but do not overlap', () => {
    const placements = layoutDayEvents(
      [ev('2026-08-18T19:00:00', '2026-08-18T20:00:00'), ev('2026-08-18T20:00:00', '2026-08-18T21:00:00')],
      window,
    );
    expect(placements.every((p) => p.laneCount === 1)).toBe(true);
  });

  it('chains a three-way overlap through a shared middle event into one cluster of three', () => {
    const placements = layoutDayEvents(
      [
        ev('2026-08-18T20:00:00', '2026-08-18T21:00:00'),
        ev('2026-08-18T20:30:00', '2026-08-18T21:30:00'),
        ev('2026-08-18T21:15:00', '2026-08-18T22:00:00'),
      ],
      window,
    );
    expect(placements.every((p) => p.laneCount === 3)).toBe(true);
    expect(placements.map((p) => p.laneIndex).sort()).toEqual([0, 1, 2]);
  });

  it('treats an event with no end as a 1-hour block', () => {
    const [placement] = layoutDayEvents([ev('2026-08-18T20:00:00')], window);
    expect(placement.heightHours).toBe(1);
  });
});
