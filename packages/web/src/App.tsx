import { AuthProvider, useAuth } from './auth/AuthProvider.js';
import { LoginPage } from './auth/LoginPage.js';
import { CalendarPage } from './calendar/CalendarPage.js';
import { MobileCalendarPage } from './calendar/mobile/MobileCalendarPage.js';
import { useMediaQuery } from './hooks/useMediaQuery.js';

function AppShell() {
  const { status } = useAuth();
  const isMobile = useMediaQuery('(max-width: 767px)');

  if (status === 'loading') return null;
  if (status !== 'authenticated') return <LoginPage />;
  return isMobile ? <MobileCalendarPage /> : <CalendarPage />;
}

export function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}
