import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DayCell } from './DayCell.js';
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

describe('DayCell', () => {
  it('calls onOpenComposer with the day on right-click, without opening the native menu', () => {
    const onOpenComposer = vi.fn();
    const day = makeDay();
    const { container } = render(
      <DayCell
        day={day}
        showAnnotation={false}
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
});
