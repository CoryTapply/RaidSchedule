import type { RaidEvent } from '@raidschedule/shared';
import type { CalendarDay } from './useCalendarState.js';
import { DayCell } from './DayCell.js';
import styles from '../styles/calendar.module.css';

export interface DayGridProps {
  days: CalendarDay[];
  showAnnotations: boolean;
  onSelectEvent: (event: RaidEvent) => void;
  onEnterDay: (lockoutWeekKey: string) => void;
  onLeaveDay: () => void;
}

export function DayGrid({ days, showAnnotations, onSelectEvent, onEnterDay, onLeaveDay }: DayGridProps) {
  return (
    <div className={styles.dayGrid}>
      {days.map((day) => (
        <DayCell
          key={day.key}
          day={day}
          showAnnotation={showAnnotations}
          onSelectEvent={onSelectEvent}
          onEnter={onEnterDay}
          onLeave={onLeaveDay}
        />
      ))}
    </div>
  );
}
