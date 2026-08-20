import type { CSSProperties } from 'react';
import { X } from '@phosphor-icons/react';
import type { RaidEvent } from '@raidschedule/shared';
import { classColor } from './classColors.js';
import { dateLabel, timeLabel } from './format.js';
import eventCardStyles from '../styles/eventCard.module.css';
import styles from '../styles/dialog.module.css';

export interface EventDetailDialogProps {
  event: RaidEvent;
  onClose: () => void;
}

export function EventDetailDialog({ event, onClose }: EventDetailDialogProps) {
  const color = classColor(event.character.className);
  const isConfirmed = event.status === 'confirmed';
  const variantClass = isConfirmed ? eventCardStyles.confirmed : eventCardStyles.pending;
  const badgeColorClass = isConfirmed ? eventCardStyles.badgeColorConfirmed : eventCardStyles.badgeColorPending;
  const initial = event.character.className === 'Unknown' ? '?' : event.character.className[0];

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <div className={styles.titleRow}>
          <div className={styles.titleBlock}>
            <span className={styles.raidName}>{event.raidName}</span>
            <span className={styles.dateLine}>
              {dateLabel(event.startsAt)} · {timeLabel(event.startsAt)}
            </span>
          </div>
          <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Close">
            <X weight="bold" />
          </button>
        </div>
        <div
          className={`${styles.characterCard} ${variantClass}`}
          style={{ '--class-color': color } as CSSProperties}
        >
          <span className={`${styles.badge} ${badgeColorClass}`}>{initial}</span>
          <div className={styles.characterInfo}>
            <span className={styles.characterName}>
              {event.character.name} · {event.character.className}
            </span>
            <span className={styles.statusLabel}>{event.status === 'confirmed' ? 'Roster confirmed' : 'Signed up'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
