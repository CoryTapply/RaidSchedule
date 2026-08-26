import type { CSSProperties, ReactNode } from 'react';
import styles from './Panel.module.css';

export interface PanelProps {
  children: ReactNode;
  padding?: CSSProperties['padding'];
}

export function Panel({ children, padding = 0 }: PanelProps) {
  return (
    <div className={styles.panel} style={{ padding }}>
      {children}
    </div>
  );
}
