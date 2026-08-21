import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { RaidEvent } from '@raidschedule/shared';
import { EventCard, isHordeTitle } from './EventCard.js';

function makeEvent(overrides: Partial<RaidEvent> = {}): RaidEvent {
  return {
    id: 'evt-1',
    source: 'raid-helper',
    raidName: 'Nerub-ar Palace',
    startsAt: '2026-08-18T20:00:00.000Z',
    status: 'pending',
    character: { name: 'Thrashclaw', className: 'Druid' },
    ...overrides,
  };
}

describe('EventCard', () => {
  it('renders the raid name and character', () => {
    render(<EventCard event={makeEvent()} onSelect={vi.fn()} />);
    expect(screen.getByText('Nerub-ar Palace')).toBeInTheDocument();
    expect(screen.getByText('Thrashclaw')).toBeInTheDocument();
  });

  it('does not render a status line for pending or confirmed events', () => {
    const { rerender } = render(<EventCard event={makeEvent({ status: 'pending' })} onSelect={vi.fn()} />);
    expect(screen.queryByText('Signed up')).not.toBeInTheDocument();

    rerender(<EventCard event={makeEvent({ status: 'confirmed' })} onSelect={vi.fn()} />);
    expect(screen.queryByText('Confirmed')).not.toBeInTheDocument();
  });

  it('calls onSelect with the event when clicked', async () => {
    const onSelect = vi.fn();
    const event = makeEvent();
    render(<EventCard event={event} onSelect={onSelect} />);
    await userEvent.click(screen.getByRole('button'));
    expect(onSelect).toHaveBeenCalledWith(event);
  });

  it('calls onSelect on Enter key press', async () => {
    const onSelect = vi.fn();
    const event = makeEvent();
    render(<EventCard event={event} onSelect={onSelect} />);
    screen.getByRole('button').focus();
    await userEvent.keyboard('{Enter}');
    expect(onSelect).toHaveBeenCalledWith(event);
  });

  describe('isHordeTitle', () => {
    it('matches "horde" case-insensitively anywhere in the title', () => {
      expect(isHordeTitle('Thursday Horde Run')).toBe(true);
      expect(isHordeTitle('HORDE NAXX GDKP')).toBe(true);
      expect(isHordeTitle('friday horde gdkp')).toBe(true);
      expect(isHordeTitle('Wed Ally Run')).toBe(false);
      expect(isHordeTitle('Nerub-ar Palace')).toBe(false);
    });
  });

  it('shows the Horde icon in the class badge when the title contains "horde", and the class initial otherwise', () => {
    const { rerender } = render(<EventCard event={makeEvent({ raidName: 'Thursday Horde Run' })} onSelect={vi.fn()} />);
    expect(screen.getByRole('img', { name: 'Horde' })).toBeInTheDocument();
    expect(screen.queryByText('D')).not.toBeInTheDocument();

    rerender(<EventCard event={makeEvent({ raidName: 'Wed Ally Run' })} onSelect={vi.fn()} />);
    expect(screen.queryByRole('img', { name: 'Horde' })).not.toBeInTheDocument();
    expect(screen.getByText('D')).toBeInTheDocument();
  });
});
