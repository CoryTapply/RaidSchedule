import { addDays, dateKey, lockoutStart } from '@raidschedule/shared';
import type { MobileCalendarDay } from './useMobileCalendarState.js';
import styles from './MobileWeekStrip.module.css';

const WEEKDAY_INITIALS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export interface MobileWeekStripProps {
  /** The full loaded range — used to look up which of the 7 cells has raids. A cell outside the loaded range (near the very start/end of it) just renders with no density dot. */
  days: MobileCalendarDay[];
  activeDate: Date;
  activeDayKey: string;
  todayKey: string;
  onSelectDay: (key: string) => void;
}

export function MobileWeekStrip({ days, activeDate, activeDayKey, todayKey, onSelectDay }: MobileWeekStripProps) {
  const dayByKey = new Map(days.map((d) => [d.key, d]));
  const weekStart = lockoutStart(activeDate);

  return (
    <div className={styles.strip}>
      {Array.from({ length: 7 }, (_, i) => {
        const date = addDays(weekStart, i);
        const key = dateKey(date);
        const day = dayByKey.get(key);
        const hasEvents = Boolean(day && day.events.length > 0);
        const isActive = key === activeDayKey;
        const isToday = key === todayKey;
        // Today's own tint (selected) already separates it from the rest — this is a label-only
        // swap so the two signals stay visually distinct when they land on the same cell.
        const wdTracking = isToday ? '.01em' : 'var(--zp-tracking-micro)';
        const wdColor = isToday ? 'var(--zp-accent-300)' : 'var(--zp-text-4)';
        const numWeight = isToday ? 600 : 400;
        const numColor = isToday || hasEvents ? 'var(--zp-text)' : 'var(--zp-text-3)';

        return (
          <button
            key={key}
            type="button"
            className={`${styles.cell} ${isActive ? styles.cellActive : ''}`}
            onClick={() => onSelectDay(key)}
          >
            <span className={styles.initial} style={{ letterSpacing: wdTracking, color: wdColor }}>
              {isToday ? 'Today' : WEEKDAY_INITIALS[date.getDay()]}
            </span>
            <span className={styles.numeral} style={{ color: numColor, fontWeight: numWeight }}>
              {date.getDate()}
            </span>
            <span className={`${styles.dot} ${hasEvents ? styles.dotActive : ''}`} />
          </button>
        );
      })}
    </div>
  );
}
