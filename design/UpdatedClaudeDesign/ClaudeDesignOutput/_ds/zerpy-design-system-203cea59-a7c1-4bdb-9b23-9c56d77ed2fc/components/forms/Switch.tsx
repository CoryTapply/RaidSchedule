import React from 'react';

export interface SwitchProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  checked?: boolean;
  onChange?: (next: boolean) => void;
  label?: React.ReactNode;
  description?: React.ReactNode;
}

export function Switch({ checked = false, onChange, label, description, disabled = false, ...rest }: SwitchProps) {
  const track = (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label ? undefined : 'Toggle'}
      disabled={disabled}
      onClick={onChange ? () => onChange(!checked) : undefined}
      className="zp-switch"
      style={{
        border: `1px solid ${checked ? 'var(--zp-line-accent)' : 'var(--zp-line-strong)'}`,
        background: checked ? 'var(--zp-accent-tint-strong)' : 'var(--zp-surface-2)',
        boxShadow: checked ? 'var(--zp-accent-glow)' : 'none',
        opacity: disabled ? 0.45 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
      {...rest}
    >
      <span
        style={{
          position: 'absolute', top: 2, left: checked ? 20 : 2, width: 16, height: 16, borderRadius: '50%',
          background: checked ? 'var(--zp-accent-200)' : 'var(--zp-text-4)',
          transition: 'left var(--zp-dur) var(--zp-ease)',
        }}
      />
    </button>
  );
  if (!label) return track;
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--zp-space-5)', maxWidth: 420 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <span style={{ font: 'var(--zp-text-label)', color: 'var(--zp-text)' }}>{label}</span>
        {description ? <span style={{ font: 'var(--zp-text-sm)', color: 'var(--zp-text-4)' }}>{description}</span> : null}
      </div>
      {track}
    </div>
  );
}
