import { useLayoutEffect, useRef } from 'react';
import { WOW_CLASSES, type RosterStatus, type WowClass } from '@raidschedule/shared';
import { Button, Field, IconButton, Input, Select, SegmentedControl, TimeSelect } from '../design-system/zerpy/components/index.js';
import { classColor } from './classColors.js';
import { hhmmToTimeValue, timeValueToHHMM, type ComposerState } from './composer.js';
import styles from '../styles/composer.module.css';

export interface EventComposerProps {
  composer: ComposerState;
  onChange: (patch: Partial<ComposerState>) => void;
  onCancel: () => void;
  onSave: () => void;
  onDelete: () => void;
}

const STATUS_OPTIONS = ['Confirmed', 'Signed up'] as const;
const FACTION_OPTIONS = ['Alliance', 'Horde'] as const;
const VISIBILITY_OPTIONS = ['Visible', 'Hidden'] as const;

function statusToLabel(status: RosterStatus): string {
  return status === 'confirmed' ? 'Confirmed' : 'Signed up';
}

function labelToStatus(label: string): RosterStatus {
  return label === 'Confirmed' ? 'confirmed' : 'pending';
}

const MODE_LABEL: Record<ComposerState['mode'], string> = {
  create: 'New event',
  'edit-custom': 'Edit event',
  'edit-raid-helper': 'Edit Raid-Helper event',
};

