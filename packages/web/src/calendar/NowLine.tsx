import { useEffect, useState, type CSSProperties } from 'react';
import type { RowWindow } from '@raidschedule/shared';
import styles from '../styles/calendar.module.css';

export interface NowLineProps {
  window: RowWindow;
  /** Override the live clock with a fixed "HH:MM" (24-hour) time. Test-only — no UI sets this. */
  nowTime?: string;
}

const NOW_TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

function resolveMinutesOfDay(now: Date, nowTime?: string): number {
  const match = nowTime ? NOW_TIME_PATTERN.exec(nowTime) : null;
  if (match) {
    return Number(match[1]) * 60 + Number(match[2]);
  }
  return now.getHours() * 60 + now.getMinutes();
}

export function NowLine({ window, nowTime }: NowLineProps) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  const minutesOfDay = resolveMinutesOfDay(now, nowTime);
  const topHours = (minutesOfDay - window.startHour * 60) / 60;

  if (topHours < 0 || topHours > window.endHour - window.startHour) {
    return null;
  }

  return (
    <div className={styles.nowLine} style={{ '--top-hours': topHours } as CSSProperties} aria-hidden="true">
      <div className={styles.nowLineBar} />
      <div className={styles.nowLineDot} />
    </div>
  );
}
