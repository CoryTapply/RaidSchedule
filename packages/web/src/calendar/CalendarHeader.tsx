import { NavControls } from './NavControls.js';
import { rangeLabel } from './format.js';
import styles from '../styles/calendar.module.css';

export interface CalendarHeaderProps {
  rangeStart: Date;
  rangeEnd: Date;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

export function CalendarHeader({ rangeStart, rangeEnd, onPrev, onNext, onToday }: CalendarHeaderProps) {
  return (
    <div className={styles.header}>
      <div className={styles.titleBlock}>
        <div className={styles.title}>Raid Calendar</div>
        <div className={styles.rangeLabel}>{rangeLabel(rangeStart, rangeEnd)}</div>
      </div>
      <NavControls onPrev={onPrev} onNext={onNext} onToday={onToday} />
    </div>
  );
}
