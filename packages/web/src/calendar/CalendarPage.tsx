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
    <div className={styles.root}>
      <div className={styles.content}>
        <CalendarHeader
          rangeStart={state.rangeStart}
          rangeEnd={state.rangeEnd}
          onPrev={state.goPrev}
          onNext={state.goNext}
          onToday={state.goToday}
        />
        {error && (
          <div style={{ color: '#ff8787', fontSize: 13 }} role="alert">
            {error}
          </div>
        )}
        {loading ? (
          <div style={{ color: 'rgba(214,208,255,.6)', fontSize: 13 }}>Loading…</div>
        ) : (
          <CalendarGrid
            days={state.days}
            onSelectEvent={state.selectEvent}
            onEnterDay={state.setHoverWeek}
            onLeaveDay={state.clearHoverWeek}
            onOpenComposer={state.openComposer}
          />
        )}
        <button type="button" onClick={() => void logout()} className={styles.signOutButton}>
          Sign out
        </button>
      </div>
      {state.selectedEvent && (
        <EventDetailDialog
          key={state.selectedEvent.id}
          event={state.selectedEvent}
          onClose={state.closeDialog}
          onDelete={state.deleteSelectedEvent}
          deleting={state.deletingEvent}
          deleteError={state.deleteError}
          onConfirm={state.confirmSelectedEvent}
          confirming={state.confirmingEvent}
          confirmError={state.confirmError}
          onToggleHorde={state.toggleHordeSelectedEvent}
          togglingHorde={state.togglingHorde}
          hordeError={state.hordeError}
        />
      )}
      {state.composer && (
        <EventComposer
          composer={state.composer}
          onChange={state.updateComposer}
          onCancel={state.closeComposer}
          onSave={state.saveComposer}
        />
      )}
    </div>
  );
}
