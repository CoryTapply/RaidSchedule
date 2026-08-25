import { useState, type FormEvent } from 'react';
import { Button, Field, Input, PageShell, Panel } from '../design-system/zerpy/components/index.js';
import { useAuth } from './AuthProvider.js';
import styles from './LoginPage.module.css';

export function LoginPage() {
  const { login, loginError } = useAuth();
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(password);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageShell maxWidth="320px">
      <div className={styles.wrap}>
        <Panel>
          <form onSubmit={handleSubmit} className={styles.form}>
            <span className={styles.title}>Raid Calendar</span>
            <Field label="Password">
              <Input
                aria-label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                required
              />
            </Field>
            {loginError && (
              <span className={styles.error} role="alert">
                {loginError}
              </span>
            )}
            <Button type="submit" intent="primary" disabled={submitting || password.length === 0}>
              {submitting ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>
        </Panel>
      </div>
    </PageShell>
  );
}
