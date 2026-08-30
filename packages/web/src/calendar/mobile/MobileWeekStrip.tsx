import { addDays, dateKey, startOfWeekSunday } from '@raidschedule/shared';
import type { MobileCalendarDay } from './useMobileCalendarState.js';
import styles from './MobileWeekStrip.module.css';

const WEEKDAY_INITIALS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export interface MobileWeekStripProps {
  /** The full loaded range — used to look up which of the 7 cells has raids. A cell outside the loaded range (near the very start/end of it) just renders with no density dot. */
  days: MobileCalendarDay[];
  activeDate: Date;
  activeDayKey: string;
  onSelectDay: (key: string) => void;
}

export function MobileWeekStrip({ days, activeDate, activeDayKey, onSelectDay }: MobileWeekStripProps) {
  const dayByKey = new Map(days.map((d) => [d.key, d]));
  const weekStart = startOfWeekSunday(activeDate);

  return (
    <div className={styles.strip}>
      {Array.from({ length: 7 }, (_, i) => {
        const date = addDays(weekStart, i);
        const key = dateKey(date);
        const day = dayByKey.get(key);
        const hasEvents = Boolean(day && day.events.length > 0);
        const isActive = key === activeDayKey;

        return (
          <button
            key={key}
            type="button"
            className={`${styles.cell} ${isActive ? styles.cellActive : ''}`}
            onClick={() => onSelectDay(key)}
          >
            <span className={styles.initial}>{WEEKDAY_INITIALS[date.getDay()]}</span>
            <span className={styles.numeral}>{date.getDate()}</span>
            <span className={`${styles.dot} ${hasEvents ? styles.dotActive : ''}`} />
          </button>
        );
      })}
    </div>
  );
}
