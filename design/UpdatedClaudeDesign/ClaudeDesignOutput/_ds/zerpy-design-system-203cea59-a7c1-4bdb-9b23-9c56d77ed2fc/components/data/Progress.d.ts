import * as React from 'react';

/**
 * A 6px pill track. Determinate with a value, indeterminate without one.
 */
export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 0–100. Pass null or omit for the indeterminate sweep. */
  value?: number | null;
  label?: React.ReactNode;
  /** The number itself — "14 / 20 marks". Tabular figures. */
  caption?: React.ReactNode;
}
export function Progress(props: ProgressProps): JSX.Element;
