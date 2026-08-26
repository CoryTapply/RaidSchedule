import * as React from 'react';

/**
 * The emphasis CTA: 56px tall with a light source that moves. One per screen,
 * and only on a screen that has a single obvious next action.
 *
 * @startingPoint section="Controls" subtitle="The 56px emphasis CTA with its orbiting ring" viewport="700x150"
 */
export interface CtaButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** orbit: a 6s conic ring travelling the border. breathing: a 4.5s halo. */
  variant?: 'orbit' | 'orbit-breathing' | 'breathing' | 'plain';
  children?: React.ReactNode;
}
export function CtaButton(props: CtaButtonProps): JSX.Element;
