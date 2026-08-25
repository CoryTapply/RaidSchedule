import type { RaidEvent } from '@raidschedule/shared';
import { Panel } from '../design-system/zerpy/components/index.js';
import type { CalendarDay } from './useCalendarState.js';
import { WeekRow } from './WeekRow.js';
import { weekdayLabels } from './format.js';
import styles from '../styles/calendar.module.css';

export interface CalendarGridProps {
  days: CalendarDay[];
  onSelectEvent: (event: RaidEvent) => void;
  onEditEvent: (event: RaidEvent, e: { clientX: number; clientY: number }) => void;
  onEnterDay: (lockoutWeekKey: string) => void;
  onLeaveDay: () => void;
  onOpenComposer: (day: CalendarDay, e: { clientX: number; clientY: number }) => void;
}

function chunkIntoWeeks(days: CalendarDay[]): CalendarDay[][] {
  const weeks: CalendarDay[][] = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));
  return weeks;
}

export function CalendarGrid({ days, onSelectEvent, onEditEvent, onEnterDay, onLeaveDay, onOpenComposer }: CalendarGridProps) {
  const weeks = chunkIntoWeeks(days);

  return (
    <Panel>
      <div className={styles.gridColumns}>
        <div className={styles.headerRow}>
          <div className={styles.gutterCorner} />
          {weekdayLabels().map((label) => (
            <div key={label} className={styles.weekdayCell}>
              {label}
            </div>
          ))}
        </div>
        {weeks.map((weekDays) => (
          <WeekRow
            key={weekDays[0]!.key}
            days={weekDays}
            onSelectEvent={onSelectEvent}
            onEditEvent={onEditEvent}
            onEnterDay={onEnterDay}
            onLeaveDay={onLeaveDay}
            onOpenComposer={onOpenComposer}
          />
        ))}
      </div>
    </Panel>
  );
}
