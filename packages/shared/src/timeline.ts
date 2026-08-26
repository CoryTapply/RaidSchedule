import type { RaidEvent } from './types.js';

/** Default first hour shown in a week row (5 PM), per the design's timeline model. */
export const DEFAULT_START_HOUR = 17;
/** Default last hour shown in a week row (midnight). */
export const DEFAULT_END_HOUR = 24;

function minutesOfDay(iso: string): number {
  const d = new Date(iso);
  return d.getHours() * 60 + d.getMinutes();
}

/**
 * Events without an explicit end (a rare custom-event edge case) get a
 * 1-hour placeholder block. Events with a start/end that are equal (seen in
 * live raid-helper.xyz data) or otherwise non-positive get a 2-hour
 * placeholder instead — a zero-length block reads as an unknown duration,
 * not a genuinely instantaneous event, and 2 hours is a more typical raid
 * length than 1.
 */
function durationMinutes(event: Pick<RaidEvent, 'startsAt' | 'endsAt'>): number {
  if (!event.endsAt) return 60;
  const diff = (new Date(event.endsAt).getTime() - new Date(event.startsAt).getTime()) / 60_000;
  return diff > 0 ? diff : 120;
}

/**
 * Start/end minute-of-day for an event, relative to its own start's calendar
 * day. `endMin` can exceed 1440 for an event that runs past midnight.
 */
export function eventMinuteRange(event: Pick<RaidEvent, 'startsAt' | 'endsAt'>): { startMin: number; endMin: number } {
  const startMin = minutesOfDay(event.startsAt);
  return { startMin, endMin: startMin + durationMinutes(event) };
}

export interface RowWindow {
  startHour: number;
  endHour: number;
}

/**
 * A week row's visible hour window: the default window, widened to fit every
 * event in that row. `startH = min(startH, floor(event.startMin/60))`,
 * `endH = max(endH, ceil(event.endMin/60))` — ported from the design
 * prototype's per-row layout rule so each row can size independently.
 */
export function computeRowWindow(
  rowEvents: readonly Pick<RaidEvent, 'startsAt' | 'endsAt'>[],
  defaultStartHour: number = DEFAULT_START_HOUR,
  defaultEndHour: number = DEFAULT_END_HOUR,
): RowWindow {
  let startHour = defaultStartHour;
  let endHour = defaultEndHour;
  for (const event of rowEvents) {
    const { startMin, endMin } = eventMinuteRange(event);
    startHour = Math.min(startHour, Math.floor(startMin / 60));
    endHour = Math.max(endHour, Math.ceil(endMin / 60));
  }
  return { startHour, endHour };
}

export interface TimelinePlacement<T> {
  event: T;
  /** Hours from the row's start hour to the event's top edge. */
  topHours: number;
  /** Event height in hours, clipped to the row's visible window. */
  heightHours: number;
  /** 0-indexed position among overlapping events. */
  laneIndex: number;
  /** Number of events sharing this overlap cluster. */
  laneCount: number;
}

/**
 * Positions one day's events on the timeline: sorted by start then end, then
 * greedily clustered so any event starting before the running max end of the
 * current cluster joins it; each cluster splits into equal side-by-side
 * lanes. Ported from the design prototype's `layout()`.
 */
export function layoutDayEvents<T extends Pick<RaidEvent, 'startsAt' | 'endsAt'>>(
  dayEvents: readonly T[],
  window: RowWindow,
): TimelinePlacement<T>[] {
  const rowStartMin = window.startHour * 60;
  const rowEndMin = window.endHour * 60;

  const withRange = dayEvents
    .map((event) => ({ event, ...eventMinuteRange(event) }))
    .sort((a, b) => a.startMin - b.startMin || a.endMin - b.endMin);

  const clusters: (typeof withRange)[] = [];
  let cluster: typeof withRange = [];
  let clusterEnd = -Infinity;
  for (const item of withRange) {
    if (cluster.length && item.startMin >= clusterEnd) {
      clusters.push(cluster);
      cluster = [];
      clusterEnd = -Infinity;
    }
    cluster.push(item);
    clusterEnd = Math.max(clusterEnd, item.endMin);
  }
  if (cluster.length) clusters.push(cluster);

  const placements: TimelinePlacement<T>[] = [];
  for (const group of clusters) {
    const laneCount = group.length;
    group.forEach((item, laneIndex) => {
      placements.push({
        event: item.event,
        topHours: (item.startMin - rowStartMin) / 60,
        heightHours: (Math.min(item.endMin, rowEndMin) - item.startMin) / 60,
        laneIndex,
        laneCount,
      });
    });
  }
  return placements;
}
