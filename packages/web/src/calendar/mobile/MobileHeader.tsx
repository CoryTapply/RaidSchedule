import { addDays, lockoutStart } from '@raidschedule/shared';
import { Button } from '../../design-system/zerpy/components/index.js';
import zerpyLogo from '../../design-system/zerpy/assets/zerpy-accent.svg';
import { MobileWeekStrip } from './MobileWeekStrip.js';
import { MONTH_FULL, MONTH_SHORT } from './monthNames.js';
import type { MobileCalendarDay } from './useMobileCalendarState.js';
import styles from './MobileHeader.module.css';

export interface MobileHeaderProps {
  days: MobileCalendarDay[];
  activeDate: Date;
  activeDayKey: string;
  todayKey: string;
  onToday: () => void;
  onSelectDay: (key: string) => void;
}

function lockoutRangeLabel(start: Date): string {
  const end = addDays(start, 6);
  return `Lockout ${MONTH_SHORT[start.getMonth()]} ${start.getDate()} – ${MONTH_SHORT[end.getMonth()]} ${end.getDate()}`;
}

export function MobileHeader({ days, activeDate, activeDayKey, todayKey, onToday, onSelectDay }: MobileHeaderProps) {
  const isToday = activeDayKey === todayKey;

  return (
    <header className={styles.header}>
      <div className={styles.titleRow}>
        <a href="https://zerpy.dev" target="_blank" rel="noopener noreferrer" className={styles.logoLink}>
          <img src={zerpyLogo} alt="Zerpy" className={styles.logo} />
        </a>
        <div className={styles.titleBlock}>
          <span className={styles.monthYear}>
            {MONTH_FULL[activeDate.getMonth()]} {activeDate.getFullYear()}
          </span>
          <span className={styles.lockoutLabel}>{lockoutRangeLabel(lockoutStart(activeDate))}</span>
        </div>
        <Button intent={isToday ? 'ghost' : 'primary'} size="sm" onClick={onToday}>
          Today
        </Button>
      </div>
      <MobileWeekStrip days={days} activeDate={activeDate} activeDayKey={activeDayKey} onSelectDay={onSelectDay} />
    </header>
  );
}
