import * as React from 'react';

/**
 * The section header pattern: mono micro-label eyebrow, h2 title, optional
 * one-line description, and a right-aligned action.
 */
export interface SectionHeadingProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Uppercase mono micro-label. Two or three words at most. */
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Usually a Button or a SegmentedControl. */
  action?: React.ReactNode;
}
export function SectionHeading(props: SectionHeadingProps): JSX.Element;
