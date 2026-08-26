import React from 'react';

const TONES = {
  success: ['var(--zp-success)', 'var(--zp-success-line)'],
  warning: ['var(--zp-warning)', 'var(--zp-warning-line)'],
  danger:  ['var(--zp-danger)',  'var(--zp-danger-line)'],
  info:    ['var(--zp-info)',    'var(--zp-info-line)'],
} as const;

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: 'success' | 'warning' | 'danger' | 'info';
  title: React.ReactNode;
  body?: React.ReactNode;
  onDismiss?: () => void;
}

export function Toast({ tone = 'info', title, body, onDismiss, style, ...rest }: ToastProps) {
  const [dot, border] = TONES[tone] || TONES.info;
  return (
    <div
      role="status"
      style={{
        minWidth: 264, padding: 'var(--zp-space-4)',
        borderRadius: 'var(--zp-radius-md)', border: `1px solid ${border}`,
        background: 'var(--zp-surface-overlay)', backdropFilter: 'blur(var(--zp-blur-lg))',
        boxShadow: 'var(--zp-elev-overlay)',
        display: 'flex', alignItems: 'flex-start', gap: 'var(--zp-space-3)',
        animation: 'zp-slide-in var(--zp-dur) var(--zp-ease)', ...style,
      }}
      {...rest}
    >
      <span style={{ width: 6, height: 6, marginTop: 6, borderRadius: '50%', background: dot, boxShadow: `0 0 8px ${dot}`, flexShrink: 0 }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
        <span style={{ font: 'var(--zp-text-label)', color: 'var(--zp-text)' }}>{title}</span>
        {body ? <span style={{ font: 'var(--zp-text-sm)', color: 'var(--zp-text-3)' }}>{body}</span> : null}
      </div>
      {onDismiss ? (
        <button onClick={onDismiss} aria-label="Dismiss" style={{ border: 'none', background: 'none', color: 'var(--zp-text-4)', font: 'var(--zp-text-sm)', cursor: 'pointer', padding: 0 }}>✕</button>
      ) : null}
    </div>
  );
}

export interface ToastStackProps extends React.HTMLAttributes<HTMLDivElement> {}

export function ToastStack({ children, style, ...rest }: ToastStackProps) {
  return (
    <div
      style={{ position: 'fixed', right: 'var(--zp-space-6)', bottom: 'var(--zp-space-6)', zIndex: 40, display: 'flex', flexDirection: 'column', gap: 'var(--zp-space-2)', alignItems: 'flex-end', ...style }}
      {...rest}
    >
      {children}
    </div>
  );
}
