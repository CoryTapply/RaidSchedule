import { AuthProvider, useAuth } from './auth/AuthProvider.js';
import { LoginPage } from './auth/LoginPage.js';
import { CalendarPage } from './calendar/CalendarPage.js';

function AppShell() {
  const { status } = useAuth();

  if (status === 'loading') return null;
  return status === 'authenticated' ? <CalendarPage /> : <LoginPage />;
}

export function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}
