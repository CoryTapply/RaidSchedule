import type { CSSProperties } from 'react';
import { layoutDayEvents, type RaidEvent, type RowWindow } from '@raidschedule/shared';
import type { CalendarDay } from './useCalendarState.js';
import { EventBlock } from './EventBlock.js';
import { dayLabel } from './format.js';
import styles from '../styles/calendar.module.css';

export interface TimelineDayCellProps {
  day: CalendarDay;
  window: RowWindow;
  hours: number[];
  onSelectEvent: (event: RaidEvent) => void;
  onEditEvent: (event: RaidEvent, e: { clientX: number; clientY: number }) => void;
  onEnter: (lockoutWeekKey: string) => void;
  onLeave: () => void;
  onOpenComposer: (day: CalendarDay, e: { clientX: number; clientY: number }) => void;
}

export function TimelineDayCell({
  day,
  window,
  hours,
  onSelectEvent,
  onEditEvent,
  onEnter,
  onLeave,
  onOpenComposer,
}: TimelineDayCellProps) {
  const placements = layoutDayEvents(day.events, window);

  return (
    <div
      className={`${styles.dayCell} ${day.isHighlighted ? styles.dayCellHighlighted : ''}`}
      onMouseEnter={() => onEnter(day.lockoutWeekKey)}
      onMouseLeave={onLeave}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onOpenComposer(day, e);
      }}
    >
      {hours.map((h) => (
        <div key={h} className={styles.hourLine} style={{ '--offset-hours': h - window.startHour } as CSSProperties} />
      ))}
      <div className={`${styles.dayNumber} ${day.isToday ? styles.dayNumberToday : ''}`}>
        {dayLabel(day.date, day.isFirstOfMonth)}
      </div>
      {placements.map((placement) => (
        <EventBlock key={placement.event.id} placement={placement} onSelect={onSelectEvent} onEdit={onEditEvent} />
      ))}
    </div>
  );
}
