import * as React from 'react';

/**
 * A label the user can select or remove — a filter, a facet, an attribute.
 * The optional 3px rail is how identity colors (class, faction) enter the UI.
 */
export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  selected?: boolean;
  /** A CSS color for the 3px identity rail — usually a --zp-class-* token. */
  rail?: string;
  /** Adds a ✕ affordance. */
  onDismiss?: () => void;
  children?: React.ReactNode;
}
export function Tag(props: TagProps): JSX.Element;
