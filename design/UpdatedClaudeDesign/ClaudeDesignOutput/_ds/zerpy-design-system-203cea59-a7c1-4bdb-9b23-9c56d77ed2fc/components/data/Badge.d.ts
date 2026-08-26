import * as React from 'react';

/**
 * State, in a word. A glowing 5px dot plus an uppercase mono label on a 16%
 * semantic tint — the system's status vocabulary.
 *
 * @startingPoint section="Data" subtitle="Badges, tags and counts" viewport="700x170"
 */
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  /** The dot carries the state; drop it only when the label is the whole point. */
  dot?: boolean;
  children?: React.ReactNode;
}
export function Badge(props: BadgeProps): JSX.Element;
