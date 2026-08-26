import React from 'react';

export interface HeroProps extends React.HTMLAttributes<HTMLElement> {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  lede?: React.ReactNode;
  actions?: React.ReactNode;
  aside?: React.ReactNode;
  align?: 'left' | 'center';
}

export function Hero({ eyebrow, title, lede, actions, aside, align = 'left', style, ...rest }: HeroProps) {
  const center = align === 'center';
  return (
    <section
      style={{
        display: 'grid',
        gridTemplateColumns: aside ? 'minmax(0,1fr) minmax(0,.72fr)' : 'minmax(0,1fr)',
        alignItems: 'center', gap: 'var(--zp-space-9)',
        padding: 'var(--zp-space-9) 0 var(--zp-space-8)',
        ...style,
      }}
      {...rest}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: center ? 'center' : 'flex-start', textAlign: center ? 'center' : 'left', gap: 'var(--zp-space-5)' }}>
        {eyebrow ? (
          <span style={{ font: 'var(--zp-text-micro)', letterSpacing: 'var(--zp-tracking-micro)', textTransform: 'uppercase', color: 'var(--zp-text-4)' }}>{eyebrow}</span>
        ) : null}
        <h1
          style={{
            margin: 0, font: 'var(--zp-text-display)', letterSpacing: 'var(--zp-tracking-tight)',
            background: 'var(--zp-gradient-text)', WebkitBackgroundClip: 'text', backgroundClip: 'text',
            color: 'transparent', maxWidth: '22ch', textWrap: 'pretty',
          }}
        >
          {title}
        </h1>
        {lede ? (
          <p style={{ margin: 0, font: 'var(--zp-text-lg)', color: 'var(--zp-text-3)', maxWidth: '52ch', textWrap: 'pretty' }}>{lede}</p>
        ) : null}
        {actions ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--zp-space-3)', marginTop: 'var(--zp-space-2)' }}>{actions}</div>
        ) : null}
      </div>
      {aside ? <div style={{ minWidth: 0 }}>{aside}</div> : null}
    </section>
  );
}
