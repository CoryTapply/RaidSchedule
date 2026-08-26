import { NavControls } from './NavControls.js';
import { rangeLabel } from './format.js';
import styles from '../styles/calendar.module.css';
import zerpyLogo from '../design-system/zerpy/assets/zerpy-accent.svg';

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
      <div className={styles.titleRow}>
        <a href="https://zerpy.dev" target="_blank" rel="noopener noreferrer" className={styles.logoLink}>
          <img src={zerpyLogo} alt="Zerpy" className={styles.logo} />
        </a>
        <div className={styles.titleBlock}>
          <div className={styles.title}>Raid Calendar</div>
          <div className={styles.rangeLabel}>{rangeLabel(rangeStart, rangeEnd)}</div>
        </div>
      </div>
      <NavControls onPrev={onPrev} onNext={onNext} onToday={onToday} />
    </div>
  );
}
