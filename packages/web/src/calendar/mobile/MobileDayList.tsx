import type { RaidEvent } from '@raidschedule/shared';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { MobileDayRow } from './MobileDayRow.js';
import { pickActiveKey, scrollToKey } from './scrollTargeting.js';
import type { MobileCalendarDay } from './useMobileCalendarState.js';
import styles from './MobileDayList.module.css';

export interface MobileDayListHandle {
  /** Smooth-scrolls the given day to the top — used by the Today button and the week strip. */
  scrollToDay: (key: string) => void;
}

export interface MobileDayListProps {
  days: MobileCalendarDay[];
  todayKey: string;
  activeLockoutKey: string;
  onActiveDayChange: (key: string) => void;
  onSelectEvent: (event: RaidEvent) => void;
  onOpenComposer: (day: MobileCalendarDay) => void;
}

const MOUNT_SCROLL_MAX_FRAMES = 12;

export const MobileDayList = forwardRef<MobileDayListHandle, MobileDayListProps>(function MobileDayList(
  { days, todayKey, activeLockoutKey, onActiveDayChange, onSelectEvent, onOpenComposer },
  ref,
) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const rowEls = useRef(new Map<string, HTMLDivElement>());
  const rafPending = useRef(false);
  const lastActiveKey = useRef<string | null>(null);

  useImperativeHandle(ref, () => ({
    scrollToDay(key: string) {
      const scroller = scrollerRef.current;
      if (!scroller) return;
      scrollToKey(scroller, rowEls.current, key, 'smooth');
    },
  }));

  function handleScroll() {
    if (rafPending.current) return;
    rafPending.current = true;
    requestAnimationFrame(() => {
      rafPending.current = false;
      const scroller = scrollerRef.current;
      if (!scroller) return;
      const key = pickActiveKey(scroller, rowEls.current);
      if (key && key !== lastActiveKey.current) {
        lastActiveKey.current = key;
        onActiveDayChange(key);
      }
    });
  }

  // Land on today at mount. Controls (and the sticky header) mount asynchronously and can
  // still shift row heights after the first pass, so this measures, scrolls, and corrects
  // once more on the next frame — see the plan's "Scroll targeting" section.
  useEffect(() => {
    let frame = 0;
    let cancelled = false;
    let rafId = 0;

    function attempt() {
      if (cancelled) return;
      const scroller = scrollerRef.current;
      const el = rowEls.current.get(todayKey);
      if (scroller && el) {
        scrollToKey(scroller, rowEls.current, todayKey, 'auto');
        lastActiveKey.current = todayKey;
        rafId = requestAnimationFrame(() => {
          if (cancelled) return;
          const s = scrollerRef.current;
          if (s) scrollToKey(s, rowEls.current, todayKey, 'auto');
        });
        return;
      }
      if (frame++ < MOUNT_SCROLL_MAX_FRAMES) {
        rafId = requestAnimationFrame(attempt);
      }
    }

    rafId = requestAnimationFrame(attempt);
    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
    };
  }, [todayKey]);

  return (
    <div ref={scrollerRef} className={styles.scroller} onScroll={handleScroll}>
      {days.map((day) => (
        <MobileDayRow
          key={day.key}
          day={day}
          isActiveLockout={day.lockoutWeekKey === activeLockoutKey}
          onSelectEvent={onSelectEvent}
          onOpenComposer={onOpenComposer}
          rowRef={(el) => {
            if (el) rowEls.current.set(day.key, el);
            else rowEls.current.delete(day.key);
          }}
        />
      ))}
      <p className={styles.footerHint}>Press and hold a day to schedule a raid.</p>
      <div className={styles.spacer} />
    </div>
  );
});
