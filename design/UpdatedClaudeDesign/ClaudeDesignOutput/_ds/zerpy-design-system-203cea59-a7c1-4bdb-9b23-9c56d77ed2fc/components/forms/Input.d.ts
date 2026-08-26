import * as React from 'react';

/**
 * The 38px text field. Recessed: a dark well with a hairline border, blurred
 * behind so the ground shows through.
 *
 * @startingPoint section="Controls" subtitle="Fields, selects and their states" viewport="700x210"
 */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Red border. Pair with an error on the wrapping Field. */
  invalid?: boolean;
}
export function Input(props: InputProps): JSX.Element;
