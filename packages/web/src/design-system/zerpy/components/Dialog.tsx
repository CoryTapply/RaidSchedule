import type { ReactNode } from 'react';
import { IconButton } from './IconButton.js';
import styles from './Dialog.module.css';

export interface DialogProps {
  title: string;
  description?: string;
  onClose: () => void;
  width?: string;
  children: ReactNode;
}

export function Dialog({ title, description, onClose, width = '380px', children }: DialogProps) {
  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.panel} style={{ width }} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.headerText}>
            <span className={styles.title}>{title}</span>
            {description && <span className={styles.description}>{description}</span>}
          </div>
          <IconButton label="Close" intent="ghost" size="sm" onClick={onClose}>
            ✕
          </IconButton>
        </div>
        {children}
      </div>
    </div>
  );
}
