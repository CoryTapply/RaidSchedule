import { dateKey, lockoutStart } from '@raidschedule/shared';
import { useMemo, useRef, useState } from 'react';
import { useEvents } from '../../api/useEvents.js';
import { MobileComposerSheet } from './MobileComposerSheet.js';
import { MobileDayList, type MobileDayListHandle } from './MobileDayList.js';
import { MobileDetailSheet } from './MobileDetailSheet.js';
import { MobileHeader } from './MobileHeader.js';
import { MobileToast } from './MobileToast.js';
import { useMobileCalendarState } from './useMobileCalendarState.js';
import { useToast } from './useToast.js';
import './motion.css';
import styles from './MobileCalendarPage.module.css';

export function MobileCalendarPage() {
  const { events, error } = useEvents();
  const state = useMobileCalendarState(events);
  const toast = useToast();
  const dayListRef = useRef<MobileDayListHandle>(null);
  const [activeDayKey, setActiveDayKey] = useState(state.todayKey);

  const activeDate = useMemo(
    () => state.days.find((d) => d.key === activeDayKey)?.date ?? new Date(),
    [state.days, activeDayKey],
  );
  const activeLockoutKey = useMemo(() => dateKey(lockoutStart(activeDate)), [activeDate]);

  function scrollToDay(key: string) {
    setActiveDayKey(key);
    dayListRef.current?.scrollToDay(key);
  }

  async function handleSave() {
    const result = await state.saveComposer();
    if (result) {
      toast.push(result.message);
      scrollToDay(result.dayKey);
    }
  }

  async function handleDelete() {
    const result = await state.deleteComposerEvent();
    if (result) {
      toast.push(result.message);
      scrollToDay(result.dayKey);
    }
  }

  return (
    <div className={styles.root}>
      <div className={styles.starfield} />

      <MobileHeader
        days={state.days}
        activeDate={activeDate}
        activeDayKey={activeDayKey}
        todayKey={state.todayKey}
        onToday={() => scrollToDay(state.todayKey)}
        onSelectDay={scrollToDay}
      />

      {error && (
        <span className={styles.error} role="alert">
          {error}
        </span>
      )}

      <MobileDayList
        ref={dayListRef}
        days={state.days}
        todayKey={state.todayKey}
        activeLockoutKey={activeLockoutKey}
        onActiveDayChange={setActiveDayKey}
        onSelectEvent={state.selectEvent}
        onOpenComposer={state.openComposer}
      />

      {state.selectedEvent && <MobileDetailSheet event={state.selectedEvent} onClose={state.closeDetail} onEdit={state.openEditor} />}

      <MobileComposerSheet
        composer={state.composer}
        onChange={state.updateComposer}
        onStartChange={state.setComposerStart}
        onCancel={state.closeComposer}
        onSave={() => void handleSave()}
        onDelete={() => void handleDelete()}
      />

      <MobileToast toast={toast.toast} />
    </div>
  );
}
