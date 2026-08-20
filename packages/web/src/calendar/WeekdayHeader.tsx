import { weekdayLabels } from './format.js';
import styles from '../styles/calendar.module.css';

export interface WeekdayHeaderProps {
  full: boolean;
}

export function WeekdayHeader({ full }: WeekdayHeaderProps) {
  return (
    <div className={styles.weekdayHeader}>
      {weekdayLabels(full).map((label) => (
        <div key={label} className={styles.weekdayCell}>
          {label}
        </div>
      ))}
    </div>
  );
}
