import * as React from 'react';

export interface PopoverItem {
  label: string;
  onClick?: () => void;
  tone?: 'default' | 'danger';
}

/**
 * An overflow menu or a small composer, anchored to the trigger. Absolutely
 * positioned — the trigger must be position:relative.
 */
export interface PopoverProps {
  open?: boolean;
  onClose?: () => void;
  /** Menu rows. Omit and pass children for a form or a custom body. */
  items?: PopoverItem[];
  align?: 'left' | 'right';
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export function Popover(props: PopoverProps): JSX.Element | null;
