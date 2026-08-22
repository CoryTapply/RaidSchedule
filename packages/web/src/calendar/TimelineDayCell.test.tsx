import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TimelineDayCell } from './TimelineDayCell.js';
import type { CalendarDay } from './useCalendarState.js';

function makeDay(overrides: Partial<CalendarDay> = {}): CalendarDay {
  return {
    date: new Date(2026, 7, 18),
    key: '2026-08-18',
    isToday: false,
    isFirstOfMonth: false,
    isLockoutReset: false,
    isHighlighted: false,
    events: [],
    lockoutWeekKey: '2026-08-18',
    ...overrides,
  };
}

const window = { startHour: 17, endHour: 24 };
const hours = [17, 18, 19, 20, 21, 22, 23, 24];

describe('TimelineDayCell', () => {
  it('calls onOpenComposer with the day on right-click, without opening the native menu', () => {
    const onOpenComposer = vi.fn();
    const day = makeDay();
    const { container } = render(
      <TimelineDayCell
        day={day}
        window={window}
        hours={hours}
        onSelectEvent={vi.fn()}
        onEnter={vi.fn()}
        onLeave={vi.fn()}
        onOpenComposer={onOpenComposer}
      />,
    );

    const cell = container.firstElementChild!;
    const event = fireEvent.contextMenu(cell, { clientX: 42, clientY: 24 });

    expect(onOpenComposer).toHaveBeenCalledTimes(1);
    expect(onOpenComposer.mock.calls[0]![0]).toBe(day);
    expect(onOpenComposer.mock.calls[0]![1]).toMatchObject({ clientX: 42, clientY: 24 });
    // fireEvent.contextMenu returns false when preventDefault() was called.
    expect(event).toBe(false);
  });

  it('calls onEnter/onLeave with the lockout week key on hover', () => {
    const onEnter = vi.fn();
    const onLeave = vi.fn();
    const day = makeDay({ lockoutWeekKey: '2026-08-11' });
    const { container } = render(
      <TimelineDayCell
        day={day}
        window={window}
        hours={hours}
        onSelectEvent={vi.fn()}
        onEnter={onEnter}
        onLeave={onLeave}
        onOpenComposer={vi.fn()}
      />,
    );

    const cell = container.firstElementChild!;
    fireEvent.mouseEnter(cell);
    expect(onEnter).toHaveBeenCalledWith('2026-08-11');
    fireEvent.mouseLeave(cell);
    expect(onLeave).toHaveBeenCalledTimes(1);
  });
});
