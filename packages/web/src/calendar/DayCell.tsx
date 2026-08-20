import type { RaidEvent } from '@raidschedule/shared';
import type { CalendarDay } from './useCalendarState.js';
import { EventCard } from './EventCard.js';
import { dayLabel } from './format.js';
import styles from '../styles/calendar.module.css';

export interface DayCellProps {
  day: CalendarDay;
  showAnnotation: boolean;
  onSelectEvent: (event: RaidEvent) => void;
  onEnter: (lockoutWeekKey: string) => void;
  onLeave: () => void;
  onOpenComposer: (day: CalendarDay, e: { clientX: number; clientY: number }) => void;
}

export function DayCell({ day, showAnnotation, onSelectEvent, onEnter, onLeave, onOpenComposer }: DayCellProps) {
  const annotation = day.isLockoutReset ? 'reset' : day.isToday ? 'today' : '';

  return (
    <div
      className={`${styles.dayCell} ${day.isHighlighted ? styles.dayCellHighlighted : ''} ${day.isToday ? styles.dayCellToday : ''}`}
      onMouseEnter={() => onEnter(day.lockoutWeekKey)}
      onMouseLeave={onLeave}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onOpenComposer(day, e);
      }}
    >
      <div className={styles.dayNumberRow}>
        <span className={`${styles.dayNumber} ${day.isToday ? styles.dayNumberToday : ''}`}>
          {dayLabel(day.date, day.isFirstOfMonth)}
        </span>
        {showAnnotation && annotation && <span className={styles.dayAnnotation}>{annotation}</span>}
      </div>
      <div className={styles.eventList}>
        {day.events.map((event) => (
          <EventCard key={event.id} event={event} onSelect={onSelectEvent} />
        ))}
      </div>
    </div>
  );
}
