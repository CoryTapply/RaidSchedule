import * as React from 'react';

export interface SelectOption { value: string; label: string }

/**
 * The native select in the system's field skin. Native on purpose — a custom
 * dropdown for a list of thirteen classes buys nothing.
 */
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean;
  /** Strings become value and label alike. Omit and pass <option> children. */
  options?: Array<string | SelectOption>;
}
export function Select(props: SelectProps): JSX.Element;
