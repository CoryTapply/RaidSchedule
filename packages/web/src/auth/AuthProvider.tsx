import { createContext, useContext, type ReactNode } from 'react';
import { useSession, type SessionState } from './useSession.js';

const AuthContext = createContext<SessionState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const session = useSession();
  return <AuthContext.Provider value={session}>{children}</AuthContext.Provider>;
}

export function useAuth(): SessionState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
