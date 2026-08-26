import { Button, PageShell, SegmentedControl } from '../design-system/zerpy/components/index.js';
import { useEvents } from '../api/useEvents.js';
import { useAuth } from '../auth/AuthProvider.js';
import { CalendarGrid } from './CalendarGrid.js';
import { CalendarHeader } from './CalendarHeader.js';
import { EventComposer } from './EventComposer.js';
import { EventDetailDialog } from './EventDetailDialog.js';
import { useCalendarState, type CalendarViewMode } from './useCalendarState.js';
import styles from '../styles/calendar.module.css';

const VIEW_MODE_OPTIONS = [
  { value: 'week', label: 'Week' },
  { value: 'lockout', label: 'Lockout' },
] as const;

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
            viewMode={state.viewMode}
            onSelectEvent={state.selectEvent}
            onEditEvent={state.openEditor}
            onEnterDay={state.setHoverWeek}
            onLeaveDay={state.clearHoverWeek}
            onOpenComposer={state.openComposer}
          />
        )}
        <div className={styles.footerRow}>
          <span className={styles.caption}>Right-click any day to schedule a raid. The highlighted band is the current lockout.</span>
          <div className={styles.viewControls}>
            <Button
              intent={state.showHiddenEvents ? 'primary' : 'ghost'}
              size="sm"
              onClick={state.toggleShowHiddenEvents}
            >
              {state.showHiddenEvents ? 'Hide Hidden Events' : 'Show Hidden Events'}
            </Button>
            <SegmentedControl
              aria-label="Calendar view"
              options={VIEW_MODE_OPTIONS}
              value={state.viewMode}
              onChange={(v) => state.setViewMode(v as CalendarViewMode)}
            />
          </div>
        </div>
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
