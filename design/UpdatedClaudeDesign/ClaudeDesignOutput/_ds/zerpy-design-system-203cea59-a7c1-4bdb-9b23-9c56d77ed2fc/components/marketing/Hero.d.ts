import * as React from 'react';

/**
 * The opening section of a marketing or portfolio page: micro-label eyebrow,
 * gradient display title, lede, actions, and an optional right-hand slot.
 *
 * An intentional addition — the source system had no marketing surface. It is
 * assembled entirely from existing tokens; nothing new was invented for it.
 *
 * @startingPoint section="Marketing" subtitle="Gradient display title, lede and actions" viewport="960x420"
 */
export interface HeroProps extends React.HTMLAttributes<HTMLElement> {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  lede?: React.ReactNode;
  /** A CtaButton plus at most one secondary Button. */
  actions?: React.ReactNode;
  /** Right-hand slot: a Panel, a screenshot, a stat cluster. */
  aside?: React.ReactNode;
  align?: 'left' | 'center';
}
export function Hero(props: HeroProps): JSX.Element;
