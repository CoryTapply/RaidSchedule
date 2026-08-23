import type { CSSProperties } from 'react';
import type { RaidEvent, TimelinePlacement } from '@raidschedule/shared';
import { classColor } from './classColors.js';
import { timeLabel } from './format.js';
import styles from '../styles/eventCard.module.css';

export interface EventBlockProps {
  placement: TimelinePlacement<RaidEvent>;
  onSelect: (event: RaidEvent) => void;
}

export function EventBlock({ placement, onSelect }: EventBlockProps) {
  const { event, topHours, heightHours, laneIndex, laneCount } = placement;
  const color = classColor(event.character.className);
  const variantClass = event.status === 'confirmed' ? styles.confirmed : styles.pending;

  const style = {
    '--class-color': color,
    '--top-hours': topHours,
    '--height-hours': heightHours,
    '--lane-index': laneIndex,
    '--lane-count': laneCount,
  } as CSSProperties;

  return (
    <div
      className={`${styles.block} ${variantClass}`}
      style={style}
      onClick={() => onSelect(event)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(event);
        }
      }}
    >
      <div className={styles.rail} />
      {event.isHorde && <div className={styles.hordeMark} data-testid="horde-mark" />}
      <span className={styles.raidName}>{event.raidName}</span>
      <span className={styles.metaLine}>
        {timeLabel(event.startsAt)} · {event.character.name}
      </span>
    </div>
  );
}
