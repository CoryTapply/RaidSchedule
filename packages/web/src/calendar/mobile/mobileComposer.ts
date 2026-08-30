import type { RosterStatus, WowClass } from '@raidschedule/shared';
import { hhmmToTimeValue, timeValueToHHMM, type ComposerMode } from '../composer.js';

export type { ComposerMode };

/** Leaner than desktop's ComposerState — no x/y/centered, since the mobile composer is a full-screen sheet, not a positioned popover. */
export interface MobileComposerState {
  mode: ComposerMode;
  /** PATCH/DELETE target: a `custom:…` id in edit-custom mode, the full `raid-helper:…` id in edit-raid-helper mode. Absent in create mode. */
  id?: string;
  /** date key of the event's day, e.g. "2026-08-18" */
  key: string;
  /** precomputed "Sun, August 18, 2026" */
  dateLabel: string;
  title: string;
  /** "HH:MM" */
  start: string;
  /** "HH:MM" */
  end: string;
  /** precomputed "8:00 PM – 11:00 PM", shown instead of Start/End inputs in edit-raid-helper mode */
  timeLabel: string;
  character: string;
  cls: WowClass;
  status: RosterStatus;
  isHorde: boolean;
  /** Only meaningful in edit-raid-helper mode. */
  hidden: boolean;
  saving: boolean;
  saveError: string | null;
}

const MIN_DURATION_MINUTES = 30;

/**
 * Changing Start carries End along by the current duration (min 30 min), clamped to the
 * same calendar day — TimeSelect's own domain is 0–1439, so there's no overnight wrap here,
 * matching the same limitation desktop silently has.
 */
export function withStartTime(state: Pick<MobileComposerState, 'start' | 'end'>, newStart: string): { start: string; end: string } {
  const oldStart = hhmmToTimeValue(state.start);
  const oldEnd = hhmmToTimeValue(state.end);
  const duration = Math.max(MIN_DURATION_MINUTES, oldEnd - oldStart);
  const newStartValue = hhmmToTimeValue(newStart);
  const newEndValue = Math.min(1439, newStartValue + duration);
  return { start: newStart, end: timeValueToHHMM(newEndValue) };
}
