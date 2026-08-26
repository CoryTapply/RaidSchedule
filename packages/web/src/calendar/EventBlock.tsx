import type { CSSProperties } from 'react';
import type { RaidEvent, TimelinePlacement } from '@raidschedule/shared';
import { classColor } from './classColors.js';
import { timeLabel } from './format.js';
import styles from '../styles/eventCard.module.css';

export interface EventBlockProps {
  placement: TimelinePlacement<RaidEvent>;
  onSelect: (event: RaidEvent) => void;
  onEdit: (event: RaidEvent, e: { clientX: number; clientY: number }) => void;
}

export function EventBlock({ placement, onSelect, onEdit }: EventBlockProps) {
  const { event, topHours, heightHours, laneIndex, laneCount } = placement;
  const color = classColor(event.character.className);
  const variantClass = event.status === 'confirmed' ? styles.confirmed : styles.pending;
  const showMeta = laneCount < 2;
  // A card up to 1.5h doesn't reliably have room for a separate
  // time·character line below the title (the two lines need ~38px of
  // content box, which isn't available until ~1.43h) — collapse it into
  // "Title · Character" on the title's own line instead, and shrink the
  // Horde mark to match.
  const isShort = heightHours <= 1.5;
  const isTiny = heightHours <= 0.5;

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
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onEdit(event, { clientX: e.clientX, clientY: e.clientY });
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(event);
        }
      }}
    >
      <div className={styles.stripe} />
      {event.isHorde && (
        <div className={`${styles.hordeMark} ${isShort ? styles.hordeMarkSmall : ''}`} data-testid="horde-mark" />
      )}
      <div className={styles.rail} />
      <div
        className={`${styles.content} ${isTiny ? styles.contentTight : ''} ${isShort && !isTiny ? styles.contentCenter : ''}`}
      >
        {showMeta && isShort ? (
          <span
            className={`${styles.raidName} ${styles.raidNameCombined} ${event.isHorde ? styles.hordeClearShort : ''}`}
          >
            <span className={styles.raidTitleText}>{event.raidName}</span>
            <span className={styles.metaInline}> · {event.character.name}</span>
          </span>
        ) : (
          <>
            <span className={styles.raidName}>{event.raidName}</span>
            {showMeta && (
              <span className={styles.metaLine}>
                {timeLabel(event.startsAt)} · {event.character.name}
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
}
