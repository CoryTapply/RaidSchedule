import * as React from 'react';

/**
 * A single line naming what a glyph does. Opens on hover and on focus, at
 * 120ms — the fastest thing in the system.
 */
export interface TooltipProps {
  /** One short line. If it needs two, it is a Popover. */
  content: React.ReactNode;
  placement?: 'top' | 'bottom';
  children?: React.ReactNode;
}
export function Tooltip(props: TooltipProps): JSX.Element;
