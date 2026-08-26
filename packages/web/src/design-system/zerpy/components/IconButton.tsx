import type { ButtonHTMLAttributes } from 'react';
import styles from './IconButton.module.css';

export type IconButtonIntent = 'secondary' | 'ghost';
export type IconButtonSize = 'sm' | 'md' | 'lg';

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  label: string;
  intent?: IconButtonIntent;
  size?: IconButtonSize;
}

const SIZE_CLASS: Partial<Record<IconButtonSize, string>> = {
  sm: 'zp-sm',
  lg: 'zp-lg',
};

export function IconButton({ label, intent = 'secondary', size = 'md', type = 'button', ...props }: IconButtonProps) {
  const className = ['zp-btn', 'zp-icon', SIZE_CLASS[size], intent === 'ghost' ? styles.ghost : '']
    .filter(Boolean)
    .join(' ');
  return <button type={type} className={className} aria-label={label} {...props} />;
}
