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

const WEEKDAY_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const WEEKDAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function weekdayLabels(full: boolean): string[] {
  return full ? WEEKDAY_FULL : WEEKDAY_SHORT;
}

export function dayLabel(date: Date, isFirstOfMonth: boolean): string {
  return isFirstOfMonth ? `${MONTH_NAMES[date.getMonth()]!.slice(0, 3)} ${date.getDate()}` : `${date.getDate()}`;
}

export function timeLabel(iso: string): string {
  return new Date(iso).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

export function dateLabel(iso: string): string {
  const d = new Date(iso);
  return `${MONTH_NAMES[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

export function rangeLabel(start: Date, end: Date): string {
  return `${MONTH_NAMES[start.getMonth()]} ${start.getDate()} – ${MONTH_NAMES[end.getMonth()]} ${end.getDate()}, ${end.getFullYear()}`;
}
