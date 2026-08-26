import { Button, IconButton } from '../design-system/zerpy/components/index.js';
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
        <IconButton label="Previous three weeks" onClick={onPrev}>
          ‹
        </IconButton>
        <IconButton label="Next three weeks" onClick={onNext}>
          ›
        </IconButton>
      </div>
      <Button intent="primary" onClick={onToday}>
        Today
      </Button>
    </div>
  );
}
