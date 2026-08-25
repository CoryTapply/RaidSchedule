import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { RaidEvent } from '@raidschedule/shared';
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
        onEditEvent={vi.fn()}
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
        onEditEvent={vi.fn()}
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

  it('right-clicking an event calls onEditEvent instead of opening the day composer', () => {
    const onEditEvent = vi.fn();
    const onOpenComposer = vi.fn();
    const raidEvent: RaidEvent = {
      id: 'evt-1',
      source: 'raid-helper',
      raidName: 'Nerub-ar Palace',
      startsAt: '2026-08-18T20:00:00.000Z',
      endsAt: '2026-08-18T23:00:00.000Z',
      status: 'confirmed',
      character: { name: 'Thrashclaw', className: 'Druid' },
    };
    const day = makeDay({ events: [raidEvent] });

    render(
      <TimelineDayCell
        day={day}
        window={window}
        hours={hours}
        onSelectEvent={vi.fn()}
        onEditEvent={onEditEvent}
        onEnter={vi.fn()}
        onLeave={vi.fn()}
        onOpenComposer={onOpenComposer}
      />,
    );

    fireEvent.contextMenu(screen.getByRole('button'), { clientX: 42, clientY: 24 });

    expect(onEditEvent).toHaveBeenCalledTimes(1);
    expect(onEditEvent.mock.calls[0]![0]).toBe(raidEvent);
    expect(onEditEvent.mock.calls[0]![1]).toMatchObject({ clientX: 42, clientY: 24 });
    expect(onOpenComposer).not.toHaveBeenCalled();
  });
});
