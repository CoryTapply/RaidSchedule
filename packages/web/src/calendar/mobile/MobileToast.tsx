import { toastSlideIn } from './motionStyles.js';
import type { ToastMessage } from './useToast.js';
import styles from './MobileToast.module.css';

export interface MobileToastProps {
  toast: ToastMessage | null;
}

export function MobileToast({ toast }: MobileToastProps) {
  if (!toast) return null;
  return (
    <div className={styles.layer}>
      <div key={toast.id} className={styles.toast} style={toastSlideIn} role="status">
        {toast.text}
      </div>
    </div>
  );
}
