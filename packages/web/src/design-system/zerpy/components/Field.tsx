import type { ReactNode } from 'react';
import styles from './Field.module.css';

export interface FieldProps {
  label: string;
  hint?: string;
  children: ReactNode;
}

/**
 * A plain div, not a <label> — a Field's content is sometimes more than one
 * control (e.g. a color swatch plus a SegmentedControl), and HTML only lets
 * an implicit <label> target a single labelable descendant; wrapping
 * multi-control content in one would silently mislabel the first control
 * with the whole subtree's accessible name. Callers pass their own
 * aria-label to the actual control instead.
 */
export function Field({ label, hint, children }: FieldProps) {
  return (
    <div className={styles.field}>
      <span className={styles.label}>{label}</span>
      {children}
      {hint && <span className={styles.hint}>{hint}</span>}
    </div>
  );
}
