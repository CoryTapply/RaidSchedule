import * as React from 'react';

/**
 * Multi-line text. Same well as Input, 84px minimum, vertically resizable.
 */
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}
export function Textarea(props: TextareaProps): JSX.Element;
