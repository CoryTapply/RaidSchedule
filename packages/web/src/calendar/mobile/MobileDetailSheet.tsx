import type { MouseEvent } from 'react';
import { useState } from 'react';
import type { RaidEvent } from '@raidschedule/shared';
import { Badge, Button, IconButton } from '../../design-system/zerpy/components/index.js';
import { classColor } from '../classColors.js';
import { timeRangeLabel } from '../format.js';
import { MONTH_SHORT } from './monthNames.js';
import styles from './MobileDetailSheet.module.css';

export interface MobileDetailSheetProps {
  /** null when closed. Stays mounted for the page's whole lifetime — see `active` below —
   *  so closing slides it out instead of unmounting it. */
  event: RaidEvent | null;
  onClose: () => void;
  onEdit: (event: RaidEvent) => void;
}

function shortDateLabel(iso: string): string {
  const d = new Date(iso);
  return `${MONTH_SHORT[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

export function MobileDetailSheet({ event, onClose, onEdit }: MobileDetailSheetProps) {
  // Remembers the last non-null event so the sheet keeps rendering real content while it
  // slides out after `event` goes back to null — an unmounted sheet can't animate its own exit.
  const [active, setActive] = useState<RaidEvent | null>(event);
  if (event && event !== active) {
    setActive(event);
  }
  const isOpen = event !== null;

  function stopPropagation(e: MouseEvent) {
    e.stopPropagation();
  }

  const color = active ? classColor(active.character.className) : undefined;
  const isConfirmed = active?.status === 'confirmed';

  return (
    <div className={`${styles.scrim} ${isOpen ? styles.scrimOpen : ''}`} onClick={onClose} inert={!isOpen}>
      <div className={`${styles.sheet} ${isOpen ? styles.sheetOpen : ''}`} onClick={stopPropagation} role="dialog" aria-modal="true">
        {active && (
          <>
            <div className={styles.header}>
              <span className={styles.rail} style={{ background: color }} />
              <div className={styles.headerText}>
                <span className={styles.title}>{active.raidName}</span>
                <span className={styles.dateTime}>
                  {shortDateLabel(active.startsAt)} · {timeRangeLabel(active.startsAt, active.endsAt)}
                </span>
              </div>
              <IconButton label="Close" intent="ghost" size="sm" onClick={onClose}>
                ✕
              </IconButton>
            </div>

            <div className={styles.characterRow}>
              <span className={styles.characterRail} style={{ background: color }} />
              <div className={styles.characterInfo}>
                <span className={styles.characterName}>{active.character.name}</span>
                <span className={styles.className}>{active.character.className}</span>
              </div>
              <Badge tone={isConfirmed ? 'success' : 'warning'}>{isConfirmed ? 'Confirmed' : 'Signed up'}</Badge>
            </div>

            <Button intent="primary" size="sm" onClick={() => onEdit(active)} className={styles.editButton}>
              Edit
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
