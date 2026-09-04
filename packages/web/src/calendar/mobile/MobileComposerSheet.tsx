import { WOW_CLASSES, type WowClass } from '@raidschedule/shared';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Button, Field, Input, SegmentedControl, Select, TimeSelect, formatTime } from '../../design-system/zerpy/components/index.js';
import { classColor } from '../classColors.js';
import { hhmmToTimeValue, timeValueToHHMM } from '../composer.js';
import cardStyles from './eventCardStyle.module.css';
import type { MobileComposerState } from './mobileComposer.js';
import { useDragToDismiss } from './useDragToDismiss.js';
import styles from './MobileComposerSheet.module.css';

export interface MobileComposerSheetProps {
  /** null when closed. The sheet stays mounted for the page's whole lifetime — see `active` below — so closing slides it out instead of unmounting it, and the first real open isn't also paying for the sheet's first mount. */
  composer: MobileComposerState | null;
  onChange: (patch: Partial<MobileComposerState>) => void;
  /** Wraps useMobileCalendarState's setComposerStart, which carries End along by the current duration. */
  onStartChange: (start: string) => void;
  onCancel: () => void;
  onSave: () => void;
  onDelete: () => void;
}

const STATUS_OPTIONS = ['Confirmed', 'Signed up'] as const;
const FACTION_OPTIONS = ['Alliance', 'Horde'] as const;
const VISIBILITY_OPTIONS = ['Visible', 'Hidden'] as const;

/**
 * Placeholder content rendered inert, off-screen, before the composer has ever really opened.
 * Never shown or saved — it only exists so mounting TimeSelect/SegmentedControl/etc. (which
 * measure themselves via useLayoutEffect + ResizeObserver) happens at page load instead of
 * competing with the CSS transition on the very first real open, which is what made that
 * first slide choppy while every later one was smooth.
 */
const WARMUP_COMPOSER: MobileComposerState = {
  mode: 'create',
  key: '',
  dateLabel: '',
  title: '',
  start: '20:00',
  end: '23:00',
  timeLabel: '',
  character: '',
  cls: 'Druid',
  status: 'confirmed',
  isHorde: false,
  hidden: false,
  saving: false,
  saveError: null,
};

function statusToLabel(status: MobileComposerState['status']): string {
  return status === 'confirmed' ? 'Confirmed' : 'Signed up';
}

function labelToStatus(label: string): MobileComposerState['status'] {
  return label === 'Confirmed' ? 'confirmed' : 'pending';
}

