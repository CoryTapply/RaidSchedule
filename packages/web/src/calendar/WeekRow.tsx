import { useMemo, type CSSProperties } from 'react';
import { computeRowWindow, DEFAULT_END_HOUR, DEFAULT_START_HOUR, type RaidEvent } from '@raidschedule/shared';
import type { CalendarDay } from './useCalendarState.js';
import { TimelineDayCell } from './TimelineDayCell.js';
import { hourLabel } from './format.js';
import styles from '../styles/calendar.module.css';

export interface WeekRowProps {
  days: CalendarDay[];
  onSelectEvent: (event: RaidEvent) => void;
  onEditEvent: (event: RaidEvent, e: { clientX: number; clientY: number }) => void;
  onEnterDay: (lockoutWeekKey: string) => void;
  onLeaveDay: () => void;
  onOpenComposer: (day: CalendarDay, e: { clientX: number; clientY: number }) => void;
}

export function WeekRow({ days, onSelectEvent, onEditEvent, onEnterDay, onLeaveDay, onOpenComposer }: WeekRowProps) {
  const window = useMemo(
    () => computeRowWindow(days.flatMap((d) => d.events), DEFAULT_START_HOUR, DEFAULT_END_HOUR),
    [days],
  );

  const hours = useMemo(() => {
    const list: number[] = [];
    for (let h = window.startHour; h <= window.endHour; h++) list.push(h);
    return list;
  }, [window]);

  const rowStyle = { '--row-height-hours': window.endHour - window.startHour } as CSSProperties;

  return (
    <div className={styles.weekRow} style={rowStyle}>
      <div className={styles.gutter}>
        {hours.map((h) => (
          <span key={h} className={styles.hourLabel} style={{ '--offset-hours': h - window.startHour } as CSSProperties}>
            {hourLabel(h)}
          </span>
        ))}
      </div>
      {days.map((day) => (
        <TimelineDayCell
          key={day.key}
          day={day}
          window={window}
          hours={hours}
          onSelectEvent={onSelectEvent}
          onEditEvent={onEditEvent}
          onEnter={onEnterDay}
          onLeave={onLeaveDay}
          onOpenComposer={onOpenComposer}
        />
      ))}
    </div>
  );
}
