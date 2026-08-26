import React from 'react';

export interface RadioProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  checked?: boolean;
  onChange?: (next: true) => void;
  label?: React.ReactNode;
}

export function Radio({ checked = false, onChange, label, disabled = false, ...rest }: RadioProps) {
  return (
    <button
      role="radio"
      aria-checked={checked}
      disabled={disabled}
      onClick={onChange ? () => onChange(true) : undefined}
      className="zp-choice"
      {...rest}
    >
      <span
        style={{
          width: 16, height: 16, flex: '0 0 auto', borderRadius: '50%',
          border: `1px solid ${checked ? 'var(--zp-line-accent)' : 'var(--zp-line-strong)'}`,
          background: checked ? 'var(--zp-accent-tint)' : 'var(--zp-surface-choice)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all var(--zp-dur) var(--zp-ease)',
        }}
      >
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: checked ? 'var(--zp-accent-200)' : 'transparent' }} />
      </span>
      {label ? <span style={{ font: 'var(--zp-text-md)', color: checked ? 'var(--zp-text)' : 'var(--zp-text-2)' }}>{label}</span> : null}
    </button>
  );
}