export function EventComposer({ composer, onChange, onCancel, onSave, onDelete }: EventComposerProps) {
  const canSave = composer.title.trim().length > 0 && !composer.saving;
  const classHex = classColor(composer.cls);
  const isConfirmed = composer.status === 'confirmed';
  const railBackground = isConfirmed
    ? `linear-gradient(180deg, ${classHex}, color-mix(in srgb, ${classHex} 35%, transparent))`
    : `linear-gradient(180deg, color-mix(in srgb, ${classHex} 55%, transparent), color-mix(in srgb, ${classHex} 12%, transparent))`;
  const factionColor = composer.isHorde ? 'var(--zp-faction-horde)' : 'var(--zp-faction-alliance)';
  const timeEditable = composer.mode !== 'edit-raid-helper';
  const canDelete = composer.mode === 'edit-custom';
  const fromApi = composer.mode === 'edit-raid-helper';
  const isNew = composer.mode === 'create';

  const panelRef = useRef<HTMLDivElement>(null);

  // The panel's height varies with content (mode, save errors, etc.), so the anchor point
  // computed at click time can't account for it in advance — re-clamp against the actual
  // rendered size on every render instead, keeping the footer's Save button on screen
  // without resorting to an internal scrollbar.
  useLayoutEffect(() => {
    if (composer.centered) return;
    const panel = panelRef.current;
    if (!panel) return;
    const margin = 12;
    const maxLeft = Math.max(margin, window.innerWidth - panel.offsetWidth - margin);
    const maxTop = Math.max(margin, window.innerHeight - panel.offsetHeight - margin);
    panel.style.left = `${Math.min(composer.x, maxLeft)}px`;
    panel.style.top = `${Math.min(composer.y, maxTop)}px`;
  });

  return (
    <div
      className={`${styles.overlay} ${composer.centered ? styles.overlayCentered : ''}`}
      onClick={onCancel}
      onContextMenu={(e) => {
        e.preventDefault();
        onCancel();
      }}
    >
      <div
        ref={panelRef}
        className={`${styles.panel} ${composer.centered ? styles.panelCentered : ''}`}
        style={composer.centered ? undefined : { left: composer.x, top: composer.y }}
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
          <span className={styles.headerRail} style={{ background: classHex }} />
          <div className={styles.headerText}>
            <span className={styles.modeLabel}>{MODE_LABEL[composer.mode]}</span>
            <span className={styles.headerDate}>{composer.dateLabel}</span>
          </div>
          <IconButton label="Close" intent="ghost" size="sm" onClick={onCancel}>
            ✕
          </IconButton>
        </div>

        <div className={styles.body}>
          <Field label="Title">
            <Input
              aria-label="Title"
              placeholder="Nerub-ar Palace"
              value={composer.title}
              onChange={(e) => onChange({ title: e.target.value })}
              autoFocus
            />
          </Field>

          {timeEditable ? (
            <div className={styles.timeRow}>
              <Field label="Start">
                <TimeSelect
                  aria-label="Start"
                  required
                  value={hhmmToTimeValue(composer.start)}
                  onChange={(v) => {
                    if (v != null) onChange({ start: timeValueToHHMM(v) });
                  }}
                />
              </Field>
              <Field label="End">
                <TimeSelect
                  aria-label="End"
                  required
                  relativeTo={hhmmToTimeValue(composer.start)}
                  align="end"
                  value={hhmmToTimeValue(composer.end)}
                  onChange={(v) => {
                    if (v != null) onChange({ end: timeValueToHHMM(v) });
                  }}
                />
              </Field>
            </div>
          ) : (
            <Field label="Time" hint="Set in Raid-Helper.">
              <div className={styles.timeWell}>
                <span className={styles.timeWellText}>{composer.timeLabel}</span>
              </div>
            </Field>
          )}

          <Field label="Character">
            <Input
              aria-label="Character"
              placeholder="Character name"
              value={composer.character}
              onChange={(e) => onChange({ character: e.target.value })}
            />
          </Field>

          <Field label="Class">
            <div className={styles.swatchRow}>
              <span className={styles.swatch} style={{ background: classHex }} />
              <div className={styles.swatchField}>
                <Select
                  aria-label="Class"
                  value={composer.cls}
                  onChange={(e) => onChange({ cls: e.target.value as WowClass })}
                >
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
              <span className={styles.swatch} style={{ background: factionColor }} />
              <div className={styles.swatchField}>
                <SegmentedControl
                  aria-label="Faction"
                  options={FACTION_OPTIONS}
                  value={composer.isHorde ? 'Horde' : 'Alliance'}
                  onChange={(v) => onChange({ isHorde: v === 'Horde' })}
                />
              </div>
            </div>
          </Field>

          <Field label="Status">
            <div className={styles.swatchRow}>
              <span className={styles.swatch} style={{ background: railBackground }}>
                {!isConfirmed && <span className={styles.swatchStripe} />}
              </span>
              <div className={styles.swatchField}>
                <SegmentedControl
                  aria-label="Status"
                  options={STATUS_OPTIONS}
                  value={statusToLabel(composer.status)}
                  onChange={(v) => onChange({ status: labelToStatus(v) })}
                />
              </div>
            </div>
          </Field>

          {fromApi && (
            <Field label="Visibility" hint="Hide this from the calendar without deleting it in Raid-Helper.">
              <SegmentedControl
                aria-label="Visibility"
                options={VISIBILITY_OPTIONS}
                value={composer.hidden ? 'Hidden' : 'Visible'}
                onChange={(v) => onChange({ hidden: v === 'Hidden' })}
              />
            </Field>
          )}

          {composer.saveError && (
            <span className={styles.saveError} role="alert">
              {composer.saveError}
            </span>
          )}
        </div>

        <div className={styles.footer}>
          {canDelete && (
            <Button intent="ghost" size="sm" onClick={onDelete} disabled={composer.saving}>
              Delete
            </Button>
          )}
          {fromApi && <span className={styles.footerNote}>From Raid-Helper</span>}
          {isNew && <span className={styles.footerNote}>Esc to dismiss</span>}
          <div className={styles.footerActions}>
            <Button intent="ghost" size="sm" onClick={onCancel}>
              Cancel
            </Button>
            <Button intent="primary" size="sm" disabled={!canSave} onClick={onSave}>
              {composer.saving ? 'Saving…' : isNew ? 'Add event' : 'Save'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
