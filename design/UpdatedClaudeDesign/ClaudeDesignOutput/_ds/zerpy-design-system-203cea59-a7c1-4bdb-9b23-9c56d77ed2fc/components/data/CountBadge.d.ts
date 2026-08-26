import * as React from 'react';

/**
 * A number in a pill. The one pill-radius element in a 4px-radius system,
 * because a count is a quantity and quantities are round.
 */
export interface CountBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** danger for things needing attention; accent for plain totals. */
  tone?: 'accent' | 'danger';
  children?: React.ReactNode;
}
export function CountBadge(props: CountBadgeProps): JSX.Element;
