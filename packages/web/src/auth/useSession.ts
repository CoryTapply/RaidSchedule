import { useCallback, useEffect, useState } from 'react';

export type SessionStatus = 'loading' | 'authenticated' | 'unauthenticated';

export interface SessionState {
  status: SessionStatus;
  loginError: string | null;
  login: (password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export function useSession(): SessionState {
  const [status, setStatus] = useState<SessionStatus>('loading');
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/auth/session')
      .then((res) => {
        if (!cancelled) setStatus(res.ok ? 'authenticated' : 'unauthenticated');
      })
      .catch(() => {
        if (!cancelled) setStatus('unauthenticated');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (password: string) => {
    setLoginError(null);
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      setLoginError('Incorrect password.');
      return;
    }
    setStatus('authenticated');
  }, []);

  const logout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setStatus('unauthenticated');
  }, []);

  return { status, loginError, login, logout };
}
