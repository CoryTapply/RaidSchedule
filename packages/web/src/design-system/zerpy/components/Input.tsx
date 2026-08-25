import type { InputHTMLAttributes } from 'react';

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'className'>;

export function Input(props: InputProps) {
  return <input className="zp-in" {...props} />;
}
