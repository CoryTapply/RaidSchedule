import { PageShell } from '../design-system/zerpy/components/index.js';
import { useEvents } from '../api/useEvents.js';
import { useAuth } from '../auth/AuthProvider.js';
import { CalendarGrid } from './CalendarGrid.js';
import { CalendarHeader } from './CalendarHeader.js';
import { EventComposer } from './EventComposer.js';
import { EventDetailDialog } from './EventDetailDialog.js';
import { useCalendarState } from './useCalendarState.js';
import styles from '../styles/calendar.module.css';

export function CalendarPage() {
  const { events, loading, error } = useEvents();
  const { logout } = useAuth();
  const state = useCalendarState(events);

  return (
    <PageShell maxWidth={1640}>
      <div className={styles.content}>
        <CalendarHeader
          rangeStart={state.rangeStart}
          rangeEnd={state.rangeEnd}
          onPrev={state.goPrev}
          onNext={state.goNext}
          onToday={state.goToday}
        />
        {error && (
          <span className={styles.caption} style={{ color: 'var(--zp-danger-text)' }} role="alert">
            {error}
          </span>
        )}
        {loading ? (
          <span className={styles.caption}>Loading…</span>
        ) : (
          <CalendarGrid
            days={state.days}
            onSelectEvent={state.selectEvent}
            onEditEvent={state.openEditor}
            onEnterDay={state.setHoverWeek}
            onLeaveDay={state.clearHoverWeek}
            onOpenComposer={state.openComposer}
          />
        )}
        <span className={styles.caption}>Right-click any day to schedule a raid. The highlighted band is the current lockout.</span>
        <button type="button" onClick={() => void logout()} className={styles.signOutButton}>
          Sign out
        </button>
      </div>
      {state.selectedEvent && (
        <EventDetailDialog key={state.selectedEvent.id} event={state.selectedEvent} onClose={state.closeDialog} onEdit={state.openEditor} />
      )}
      {state.composer && (
        <EventComposer
          composer={state.composer}
          onChange={state.updateComposer}
          onCancel={state.closeComposer}
          onSave={state.saveComposer}
          onDelete={state.deleteComposerEvent}
        />
      )}
    </PageShell>
  );
}
