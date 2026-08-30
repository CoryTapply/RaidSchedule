import { createRef } from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MobileDayList, type MobileDayListHandle } from './MobileDayList.js';
import type { MobileCalendarDay } from './useMobileCalendarState.js';

const ROW_HEIGHT = 100;

function makeDays(count: number, todayIndex: number): MobileCalendarDay[] {
  return Array.from({ length: count }, (_, i) => ({
    date: new Date(2026, 7, 20 + i),
    key: `2026-08-${String(20 + i).padStart(2, '0')}`,
    isToday: i === todayIndex,
    isFirstOfMonth: false,
    isFirstRow: i === 0,
    lockoutWeekKey: '2026-08-18',
    events: [],
  }));
}

function rectAt(top: number): DOMRect {
  return { top, left: 0, right: 0, bottom: top + ROW_HEIGHT, width: 0, height: ROW_HEIGHT, x: 0, y: top, toJSON: () => ({}) } as DOMRect;
}

/**
 * Installs fake layout right after render, before any rAF has had a chance to fire: the
 * scroller's own rect stays fixed at the origin (it doesn't move on the page), and each row
 * sits at a fixed *content* position (index * ROW_HEIGHT) — its on-screen rect is that content
 * position minus however far the scroller has scrolled, mirroring how a real, scrolled,
 * `position: relative` container behaves. `setScrollTop` moves both together so rowTop() stays
 * physically consistent (get this wrong and the mocked rect + the mocked scrollTop double-count
 * the offset, which is exactly what happened while first writing this test).
 */
function mockRowLayout(container: HTMLElement, days: MobileCalendarDay[]) {
  const scroller = container.querySelector('[class*="scroller"]') as HTMLElement;
  vi.spyOn(scroller, 'getBoundingClientRect').mockReturnValue(rectAt(0));
  scroller.scrollTo = vi.fn();

  const rows = days.map((day, i) => {
    const row = container.querySelector(`[data-testid="day-row-${day.key}"]`) as HTMLElement;
    const spy = vi.spyOn(row, 'getBoundingClientRect');
    spy.mockReturnValue(rectAt(i * ROW_HEIGHT));
    return { spy, contentTop: i * ROW_HEIGHT };
  });

  function setScrollTop(value: number) {
    scroller.scrollTop = value;
    rows.forEach(({ spy, contentTop }) => spy.mockReturnValue(rectAt(contentTop - value)));
  }

  return { scroller, setScrollTop };
}

describe('MobileDayList', () => {
  it('lands on today at mount (measure, scroll, correct on the next frame)', async () => {
    const days = makeDays(5, 2);
    const { container } = render(
      <MobileDayList
        days={days}
        todayKey={days[2]!.key}
        activeLockoutKey="2026-08-18"
        onActiveDayChange={vi.fn()}
        onSelectEvent={vi.fn()}
        onOpenComposer={vi.fn()}
      />,
    );
    const { scroller } = mockRowLayout(container, days);

    await waitFor(() => {
      expect(scroller.scrollTo).toHaveBeenCalledWith({ top: 2 * ROW_HEIGHT - 6, behavior: 'auto' });
    });
  });

  it('exposes scrollToDay via the imperative handle, using smooth behavior', async () => {
    const days = makeDays(5, 0);
    const ref = createRef<MobileDayListHandle>();
    const { container } = render(
      <MobileDayList
        ref={ref}
        days={days}
        todayKey={days[0]!.key}
        activeLockoutKey="2026-08-18"
        onActiveDayChange={vi.fn()}
        onSelectEvent={vi.fn()}
        onOpenComposer={vi.fn()}
      />,
    );
    const { scroller } = mockRowLayout(container, days);
    await waitFor(() => expect(scroller.scrollTo).toHaveBeenCalled());
    vi.mocked(scroller.scrollTo).mockClear();

    ref.current!.scrollToDay(days[3]!.key);

    expect(scroller.scrollTo).toHaveBeenCalledWith({ top: 3 * ROW_HEIGHT - 6, behavior: 'smooth' });
  });

  it('reports the active day on scroll', async () => {
    const days = makeDays(5, 0);
    const onActiveDayChange = vi.fn();
    const { container } = render(
      <MobileDayList
        days={days}
        todayKey={days[0]!.key}
        activeLockoutKey="2026-08-18"
        onActiveDayChange={onActiveDayChange}
        onSelectEvent={vi.fn()}
        onOpenComposer={vi.fn()}
      />,
    );
    const { scroller, setScrollTop } = mockRowLayout(container, days);
    await waitFor(() => expect(scroller.scrollTo).toHaveBeenCalled());
    onActiveDayChange.mockClear();

    // Scrolled so day index 2's content top (200) is the last one at/above scrollTop + 8.
    setScrollTop(205);
    fireEvent.scroll(scroller);

    await waitFor(() => {
      expect(onActiveDayChange).toHaveBeenCalledWith(days[2]!.key);
    });
  });

  it('does not report the active day again when the pick is unchanged across scroll events', async () => {
    const days = makeDays(5, 0);
    const onActiveDayChange = vi.fn();
    const { container } = render(
      <MobileDayList
        days={days}
        todayKey={days[0]!.key}
        activeLockoutKey="2026-08-18"
        onActiveDayChange={onActiveDayChange}
        onSelectEvent={vi.fn()}
        onOpenComposer={vi.fn()}
      />,
    );
    const { scroller, setScrollTop } = mockRowLayout(container, days);
    await waitFor(() => expect(scroller.scrollTo).toHaveBeenCalled());
    onActiveDayChange.mockClear();

    setScrollTop(205);
    fireEvent.scroll(scroller);
    await waitFor(() => expect(onActiveDayChange).toHaveBeenCalledTimes(1));

    setScrollTop(206);
    fireEvent.scroll(scroller);
    // Give the rAF-throttled handler a chance to run again.
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

    expect(onActiveDayChange).toHaveBeenCalledTimes(1);
  });
});
