import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { RaidEvent } from '@raidschedule/shared';
import { MobileDayRow } from './MobileDayRow.js';
import type { MobileCalendarDay } from './useMobileCalendarState.js';

function makeDay(overrides: Partial<MobileCalendarDay> = {}): MobileCalendarDay {
  return {
    date: new Date(2026, 7, 30),
    key: '2026-08-30',
    isToday: false,
    isFirstOfMonth: false,
    isFirstRow: false,
    lockoutWeekKey: '2026-08-25',
    events: [],
    ...overrides,
  };
}

function makeEvent(overrides: Partial<RaidEvent> = {}): RaidEvent {
  return {
    id: 'evt-1',
    source: 'custom',
    raidName: 'Test Raid',
    startsAt: '2026-08-30T20:00:00.000Z',
    status: 'confirmed',
    character: { name: 'Thrashclaw', className: 'Druid' },
    ...overrides,
  };
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('MobileDayRow', () => {
  it('renders a tappable add affordance for an empty day that is not today', () => {
    render(<MobileDayRow day={makeDay()} isActiveLockout={false} onSelectEvent={vi.fn()} onOpenComposer={vi.fn()} rowRef={vi.fn()} />);
    expect(screen.getByText('No raids — add one')).toBeInTheDocument();
  });

  it('renders the today-specific add affordance for an empty today', () => {
    render(<MobileDayRow day={makeDay({ isToday: true })} isActiveLockout={false} onSelectEvent={vi.fn()} onOpenComposer={vi.fn()} rowRef={vi.fn()} />);
    expect(screen.getByText('No raids today — add one')).toBeInTheDocument();
  });

  it('calls onOpenComposer when the empty-day add affordance is tapped', () => {
    const onOpenComposer = vi.fn();
    const day = makeDay();
    render(<MobileDayRow day={day} isActiveLockout={false} onSelectEvent={vi.fn()} onOpenComposer={onOpenComposer} rowRef={vi.fn()} />);
    fireEvent.click(screen.getByText('No raids — add one'));
    expect(onOpenComposer).toHaveBeenCalledWith(day);
  });

  it('renders event cards for a populated day', () => {
    const event = makeEvent();
    render(<MobileDayRow day={makeDay({ events: [event] })} isActiveLockout={false} onSelectEvent={vi.fn()} onOpenComposer={vi.fn()} rowRef={vi.fn()} />);
    expect(screen.getByText('Test Raid')).toBeInTheDocument();
    expect(screen.queryByText('No raids')).not.toBeInTheDocument();
  });

  it('shows the month tag on the 1st of a month', () => {
    render(
      <MobileDayRow
        day={makeDay({ date: new Date(2026, 8, 1), isFirstOfMonth: true })}
        isActiveLockout={false}
        onSelectEvent={vi.fn()}
        onOpenComposer={vi.fn()}
        rowRef={vi.fn()}
      />,
    );
    expect(screen.getByText('Sep')).toBeInTheDocument();
  });

  it('shows the month tag on the first row of the range even when not the 1st', () => {
    render(
      <MobileDayRow day={makeDay({ isFirstRow: true })} isActiveLockout={false} onSelectEvent={vi.fn()} onOpenComposer={vi.fn()} rowRef={vi.fn()} />,
    );
    expect(screen.getByText('Aug')).toBeInTheDocument();
  });

  it('omits the month tag on an ordinary row', () => {
    render(<MobileDayRow day={makeDay()} isActiveLockout={false} onSelectEvent={vi.fn()} onOpenComposer={vi.fn()} rowRef={vi.fn()} />);
    expect(screen.queryByText('Aug')).not.toBeInTheDocument();
  });

  it('calls onSelectEvent when a card is tapped', () => {
    const event = makeEvent();
    const onSelectEvent = vi.fn();
    render(<MobileDayRow day={makeDay({ events: [event] })} isActiveLockout={false} onSelectEvent={onSelectEvent} onOpenComposer={vi.fn()} rowRef={vi.fn()} />);
    fireEvent.click(screen.getByText('Test Raid'));
    expect(onSelectEvent).toHaveBeenCalledWith(event);
  });

  it('opens the composer once on a long press', () => {
    const onOpenComposer = vi.fn();
    const day = makeDay();
    render(<MobileDayRow day={day} isActiveLockout={false} onSelectEvent={vi.fn()} onOpenComposer={onOpenComposer} rowRef={vi.fn()} />);
    fireEvent.pointerDown(screen.getByTestId('day-row-2026-08-30'), { pointerType: 'touch' });
    vi.advanceTimersByTime(420);
    expect(onOpenComposer).toHaveBeenCalledTimes(1);
    expect(onOpenComposer).toHaveBeenCalledWith(day);
  });

  it('opens the composer once on right-click, and does not double-fire if the long-press timer also completes', () => {
    const onOpenComposer = vi.fn();
    const day = makeDay();
    render(<MobileDayRow day={day} isActiveLockout={false} onSelectEvent={vi.fn()} onOpenComposer={onOpenComposer} rowRef={vi.fn()} />);
    const row = screen.getByTestId('day-row-2026-08-30');

    fireEvent.pointerDown(row, { pointerType: 'touch' });
    fireEvent.contextMenu(row);
    expect(onOpenComposer).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(420);
    expect(onOpenComposer).toHaveBeenCalledTimes(1);
  });

  it('does not open the composer on right-click from a mouse (button !== 0 skips the timer, only onContextMenu fires it)', () => {
    const onOpenComposer = vi.fn();
    const day = makeDay();
    render(<MobileDayRow day={day} isActiveLockout={false} onSelectEvent={vi.fn()} onOpenComposer={onOpenComposer} rowRef={vi.fn()} />);
    const row = screen.getByTestId('day-row-2026-08-30');

    fireEvent.pointerDown(row, { pointerType: 'mouse', button: 2 });
    vi.advanceTimersByTime(1000);
    expect(onOpenComposer).not.toHaveBeenCalled();

    fireEvent.contextMenu(row);
    expect(onOpenComposer).toHaveBeenCalledTimes(1);
  });
});