export function MobileComposerSheet({ composer, onChange, onStartChange, onCancel, onSave, onDelete }: MobileComposerSheetProps) {
  const { style: dragStyle, handleProps } = useDragToDismiss(onCancel);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Remembers the last non-null draft so the sheet keeps rendering real content while it
  // slides out after `composer` goes back to null — an unmounted sheet can't animate its own
  // exit. Starts from WARMUP_COMPOSER, not null, so the sheet's full content (and every
  // control's own mount-time setup) exists from the page's first render, not deferred to the
  // first real open. Updating state during render like this (rather than in an effect) is the
  // sanctioned way to derive state from a prop change without an extra commit — see "Storing
  // information from previous renders" in the React docs.
  const [active, setActive] = useState<MobileComposerState>(() => composer ?? WARMUP_COMPOSER);
  if (composer && composer !== active) {
    setActive(composer);
  }
  const isOpen = composer !== null;

  // Never autofocus a field on open — that forces the keyboard up immediately, which shrinks
  // the visual viewport and can trigger the iOS input-zoom bug. Focus the dialog container
  // itself instead (tabIndex={-1} below) and let the user tap the field they want.
  useEffect(() => {
    if (isOpen) dialogRef.current?.focus();
  }, [isOpen]);

  const canSave = active.title.trim().length > 0 && !active.saving;
  const timeEditable = active.mode !== 'edit-raid-helper';
  const canDelete = active.mode === 'edit-custom';
  const fromApi = active.mode === 'edit-raid-helper';
  const isNew = active.mode === 'create';
  const classHex = classColor(active.cls);
  const isConfirmed = active.status === 'confirmed';
  const variantClass = isConfirmed ? cardStyles.confirmed : cardStyles.pending;
  const previewStyle = { '--class-color': classHex } as CSSProperties;
  const factionColor = active.isHorde ? 'var(--zp-faction-horde)' : 'var(--zp-faction-alliance)';

  return (
    <div className={`${styles.sheetHost} ${isOpen ? styles.sheetHostOpen : ''}`} inert={!isOpen}>
      <div ref={dialogRef} className={styles.sheet} style={dragStyle} role="dialog" aria-modal="true" tabIndex={-1}>
        <div className={styles.header}>
          <Button intent="ghost" size="sm" onClick={onCancel}>
            Cancel
          </Button>
          <div className={styles.headerCenter} {...handleProps}>
            <span className={styles.handle} />
            <span className={styles.modeLabel}>{isNew ? 'New event' : 'Edit event'}</span>
            <span className={styles.dateLabel}>{active.dateLabel}</span>
          </div>
          <Button intent="primary" size="sm" disabled={!canSave} onClick={onSave}>
            {isNew ? 'Add' : 'Save'}
          </Button>
        </div>

        <div className={styles.body}>
          <div className={`${cardStyles.card} ${variantClass} ${styles.preview}`} style={previewStyle}>
            <div className={cardStyles.stripe} />
            <div className={cardStyles.rail} />
            <div className={cardStyles.content}>
              <span className={cardStyles.title}>{active.title.trim() || 'Untitled raid'}</span>
              <span className={cardStyles.time}>
                {formatTime(hhmmToTimeValue(active.start))} · {active.character.trim() || '—'}
              </span>
            </div>
          </div>

          <Field label="Title" hint="Shown on the calendar block.">
            <Input
              aria-label="Title"
              placeholder="Black Temple"
              enterKeyHint="next"
              autoCapitalize="words"
              value={active.title}
              onChange={(e) => onChange({ title: e.target.value })}
            />
          </Field>

          {timeEditable ? (
            <div className={styles.timeRow}>
              <Field label="Start">
                <TimeSelect
                  aria-label="Start"
                  required
                  value={hhmmToTimeValue(active.start)}
                  onChange={(v) => {
                    if (v != null) onStartChange(timeValueToHHMM(v));
                  }}
                />
              </Field>
              <Field label="End">
                <TimeSelect
                  aria-label="End"
                  required
                  relativeTo={hhmmToTimeValue(active.start)}
                  align="end"
                  value={hhmmToTimeValue(active.end)}
                  onChange={(v) => {
                    if (v != null) onChange({ end: timeValueToHHMM(v) });
                  }}
                />
              </Field>
            </div>
          ) : (
            <Field label="Time" hint="Set in Raid-Helper.">
              <div className={styles.timeWell}>{active.timeLabel}</div>
            </Field>
          )}

          <Field label="Character">
            <Input
              aria-label="Character"
              placeholder="Character name"
              enterKeyHint="done"
              autoCapitalize="words"
              autoCorrect="off"
              spellCheck={false}
              value={active.character}
              onChange={(e) => onChange({ character: e.target.value })}
            />
          </Field>

          <Field label="Class">
            <div className={styles.swatchRow}>
              <span className={styles.classSwatch} style={{ background: classHex }} />
              <div className={styles.swatchField}>
                <Select aria-label="Class" value={active.cls} onChange={(e) => onChange({ cls: e.target.value as WowClass })}>
                  {WOW_CLASSES.map((cls) => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          </Field>

          <Field label="Faction">
            <div className={styles.swatchRow}>
              <span className={styles.factionSwatch} style={{ background: factionColor }} />
              <div className={styles.swatchField}>
                <SegmentedControl
                  aria-label="Faction"
                  options={FACTION_OPTIONS}
                  value={active.isHorde ? 'Horde' : 'Alliance'}
                  onChange={(v) => onChange({ isHorde: v === 'Horde' })}
                />
              </div>
            </div>
          </Field>

          <Field label="Status">
            <SegmentedControl
              aria-label="Status"
              options={STATUS_OPTIONS}
              value={statusToLabel(active.status)}
              onChange={(v) => onChange({ status: labelToStatus(v) })}
            />
          </Field>

          {fromApi && (
            <Field label="Visibility" hint="Hide this from the calendar without deleting it in Raid-Helper.">
              <SegmentedControl
                aria-label="Visibility"
                options={VISIBILITY_OPTIONS}
                value={active.hidden ? 'Hidden' : 'Visible'}
                onChange={(v) => onChange({ hidden: v === 'Hidden' })}
              />
            </Field>
          )}

          {active.saveError && (
            <span className={styles.saveError} role="alert">
              {active.saveError}
            </span>
          )}

          {fromApi && <p className={styles.footerNote}>From Raid-Helper. Times come from the bot and can't be changed here.</p>}

          {canDelete && (
            <Button intent="danger" size="sm" onClick={onDelete} disabled={active.saving} className={styles.deleteButton}>
              Delete event
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
