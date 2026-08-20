import { useState, type FormEvent } from 'react';
import { useAuth } from './AuthProvider.js';

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
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-bg)',
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="card elev-md"
        style={{ width: 320, display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}
      >
        <div className="card-title">Raid Calendar</div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            required
          />
        </div>
        {loginError && (
          <div style={{ color: '#e5484d', fontSize: 13 }} role="alert">
            {loginError}
          </div>
        )}
        <button type="submit" className="btn btn-primary btn-block" disabled={submitting || password.length === 0}>
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
