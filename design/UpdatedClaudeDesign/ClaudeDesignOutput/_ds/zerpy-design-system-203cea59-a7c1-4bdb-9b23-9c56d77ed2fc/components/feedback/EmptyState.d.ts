import * as React from 'react';

/**
 * Nothing here yet. Carries the system's only dashed border, so emptiness is
 * legible without a color.
 */
export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  /** A unicode glyph in a small accent tile — "—", "0", "✕". */
  glyph?: React.ReactNode;
  title: React.ReactNode;
  /** Name the actual gesture: "Right-click any day to schedule a raid." */
  body?: React.ReactNode;
  action?: React.ReactNode;
}
export function EmptyState(props: EmptyStateProps): JSX.Element;
