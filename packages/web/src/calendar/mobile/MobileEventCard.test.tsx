import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { RaidEvent } from '@raidschedule/shared';
import { MobileEventCard } from './MobileEventCard.js';

function makeEvent(overrides: Partial<RaidEvent> = {}): RaidEvent {
  return {
    id: 'evt-1',
    source: 'raid-helper',
    raidName: 'Nerub-ar Palace',
    startsAt: '2026-08-18T20:00:00.000Z',
    endsAt: '2026-08-18T23:00:00.000Z',
    status: 'confirmed',
    character: { name: 'Thrashclaw', className: 'Druid' },
    isHorde: false,
    ...overrides,
  };
}

describe('MobileEventCard', () => {
  it('renders the title, time range, and character line', () => {
    render(<MobileEventCard event={makeEvent()} onSelect={vi.fn()} />);
    expect(screen.getByText('Nerub-ar Palace')).toBeInTheDocument();
    expect(screen.getByText(/^\d{1,2}:\d{2}\s?(AM|PM) – \d{1,2}:\d{2}\s?(AM|PM)$/)).toBeInTheDocument();
    expect(screen.getByText(/Thrashclaw · Druid/)).toBeInTheDocument();
  });

  it('calls onSelect with the event when tapped', async () => {
    const event = makeEvent();
    const onSelect = vi.fn();
    render(<MobileEventCard event={event} onSelect={onSelect} />);
    await userEvent.click(screen.getByRole('button'));
    expect(onSelect).toHaveBeenCalledWith(event);
  });

  it('calls onSelect on Enter key press', async () => {
    const event = makeEvent();
    const onSelect = vi.fn();
    render(<MobileEventCard event={event} onSelect={onSelect} />);
    screen.getByRole('button').focus();
    await userEvent.keyboard('{Enter}');
    expect(onSelect).toHaveBeenCalledWith(event);
  });

  it('applies the confirmed variant class for a confirmed event', () => {
    render(<MobileEventCard event={makeEvent({ status: 'confirmed' })} onSelect={vi.fn()} />);
    expect(screen.getByRole('button').className).toMatch(/confirmed/);
  });

  it('applies the pending variant class for a non-confirmed event', () => {
    render(<MobileEventCard event={makeEvent({ status: 'pending' })} onSelect={vi.fn()} />);
    expect(screen.getByRole('button').className).toMatch(/pending/);
  });

  it('shows the faction mark only on Horde-tagged events', () => {
    const { rerender } = render(<MobileEventCard event={makeEvent({ isHorde: true })} onSelect={vi.fn()} />);
    expect(screen.getByTestId('horde-mark')).toBeInTheDocument();

    rerender(<MobileEventCard event={makeEvent({ isHorde: false })} onSelect={vi.fn()} />);
    expect(screen.queryByTestId('horde-mark')).not.toBeInTheDocument();
  });
});
