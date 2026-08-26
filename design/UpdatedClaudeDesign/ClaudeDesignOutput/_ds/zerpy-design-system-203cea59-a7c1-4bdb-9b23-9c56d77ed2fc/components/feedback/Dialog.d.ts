import * as React from 'react';

/**
 * A modal overlay: 8px radius, 22px blur, the deep shadow, over a blurred
 * scrim. Escape and a backdrop click both close it.
 *
 * @startingPoint section="Feedback" subtitle="Dialog, toast, tooltip and empty state" viewport="700x300"
 */
export interface DialogProps {
  open?: boolean;
  title: React.ReactNode;
  /** Two sentences at most. If it needs three, the UI is wrong. */
  description?: React.ReactNode;
  onClose?: () => void;
  /** Right-aligned buttons — cancel first, the action last. */
  footer?: React.ReactNode;
  width?: number | string;
  children?: React.ReactNode;
}
export function Dialog(props: DialogProps): JSX.Element | null;
