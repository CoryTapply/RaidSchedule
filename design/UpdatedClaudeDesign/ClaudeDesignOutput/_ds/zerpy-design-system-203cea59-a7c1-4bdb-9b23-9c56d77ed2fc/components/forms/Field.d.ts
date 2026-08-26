import * as React from 'react';

/**
 * The label / control / hint wrapper. Every field in the system is wrapped in
 * one, so labels are consistently the mono micro-label and hints never compete
 * with the value.
 */
export interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: React.ReactNode;
  /** States the effect of the setting, not a restatement of the label. */
  hint?: React.ReactNode;
  /** States the rule that was broken. Replaces the hint when present. */
  error?: React.ReactNode;
  htmlFor?: string;
  children?: React.ReactNode;
}
export function Field(props: FieldProps): JSX.Element;
