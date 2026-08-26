import type { CSSProperties } from 'react';
import { Panel, Skeleton } from '../design-system/zerpy/components/index.js';
import styles from '../styles/calendar.module.css';

const WEEK_COUNT = 3;
const DAY_COUNT = 7;
const HOUR_LABEL_OFFSETS = [0, 3, 6];

const rowStyle = { '--row-height-hours': 8 } as CSSProperties;

function SkeletonDayCell({ eventOffsets }: { eventOffsets: number[] }) {
  return (
    <div className={styles.dayCell}>
      <Skeleton width={20} height={9} style={{ position: 'absolute', top: 5, left: 8 }} />
      {eventOffsets.map((top, i) => (
        <Skeleton key={i} width="85%" height={40} style={{ position: 'absolute', top, left: 4, right: 4, width: 'auto' }} />
      ))}
    </div>
  );
}

export function CalendarSkeleton() {
  return (
    <Panel padding="0">
      <div className={styles.gridColumns}>
        <div className={styles.headerRow}>
          <div className={styles.gutterCorner} />
          {Array.from({ length: DAY_COUNT }).map((_, i) => (
            <div key={i} className={styles.weekdayCell}>
              <Skeleton width={24} height={9} />
            </div>
          ))}
        </div>
        {Array.from({ length: WEEK_COUNT }).map((_, weekIndex) => (
          <div key={weekIndex} className={styles.weekRow} style={rowStyle}>
            <div className={styles.gutter}>
              {HOUR_LABEL_OFFSETS.map((offsetHours) => (
                <Skeleton
                  key={offsetHours}
                  width={28}
                  height={8}
                  style={{ position: 'absolute', right: 10, top: 22 + offsetHours * 30 }}
                />
              ))}
            </div>
            {Array.from({ length: DAY_COUNT }).map((_, dayIndex) => (
              <SkeletonDayCell key={dayIndex} eventOffsets={(dayIndex + weekIndex) % 3 === 0 ? [40] : [40, 90]} />
            ))}
          </div>
        ))}
      </div>
    </Panel>
  );
}
