import { useState, type CSSProperties } from 'react';
import { X } from '@phosphor-icons/react';
import type { RaidEvent } from '@raidschedule/shared';
import { classColor } from './classColors.js';
import { dateLabel, timeLabel } from './format.js';
import eventCardStyles from '../styles/eventCard.module.css';
import styles from '../styles/dialog.module.css';

export interface EventDetailDialogProps {
  event: RaidEvent;
  onClose: () => void;
  onDelete?: () => void;
  deleting?: boolean;
  deleteError?: string | null;
  onConfirm?: () => void;
  confirming?: boolean;
  confirmError?: string | null;
  onToggleHorde?: () => void;
  togglingHorde?: boolean;
  hordeError?: string | null;
}

export function EventDetailDialog({
  event,
  onClose,
  onDelete,
  deleting = false,
  deleteError = null,
  onConfirm,
  confirming = false,
  confirmError = null,
  onToggleHorde,
  togglingHorde = false,
  hordeError = null,
}: EventDetailDialogProps) {
  const color = classColor(event.character.className);
  const isConfirmed = event.status === 'confirmed';
  const variantClass = isConfirmed ? eventCardStyles.confirmed : eventCardStyles.pending;
  const badgeColorClass = isConfirmed ? eventCardStyles.badgeColorConfirmed : eventCardStyles.badgeColorPending;
  const initial = event.character.className === 'Unknown' ? '?' : event.character.className[0];
  const isCustom = event.source === 'custom';
  const isRaidHelper = event.source === 'raid-helper';
  const [confirmingDelete, setConfirmingDelete] = useState(false);

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
        <div className={styles.factionRow}>
          <span className={`${styles.factionBar} ${event.isHorde ? styles.factionBarHorde : styles.factionBarAlliance}`} />
          <span>{event.isHorde ? 'Horde' : 'Alliance'}</span>
        </div>
        {isCustom && (
          <div className={styles.footer}>
            {(confirmError ?? deleteError ?? hordeError) && (
              <span className={styles.deleteError} role="alert">
                {confirmError ?? deleteError ?? hordeError}
              </span>
            )}
            {event.status === 'pending' && (
              <button type="button" className={styles.confirmButton} onClick={onConfirm} disabled={confirming}>
                {confirming ? 'Confirming…' : 'Mark confirmed'}
              </button>
            )}
            {onToggleHorde && (
              <button type="button" className={styles.confirmButton} onClick={onToggleHorde} disabled={togglingHorde}>
                {togglingHorde ? 'Updating…' : event.isHorde ? 'Remove Horde tag' : 'Mark as Horde'}
              </button>
            )}
            <button
              type="button"
              className={`${styles.deleteButton} ${confirmingDelete ? styles.deleteButtonConfirm : ''}`}
              onClick={() => (confirmingDelete ? onDelete?.() : setConfirmingDelete(true))}
              disabled={deleting}
            >
              {deleting ? 'Deleting…' : confirmingDelete ? 'Confirm delete' : 'Delete event'}
            </button>
          </div>
        )}
        {isRaidHelper && onToggleHorde && (
          <div className={styles.footer}>
            {hordeError && (
              <span className={styles.deleteError} role="alert">
                {hordeError}
              </span>
            )}
            <button type="button" className={styles.confirmButton} onClick={onToggleHorde} disabled={togglingHorde}>
              {togglingHorde ? 'Updating…' : event.isHorde ? 'Remove Horde tag' : 'Mark as Horde'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
