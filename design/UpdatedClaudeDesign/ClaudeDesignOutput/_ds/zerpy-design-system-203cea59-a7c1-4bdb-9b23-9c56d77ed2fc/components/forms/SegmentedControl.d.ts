import * as React from 'react';

export interface SegmentOption { value: string; label: string }

/**
 * Two to four short, mutually exclusive options in one 30px row. The system's
 * view switcher and its substitute for tabs — there is no Tabs component.
 *
 * @startingPoint section="Controls" subtitle="Choices: segmented, switch, checkbox, radio" viewport="700x180"
 */
export interface SegmentedControlProps extends React.HTMLAttributes<HTMLDivElement> {
  options?: Array<string | SegmentOption>;
  value?: string;
  onChange?: (next: string) => void;
}
export function SegmentedControl(props: SegmentedControlProps): JSX.Element;
