import * as React from 'react';

/**
 * A 16px box with a 2px radius and a unicode check. Multi-select, or a single
 * form value the user submits.
 */
export interface CheckboxProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  checked?: boolean;
  onChange?: (next: boolean) => void;
  label?: React.ReactNode;
  disabled?: boolean;
}
export function Checkbox(props: CheckboxProps): JSX.Element;
