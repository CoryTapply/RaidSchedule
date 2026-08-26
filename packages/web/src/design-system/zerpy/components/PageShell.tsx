import type { ReactNode } from 'react';
import styles from './PageShell.module.css';

export interface PageShellProps {
  children: ReactNode;
  starfield?: boolean;
  maxWidth?: string;
}

export function PageShell({ children, starfield = true, maxWidth = '1440px' }: PageShellProps) {
  return (
    <div className={styles.shell}>
      {starfield && <div className={styles.starfield} />}
      <div className={styles.inner} style={{ maxWidth }}>
        {children}
      </div>
    </div>
  );
}
