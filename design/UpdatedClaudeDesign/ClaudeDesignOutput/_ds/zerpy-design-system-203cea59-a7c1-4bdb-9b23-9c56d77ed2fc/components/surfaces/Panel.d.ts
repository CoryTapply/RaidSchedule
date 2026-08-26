import * as React from 'react';

/**
 * A translucent surface. The three elevations are the system's entire depth
 * vocabulary: flat rows inside a panel, panels on the page, overlays above
 * everything. Never nest a blurred panel inside another — a panel inside a
 * panel is flat.
 */
export interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  elevation?: 'flat' | 'panel' | 'overlay';
  /** Pass "0" when the panel owns a grid or list that draws its own padding. */
  padding?: number | string;
  children?: React.ReactNode;
}
export function Panel(props: PanelProps): JSX.Element;
