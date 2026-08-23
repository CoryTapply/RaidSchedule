import type { CSSProperties } from 'react';
import { X } from '@phosphor-icons/react';
import { WOW_CLASSES, type WowClass } from '@raidschedule/shared';
import { classColor } from './classColors.js';
import type { ComposerState } from './composer.js';
import styles from '../styles/composer.module.css';

export interface EventComposerProps {
  composer: ComposerState;
  onChange: (patch: Partial<ComposerState>) => void;
  onCancel: () => void;
  onSave: () => void;
}

export function EventComposer({ composer, onChange, onCancel, onSave }: EventComposerProps) {
  const canSave = composer.title.trim().length > 0 && !composer.saving;
  const characterColor = classColor(composer.cls);

  return (
    <div
      className={styles.overlay}
      onClick={onCancel}
      onContextMenu={(e) => {
        e.preventDefault();
        onCancel();
      }}
    >
      <div
        className={styles.panel}
        style={{ left: composer.x, top: composer.y }}
        onClick={(e) => e.stopPropagation()}
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onKeyDown={(e) => {
          if (e.key !== 'Enter' || e.target instanceof HTMLButtonElement) return;
          e.preventDefault();
          if (canSave) onSave();
        }}
      >
        <div className={styles.header}>
          <div className={styles.headerText}>
            <span className={styles.headerTitle}>New event</span>
            <span className={styles.headerDate}>{composer.dateLabel}</span>
          </div>
          <button type="button" className={styles.closeButton} onClick={onCancel} aria-label="Close">
            <X weight="bold" />
          </button>
        </div>

        <div className={styles.body}>
          <div className={styles.field}>
            <span className={styles.label}>Title</span>
            <input
              className={styles.input}
              type="text"
              placeholder="Black Temple"
              value={composer.title}
              onChange={(e) => onChange({ title: e.target.value })}
              autoFocus
            />
          </div>

          <div className={styles.timeRow}>
            <div className={styles.field}>
              <span className={styles.label}>Start</span>
              <input
                className={styles.input}
                type="time"
                value={composer.start}
                onChange={(e) => onChange({ start: e.target.value })}
              />
            </div>
            <div className={styles.field}>
              <span className={styles.label}>End</span>
              <input
                className={styles.input}
                type="time"
                value={composer.end}
                onChange={(e) => onChange({ end: e.target.value })}
              />
            </div>
          </div>

          <div className={styles.field}>
            <span className={styles.label}>Character</span>
            <div className={styles.characterRow}>
              <span className={styles.chip} style={{ '--class-color': characterColor } as CSSProperties} />
              <input
                className={styles.input}
                type="text"
                placeholder="Character name"
                value={composer.character}
                onChange={(e) => onChange({ character: e.target.value })}
              />
            </div>
          </div>

          <div className={styles.field}>
            <span className={styles.label}>Class</span>
            <div className={styles.characterRow}>
              <span className={styles.chip} style={{ '--class-color': characterColor } as CSSProperties} />
              <select
                className={styles.input}
                aria-label="Class"
                value={composer.cls}
                onChange={(e) => onChange({ cls: e.target.value as WowClass })}
              >
                {WOW_CLASSES.map((cls: WowClass) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.field}>
            <span className={styles.label}>Status</span>
            <div className={styles.statusToggle}>
              <button
                type="button"
                className={`${styles.statusOption} ${composer.status === 'pending' ? styles.statusOptionSelected : ''}`}
                onClick={() => onChange({ status: 'pending' })}
                aria-pressed={composer.status === 'pending'}
              >
                Tentative
              </button>
              <button
                type="button"
                className={`${styles.statusOption} ${composer.status === 'confirmed' ? styles.statusOptionSelected : ''}`}
                onClick={() => onChange({ status: 'confirmed' })}
                aria-pressed={composer.status === 'confirmed'}
              >
                Signed up
              </button>
            </div>
          </div>

          <div className={styles.field}>
            <span className={styles.label}>Faction</span>
            <div className={styles.statusToggle}>
              <button
                type="button"
                className={`${styles.statusOption} ${styles.factionOptionAlliance} ${!composer.isHorde ? styles.statusOptionSelected : ''}`}
                onClick={() => onChange({ isHorde: false })}
                aria-pressed={!composer.isHorde}
              >
                Alliance
              </button>
              <button
                type="button"
                className={`${styles.statusOption} ${styles.factionOptionHorde} ${composer.isHorde ? styles.statusOptionSelected : ''}`}
                onClick={() => onChange({ isHorde: true })}
                aria-pressed={composer.isHorde}
              >
                Horde
              </button>
            </div>
          </div>

          <div className={styles.recurrenceRow}>
            <span className={styles.recurrenceDot} />
            <span>One-time event</span>
          </div>

          {composer.saveError && (
            <div style={{ color: '#e5484d', fontSize: 13 }} role="alert">
              {composer.saveError}
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <button type="button" className={styles.cancelButton} onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            className={`${styles.saveButton} ${canSave ? '' : styles.saveButtonDisabled}`}
            onClick={onSave}
            disabled={!canSave}
          >
            {composer.saving ? 'Saving…' : 'Add event'}
          </button>
        </div>
      </div>
    </div>
  );
}
