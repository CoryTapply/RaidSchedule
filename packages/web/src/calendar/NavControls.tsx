import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import styles from '../styles/calendar.module.css';

export interface NavControlsProps {
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

export function NavControls({ onPrev, onNext, onToday }: NavControlsProps) {
  return (
    <div className={styles.controls}>
      <div className={styles.navGroup}>
        <button type="button" className={styles.navButton} onClick={onPrev} aria-label="Previous week">
          <CaretLeft weight="bold" />
        </button>
        <button type="button" className={styles.navButton} onClick={onNext} aria-label="Next week">
          <CaretRight weight="bold" />
        </button>
      </div>
      <button type="button" className={styles.todayButton} onClick={onToday}>
        Today
      </button>
    </div>
  );
}
