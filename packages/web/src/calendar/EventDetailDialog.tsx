import type { RaidEvent } from '@raidschedule/shared';
import { Badge, Button, Dialog } from '../design-system/zerpy/components/index.js';
import { classColor } from './classColors.js';
import { dateLabel, timeLabel } from './format.js';
import styles from '../styles/dialog.module.css';

export interface EventDetailDialogProps {
  event: RaidEvent;
  onClose: () => void;
  /** Opens the composer centered in the viewport, not anchored to the Edit button. */
  onEdit: (event: RaidEvent) => void;
}

export function EventDetailDialog({ event, onClose, onEdit }: EventDetailDialogProps) {
  const color = classColor(event.character.className);
  const isConfirmed = event.status === 'confirmed';
  const timeRange = event.endsAt
    ? `${timeLabel(event.startsAt)} – ${timeLabel(event.endsAt)}`
    : timeLabel(event.startsAt);

  const handleEdit = () => onEdit(event);

  return (
    <Dialog title={event.raidName} description={`${dateLabel(event.startsAt)} · ${timeRange}`} onClose={onClose} width="380px">
      <div className={styles.body}>
        <div className={styles.characterRow}>
          <span className={styles.rail} style={{ background: color }} />
          <div className={styles.characterInfo}>
            <span className={styles.characterName}>{event.character.name}</span>
            <span className={styles.className}>{event.character.className}</span>
          </div>
          <span className={styles.badge}>
            <Badge tone={isConfirmed ? 'success' : 'warning'}>{isConfirmed ? 'Confirmed' : 'Signed up'}</Badge>
          </span>
        </div>
        <div className={styles.footer}>
          {event.source === 'raid-helper' ? (
            <span className={styles.footerNote}>Times come from Raid-Helper and can't be changed here.</span>
          ) : (
            <span />
          )}
          <Button intent="ghost" size="sm" onClick={handleEdit}>
            Edit
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
