import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { dateKey } from '@raidschedule/shared';
import { MobileHeader } from './MobileHeader.js';
import { MobileWeekStrip } from './MobileWeekStrip.js';
import type { MobileCalendarDay } from './useMobileCalendarState.js';

function makeDay(date: Date, events: MobileCalendarDay['events'] = []): MobileCalendarDay {
  return {
    date,
    key: dateKey(date),
    isToday: false,
    isFirstOfMonth: false,
    isFirstRow: false,
    lockoutWeekKey: dateKey(date),
    events,
  };
}

const eventStub = [{ id: 'e', source: 'custom', raidName: 'R', startsAt: new Date().toISOString(), status: 'confirmed', character: { name: 'C', className: 'Druid' } }] as MobileCalendarDay['events'];

describe('MobileHeader', () => {
  it('shows the month/year and lockout range for the active date', () => {
    // Tuesday, August 25, 2026 — a lockout start, so the range reads Aug 25 – Aug 31.
    const activeDate = new Date(2026, 7, 25);
    render(
      <MobileHeader
        days={[]}
        activeDate={activeDate}
        activeDayKey={dateKey(activeDate)}
        todayKey={dateKey(activeDate)}
        onToday={vi.fn()}
        onSelectDay={vi.fn()}
      />,
    );
    expect(screen.getByText('August 2026')).toBeInTheDocument();
    expect(screen.getByText('Lockout Aug 25 – Aug 31')).toBeInTheDocument();
  });

  it('shows a lockout range spanning two months correctly', () => {
    // Tuesday, July 28, 2026 is a lockout start; the week runs into August.
    const activeDate = new Date(2026, 6, 28);
    render(
      <MobileHeader
        days={[]}
        activeDate={activeDate}
        activeDayKey={dateKey(activeDate)}
        todayKey={dateKey(activeDate)}
        onToday={vi.fn()}
        onSelectDay={vi.fn()}
      />,
    );
    expect(screen.getByText('Lockout Jul 28 – Aug 3')).toBeInTheDocument();
  });

  it('Today button is ghost when already on today, primary otherwise', () => {
    const activeDate = new Date(2026, 7, 25);
    const { rerender } = render(
      <MobileHeader days={[]} activeDate={activeDate} activeDayKey="2026-08-25" todayKey="2026-08-25" onToday={vi.fn()} onSelectDay={vi.fn()} />,
    );
    expect(screen.getByRole('button', { name: 'Today' }).className).toMatch(/ghost/);

    rerender(
      <MobileHeader days={[]} activeDate={activeDate} activeDayKey="2026-08-25" todayKey="2026-08-20" onToday={vi.fn()} onSelectDay={vi.fn()} />,
    );
    expect(screen.getByRole('button', { name: 'Today' }).className).toMatch(/primary/);
  });

  it('calls onToday when the Today button is clicked', () => {
    const onToday = vi.fn();
    const activeDate = new Date(2026, 7, 25);
    render(<MobileHeader days={[]} activeDate={activeDate} activeDayKey="2026-08-25" todayKey="2026-08-20" onToday={onToday} onSelectDay={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: 'Today' }));
    expect(onToday).toHaveBeenCalledTimes(1);
  });
});

describe('MobileWeekStrip', () => {
  it('renders 7 cells for the Sunday-based week containing the active date', () => {
    const activeDate = new Date(2026, 7, 25); // Tuesday
    render(<MobileWeekStrip days={[]} activeDate={activeDate} activeDayKey={dateKey(activeDate)} onSelectDay={vi.fn()} />);
    expect(screen.getAllByRole('button')).toHaveLength(7);
    // Sunday-based week containing Aug 25 starts Aug 23.
    expect(screen.getByText('23')).toBeInTheDocument();
    expect(screen.getByText('29')).toBeInTheDocument();
  });

  it('marks the active cell', () => {
    const activeDate = new Date(2026, 7, 25);
    render(<MobileWeekStrip days={[]} activeDate={activeDate} activeDayKey={dateKey(activeDate)} onSelectDay={vi.fn()} />);
    const activeCell = screen.getByText('25').closest('button')!;
    expect(activeCell.className).toMatch(/cellActive/);
  });

  it('shows a density dot only for days with events', () => {
    const activeDate = new Date(2026, 7, 25);
    const withEvents = makeDay(new Date(2026, 7, 24), eventStub);
    const empty = makeDay(new Date(2026, 7, 25), []);
    render(<MobileWeekStrip days={[withEvents, empty]} activeDate={activeDate} activeDayKey={dateKey(activeDate)} onSelectDay={vi.fn()} />);

    const dottedCell = screen.getByText('24').closest('button')!;
    const dot = dottedCell.querySelector('span:last-child')!;
    expect(dot.className).toMatch(/dotActive/);

    const emptyCell = screen.getByText('25').closest('button')!;
    const emptyDot = emptyCell.querySelector('span:last-child')!;
    expect(emptyDot.className).not.toMatch(/dotActive/);
  });

  it('calls onSelectDay with the date key when a cell is tapped', () => {
    const activeDate = new Date(2026, 7, 25);
    const onSelectDay = vi.fn();
    render(<MobileWeekStrip days={[]} activeDate={activeDate} activeDayKey={dateKey(activeDate)} onSelectDay={onSelectDay} />);
    fireEvent.click(screen.getByText('23').closest('button')!);
    expect(onSelectDay).toHaveBeenCalledWith('2026-08-23');
  });
});
