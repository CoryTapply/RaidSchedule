import type { CSSProperties, KeyboardEvent, MouseEvent } from 'react';
import type { RaidEvent } from '@raidschedule/shared';
import { classColor } from '../classColors.js';
import { timeRangeLabel } from '../format.js';
import styles from './eventCardStyle.module.css';

export interface MobileEventCardProps {
  event: RaidEvent;
  onSelect: (event: RaidEvent) => void;
}

export function MobileEventCard({ event, onSelect }: MobileEventCardProps) {
  const color = classColor(event.character.className);
  const variantClass = event.status === 'confirmed' ? styles.confirmed : styles.pending;
  const style = { '--class-color': color } as CSSProperties;

  function handleClick(e: MouseEvent) {
    // Long-pressing the card itself would otherwise also register as a tap on release.
    e.stopPropagation();
    onSelect(event);
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    onSelect(event);
  }

  return (
    <div
      className={`${styles.card} ${variantClass}`}
      style={style}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className={styles.stripe} />
      <div className={styles.rail} />
      <div className={styles.content}>
        <span className={styles.title}>{event.raidName}</span>
        <span className={styles.time}>{timeRangeLabel(event.startsAt, event.endsAt)}</span>
        <span className={styles.characterLine}>
          <span className={styles.characterTick} />
          {event.character.name} · {event.character.className}
        </span>
      </div>
      {event.isHorde && <div className={styles.factionMark} data-testid="horde-mark" />}
    </div>
  );
}
