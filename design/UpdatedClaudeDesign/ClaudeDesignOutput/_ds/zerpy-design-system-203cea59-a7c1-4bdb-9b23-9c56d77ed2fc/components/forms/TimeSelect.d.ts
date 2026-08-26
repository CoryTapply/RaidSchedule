import * as React from 'react';

/** Minutes since midnight, 0–1439. No timezone, no DST, no date. */
export type TimeValue = number | null;

/** Lenient parse: "9:30 PM" "930p" "9 30 pm" "0930" "21:30" "9pm" "9". Out-of-range clamps; garbage returns null. */
export function parseTime(input: string): TimeValue;
/** Canonical output: "9:30 AM". */
export function formatTime(value: TimeValue): string;

/**
 * A masked single-line time field, `h:mm AM/PM`, with an optional listbox of
 * preset times. One input, three logical segments; the colon and the space are
 * inert — never typed, never deleted, never landed on.
 *
 * Digits are ignored once the caret reaches the meridiem, so there is no way to
 * type past the minute. Nothing auto-advances on a timer: a pending hour moves
 * on an explicit keystroke only.
 *
 * Adherence: use it inside a `Field` for its label and hint. Do not wrap it in
 * a second border or put the chevron outside the control. The listbox is the
 * overlay surface — never nest it in another blurred panel.
 */
export interface TimeSelectProps {
  value: TimeValue;
  /** Fires only on commit of a resolved value: blur, Tab, Enter, or a preset pick. */
  onChange: (value: TimeValue) => void;
  /** Every keystroke, as the raw masked string. */
  onInputChange?: (raw: string) => void;
  onOpenChange?: (open: boolean) => void;
  /** Default 0. */
  min?: TimeValue;
  /** Default 1439. */
  max?: TimeValue;
  /** Preset spacing in minutes. Default 15 (96 rows). */
  interval?: number;
  /** Arrow-key minute step. Default 1. Typing is exempt from it. */
  step?: number;
  /** Used when the user never sets one. Default 'AM'. */
  defaultMeridiem?: 'AM' | 'PM';
  /** Pair an end field with its start: presets gain a duration label and earlier times drop out. */
  relativeTo?: TimeValue;
  /** Which edge the listbox anchors to. Use 'end' for the right-hand field of a pair. Default 'start'. */
  align?: 'start' | 'end';
  /** Default '--:-- --'. */
  placeholder?: string;
  disabled?: boolean;
  /** Focusable and copyable, no editing, no listbox. */
  readOnly?: boolean;
  /** Consumer-set. Never set mid-typing — a half-typed time is incomplete, not invalid. */
  invalid?: boolean;
  required?: boolean;
  /** Default false, so tabbing through a form never pops a listbox. */
  openOnFocus?: boolean;
  id?: string;
  name?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
}
export function TimeSelect(props: TimeSelectProps): JSX.Element;
