import type { RaidEvent } from '@raidschedule/shared';
import { weekdayLabels } from '../format.js';
import { MobileEventCard } from './MobileEventCard.js';
import { MONTH_SHORT } from './monthNames.js';
import { useLongPress } from './useLongPress.js';
import type { MobileCalendarDay } from './useMobileCalendarState.js';
import styles from './MobileDayRow.module.css';

const WEEKDAYS = weekdayLabels('week');

export interface MobileDayRowProps {
  day: MobileCalendarDay;
  isActiveLockout: boolean;
  onSelectEvent: (event: RaidEvent) => void;
  onOpenComposer: (day: MobileCalendarDay) => void;
  rowRef: (el: HTMLDivElement | null) => void;
}

export function MobileDayRow({ day, isActiveLockout, onSelectEvent, onOpenComposer, rowRef }: MobileDayRowProps) {
  const longPress = useLongPress(() => onOpenComposer(day));
  const isEmpty = day.events.length === 0;
  const showMonthTag = day.isFirstOfMonth || day.isFirstRow;

  const rowClassName = [
    styles.row,
    isEmpty ? styles.rowEmpty : '',
    isActiveLockout ? styles.rowActiveLockout : '',
    day.isToday ? styles.rowToday : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div ref={rowRef} className={rowClassName} data-testid={`day-row-${day.key}`} {...longPress}>
      <div className={styles.gutter}>
        <span className={`${styles.weekday} ${day.isToday ? styles.today : ''}`}>{WEEKDAYS[day.date.getDay()]}</span>
        <span className={`${styles.numeral} ${isEmpty ? styles.numeralEmpty : ''} ${day.isToday ? styles.today : ''}`}>
          {day.date.getDate()}
        </span>
        {showMonthTag && <span className={styles.monthTag}>{MONTH_SHORT[day.date.getMonth()]}</span>}
      </div>
      <div className={styles.content}>
        {isEmpty ? (
          <span className={styles.emptyLine}>{day.isToday ? 'No raids today — hold to add' : 'No raids'}</span>
        ) : (
          <div className={styles.cards}>
            {day.events.map((event) => (
              <MobileEventCard key={event.id} event={event} onSelect={onSelectEvent} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
