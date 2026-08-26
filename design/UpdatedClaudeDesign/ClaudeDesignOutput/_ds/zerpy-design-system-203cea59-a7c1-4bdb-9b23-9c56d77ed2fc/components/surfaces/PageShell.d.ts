import * as React from 'react';

/**
 * The page ground: the radial wash, the starfield overlay and the centered
 * column. Every full-page view in the system starts here — never hand-write
 * the gradient.
 */
export interface PageShellProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The starfield overlay. Automatically invisible in the light theme. */
  starfield?: boolean;
  /** Content column width. 1040 for reading, 1440 for dense app views. */
  maxWidth?: number | string;
  children?: React.ReactNode;
}
export function PageShell(props: PageShellProps): JSX.Element;
