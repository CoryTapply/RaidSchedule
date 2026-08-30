import type { MouseEvent } from 'react';
import type { RaidEvent } from '@raidschedule/shared';
import { Badge, Button, IconButton } from '../../design-system/zerpy/components/index.js';
import { classColor } from '../classColors.js';
import { timeRangeLabel } from '../format.js';
import { MONTH_SHORT } from './monthNames.js';
import { fadeEnter, slideUpEnter } from './motionStyles.js';
import styles from './MobileDetailSheet.module.css';

export interface MobileDetailSheetProps {
  event: RaidEvent;
  onClose: () => void;
  onEdit: (event: RaidEvent) => void;
}

function shortDateLabel(iso: string): string {
  const d = new Date(iso);
  return `${MONTH_SHORT[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

export function MobileDetailSheet({ event, onClose, onEdit }: MobileDetailSheetProps) {
  const color = classColor(event.character.className);
  const isConfirmed = event.status === 'confirmed';

  function stopPropagation(e: MouseEvent) {
    e.stopPropagation();
  }

  return (
    <div className={styles.scrim} style={fadeEnter} onClick={onClose}>
      <div className={styles.sheet} style={slideUpEnter} onClick={stopPropagation} role="dialog" aria-modal="true">
        <div className={styles.header}>
          <span className={styles.rail} style={{ background: color }} />
          <div className={styles.headerText}>
            <span className={styles.title}>{event.raidName}</span>
            <span className={styles.dateTime}>
              {shortDateLabel(event.startsAt)} · {timeRangeLabel(event.startsAt, event.endsAt)}
            </span>
          </div>
          <IconButton label="Close" intent="ghost" size="sm" onClick={onClose}>
            ✕
          </IconButton>
        </div>

        <div className={styles.characterRow}>
          <span className={styles.characterRail} style={{ background: color }} />
          <div className={styles.characterInfo}>
            <span className={styles.characterName}>{event.character.name}</span>
            <span className={styles.className}>{event.character.className}</span>
          </div>
          <Badge tone={isConfirmed ? 'success' : 'warning'}>{isConfirmed ? 'Confirmed' : 'Signed up'}</Badge>
        </div>

        <Button intent="primary" size="sm" onClick={() => onEdit(event)} className={styles.editButton}>
          Edit
        </Button>
      </div>
    </div>
  );
}
