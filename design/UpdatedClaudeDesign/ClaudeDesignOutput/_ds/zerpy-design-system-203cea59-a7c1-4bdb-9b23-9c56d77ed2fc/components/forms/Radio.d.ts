import * as React from 'react';

/**
 * One of several, where the options need a line of explanation each. For short
 * labels use a SegmentedControl instead.
 */
export interface RadioProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  checked?: boolean;
  onChange?: (next: true) => void;
  label?: React.ReactNode;
  disabled?: boolean;
}
export function Radio(props: RadioProps): JSX.Element;
