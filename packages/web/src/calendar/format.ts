const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const WEEKDAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function weekdayLabels(): string[] {
  return WEEKDAY_SHORT;
}

export function dayLabel(date: Date, isFirstOfMonth: boolean): string {
  return isFirstOfMonth ? `${MONTH_NAMES[date.getMonth()]!.slice(0, 3)} ${date.getDate()}` : `${date.getDate()}`;
}

export function timeLabel(iso: string): string {
  return new Date(iso).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

/** Gutter/hour-line label for an hour-of-day that may run past 23 (rows can extend past midnight): "5 PM", "12 AM". */
export function hourLabel(hour: number): string {
  const h = ((hour % 24) + 24) % 24;
  if (h === 0) return '12 AM';
  if (h === 12) return '12 PM';
  return `${h % 12} ${h < 12 ? 'AM' : 'PM'}`;
}

export function dateLabel(iso: string): string {
  const d = new Date(iso);
  return `${MONTH_NAMES[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

export function rangeLabel(start: Date, end: Date): string {
  return `${MONTH_NAMES[start.getMonth()]} ${start.getDate()} – ${MONTH_NAMES[end.getMonth()]} ${end.getDate()}, ${end.getFullYear()}`;
}

/** "Tue, August 18, 2026" — header date line for the create-event popup. */
export function composerDateLabel(date: Date): string {
  return `${WEEKDAY_SHORT[date.getDay()]}, ${MONTH_NAMES[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}
