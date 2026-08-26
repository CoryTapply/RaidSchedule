import * as React from 'react';
import { ButtonProps } from './Button';

/**
 * A square Button holding a single glyph. Same heights as Button (30/38/46), so
 * it lines up in a control row without adjustment.
 */
export interface IconButtonProps extends Omit<ButtonProps, 'icon'> {
  /** Required — the control has no visible text, so this becomes aria-label. */
  label: string;
  children?: React.ReactNode;
}
export function IconButton(props: IconButtonProps): JSX.Element;
