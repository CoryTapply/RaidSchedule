import React from 'react';

export interface TooltipProps {
  content: React.ReactNode;
  placement?: 'top' | 'bottom';
  children?: React.ReactNode;
}

export function Tooltip({ content, placement = 'top', children }: TooltipProps) {
  const [open, setOpen] = React.useState(false);
  const pos = placement === 'bottom'
    ? { top: 44, left: '50%', transform: 'translateX(-50%)' }
    : { bottom: 44, left: '50%', transform: 'translateX(-50%)' };
  return (
    <span
      style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      {open ? (
        <span
          role="tooltip"
          style={{
            position: 'absolute', ...pos, whiteSpace: 'nowrap', zIndex: 20,
            padding: '6px 9px', borderRadius: 'var(--zp-radius)',
            border: '1px solid var(--zp-line-strong)', background: 'var(--zp-surface-overlay)',
            backdropFilter: 'blur(var(--zp-blur-lg))', boxShadow: 'var(--zp-elev-overlay)',
            font: 'var(--zp-text-sm)', color: 'var(--zp-text-2)',
            animation: 'zp-slide-in var(--zp-dur-fast) var(--zp-ease)',
          }}
        >
          {content}
        </span>
      ) : null}
    </span>
  );
}
