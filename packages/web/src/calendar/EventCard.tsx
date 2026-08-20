import type { CSSProperties } from 'react';
import type { RaidEvent } from '@raidschedule/shared';
import hordeIcon from '../assets/horde-icon.svg';
import { classColor } from './classColors.js';
import { timeLabel } from './format.js';
import styles from '../styles/eventCard.module.css';

export interface EventCardProps {
  event: RaidEvent;
  onSelect: (event: RaidEvent) => void;
}

export function isHordeTitle(raidName: string): boolean {
  return /horde/i.test(raidName);
}

export function EventCard({ event, onSelect }: EventCardProps) {
  const color = classColor(event.character.className);
  const isConfirmed = event.status === 'confirmed';
  const variantClass = isConfirmed ? styles.confirmed : styles.pending;
  const badgeColorClass = isConfirmed ? styles.badgeColorConfirmed : styles.badgeColorPending;
  const initial = event.character.className === 'Unknown' ? '?' : event.character.className[0];
  const isHorde = isHordeTitle(event.raidName);

  return (
    <div
      className={`${styles.card} ${variantClass}`}
      style={{ '--class-color': color } as CSSProperties}
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
      {isHorde && (
        <span className={styles.hordeBadge} title="Horde" aria-label="Horde">
          <img src={hordeIcon} alt="" className={styles.hordeBadgeIcon} />
        </span>
      )}
      <div className={styles.topRow}>
        <span className={`${styles.badge} ${badgeColorClass}`}>{initial}</span>
        <span className={styles.raidName}>{event.raidName}</span>
      </div>
      <div className={styles.metaRow}>
        <span>{timeLabel(event.startsAt)}</span>
        <span className={styles.metaDot} />
        <span>{event.character.name}</span>
      </div>
      <div className={styles.statusRow}>
        <span className={styles.statusLabel}>{event.status === 'confirmed' ? 'Confirmed' : 'Signed up'}</span>
      </div>
    </div>
  );
}
