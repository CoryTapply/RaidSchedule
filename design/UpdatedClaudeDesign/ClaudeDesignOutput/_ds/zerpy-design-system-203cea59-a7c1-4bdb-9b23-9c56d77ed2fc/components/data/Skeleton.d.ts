import * as React from 'react';

/**
 * A placeholder that holds the exact box of the thing arriving, so nothing
 * shifts when it lands. Content shimmers; controls pulse.
 */
export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: number | string;
  height?: number | string;
  radius?: number | string;
  /** shimmer for content, pulse for controls — a shimmering button reads as clickable. */
  shape?: 'shimmer' | 'pulse';
}
export function Skeleton(props: SkeletonProps): JSX.Element;
