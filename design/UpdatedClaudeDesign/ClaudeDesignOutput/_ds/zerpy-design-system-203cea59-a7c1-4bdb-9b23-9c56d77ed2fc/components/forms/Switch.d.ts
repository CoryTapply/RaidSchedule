import * as React from 'react';

/**
 * A setting that takes effect immediately. With a label it renders as a full
 * settings row — label and description left, track right.
 */
export interface SwitchProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  checked?: boolean;
  onChange?: (next: boolean) => void;
  /** Omit for a bare track, e.g. inside a table cell. */
  label?: React.ReactNode;
  /** One line stating the effect. */
  description?: React.ReactNode;
  disabled?: boolean;
}
export function Switch(props: SwitchProps): JSX.Element;
