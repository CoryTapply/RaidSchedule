import * as React from 'react';

/**
 * The one button. Four intents, three sizes, an optional leading icon and a
 * loading state that swaps the icon for a spinner and locks the control.
 *
 * @startingPoint section="Controls" subtitle="Buttons in four intents and three sizes" viewport="700x190"
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** primary is an accent-tinted outline with a soft glow — one per view. */
  intent?: 'primary' | 'secondary' | 'ghost' | 'danger';
  /** 30 / 38 / 46px tall. 38 is the system default height. */
  size?: 'sm' | 'md' | 'lg';
  /** Replaces the icon with a spinner and disables the button. */
  loading?: boolean;
  disabled?: boolean;
  /** Leading glyph or icon element. */
  icon?: React.ReactNode;
  children?: React.ReactNode;
}
export function Button(props: ButtonProps): JSX.Element;
