import type { ButtonHTMLAttributes } from 'react';

export type ButtonIntent = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  intent?: ButtonIntent;
  size?: ButtonSize;
}

const INTENT_CLASS: Record<ButtonIntent, string> = {
  primary: 'zp-primary',
  secondary: 'zp-secondary',
  ghost: 'zp-ghost',
  danger: 'zp-danger',
};

const SIZE_CLASS: Partial<Record<ButtonSize, string>> = {
  sm: 'zp-sm',
  lg: 'zp-lg',
};

export function Button({ intent = 'secondary', size = 'md', type = 'button', ...props }: ButtonProps) {
  const className = ['zp-btn', INTENT_CLASS[intent], SIZE_CLASS[size]].filter(Boolean).join(' ');
  return <button type={type} className={className} {...props} />;
}
