import React from 'react';

export interface PopoverItem {
  label: string;
  onClick?: () => void;
  tone?: 'default' | 'danger';
}

export interface PopoverProps {
  open?: boolean;
  onClose?: () => void;
  items?: PopoverItem[];
  align?: 'left' | 'right';
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export function Popover({ open = false, onClose, items, children, align = 'left', style }: PopoverProps) {
  if (!open) return null;
  return (
    <div
      style={{
        position: 'absolute', top: 46, [align]: 0, zIndex: 30, minWidth: 208,
        padding: 'var(--zp-space-2)', borderRadius: 'var(--zp-radius-md)',
        border: '1px solid var(--zp-line-strong)', background: 'var(--zp-surface-overlay)',
        backdropFilter: 'blur(var(--zp-blur-lg))', boxShadow: 'var(--zp-elev-overlay)',
        display: 'flex', flexDirection: 'column', gap: 2,
        animation: 'zp-slide-in var(--zp-dur-fast) var(--zp-ease)', ...style,
      } as React.CSSProperties}
      role="menu"
    >
      {items
        ? items.map(it => (
            <button
              key={it.label}
              role="menuitem"
              onClick={() => { if (it.onClick) it.onClick(); if (onClose) onClose(); }}
              className="zp-btn zp-ghost"
              style={{ justifyContent: 'flex-start', height: 32, width: '100%', color: it.tone === 'danger' ? 'var(--zp-danger)' : 'var(--zp-text-2)' }}
            >
              {it.label}
            </button>
          ))
        : children}
    </div>
  );
}
