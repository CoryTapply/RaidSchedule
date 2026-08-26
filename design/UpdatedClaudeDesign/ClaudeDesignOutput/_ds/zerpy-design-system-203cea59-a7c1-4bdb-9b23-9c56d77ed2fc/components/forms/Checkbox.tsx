import React from 'react';

export interface CheckboxProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  checked?: boolean;
  onChange?: (next: boolean) => void;
  label?: React.ReactNode;
}

export function Checkbox({ checked = false, onChange, label, disabled = false, ...rest }: CheckboxProps) {
  return (
    <button
      role="checkbox"
      aria-checked={checked}
      disabled={disabled}
      onClick={onChange ? () => onChange(!checked) : undefined}
      className="zp-choice"
      {...rest}
    >
      <span
        style={{
          width: 16, height: 16, flex: '0 0 auto', borderRadius: 'var(--zp-radius-xs)',
          border: `1px solid ${checked ? 'var(--zp-line-accent)' : 'var(--zp-line-strong)'}`,
          background: checked ? 'var(--zp-accent-tint-strong)' : 'var(--zp-surface-choice)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          font: '600 10px var(--zp-font-ui)', color: 'var(--zp-accent-100)',
          transition: 'all var(--zp-dur) var(--zp-ease)',
        }}
      >
        {checked ? '✓' : ''}
      </span>
      {label ? <span style={{ font: 'var(--zp-text-md)', color: checked ? 'var(--zp-text)' : 'var(--zp-text-2)' }}>{label}</span> : null}
    </button>
  );
}
