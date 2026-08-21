import { useEvents } from '../api/useEvents.js';
import { useAuth } from '../auth/AuthProvider.js';
import { CalendarHeader } from './CalendarHeader.js';
import { DayGrid } from './DayGrid.js';
import { EventComposer } from './EventComposer.js';
import { EventDetailDialog } from './EventDetailDialog.js';
import { useCalendarState } from './useCalendarState.js';
import { useContainerBreakpoint } from './useContainerBreakpoint.js';
import { WeekdayHeader } from './WeekdayHeader.js';
import styles from '../styles/calendar.module.css';

const LARGE_BREAKPOINT_PX = 1900;

export function CalendarPage() {
  const { events, loading, error } = useEvents();
  const { logout } = useAuth();
  const state = useCalendarState(events);
  const [rootRef, isLarge] = useContainerBreakpoint<HTMLDivElement>(LARGE_BREAKPOINT_PX);

  return (
    <div ref={rootRef} className={styles.root}>
      <CalendarHeader
        rangeStart={state.rangeStart}
        rangeEnd={state.rangeEnd}
        onPrev={state.goPrev}
        onNext={state.goNext}
        onToday={state.goToday}
      />
      {error && (
        <div style={{ color: '#e5484d', fontSize: 13 }} role="alert">
          {error}
        </div>
      )}
      {loading ? (
        <div style={{ color: 'var(--color-neutral-400)', fontSize: 13 }}>Loading…</div>
      ) : (
        <>
          <WeekdayHeader full={isLarge} />
          <DayGrid
            days={state.days}
            showAnnotations={isLarge}
            onSelectEvent={state.selectEvent}
            onEnterDay={state.setHoverWeek}
            onLeaveDay={state.clearHoverWeek}
            onOpenComposer={state.openComposer}
          />
        </>
      )}
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
      <button
        type="button"
        onClick={() => void logout()}
        style={{
          alignSelf: 'flex-start',
          background: 'transparent',
          border: 'none',
          color: 'var(--color-neutral-500)',
          fontSize: 12,
          cursor: 'pointer',
          padding: 0,
        }}
      >
        Sign out
      </button>
    </div>
  );
}
