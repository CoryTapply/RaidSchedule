import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { RaidEvent, TimelinePlacement } from '@raidschedule/shared';
import { EventBlock } from './EventBlock.js';

function makePlacement(overrides: Partial<RaidEvent> = {}): TimelinePlacement<RaidEvent> {
  const event: RaidEvent = {
    id: 'evt-1',
    source: 'raid-helper',
    raidName: 'Nerub-ar Palace',
    startsAt: '2026-08-18T20:00:00.000Z',
    endsAt: '2026-08-18T23:00:00.000Z',
    status: 'pending',
    character: { name: 'Thrashclaw', className: 'Druid' },
    isHorde: false,
    ...overrides,
  };
  return { event, topHours: 3, heightHours: 3, laneIndex: 0, laneCount: 1 };
}

describe('EventBlock', () => {
  it('renders the raid name and character', () => {
    render(<EventBlock placement={makePlacement()} onSelect={vi.fn()} />);
    expect(screen.getByText('Nerub-ar Palace')).toBeInTheDocument();
    expect(screen.getByText(/Thrashclaw/)).toBeInTheDocument();
  });

  it('calls onSelect with the event when clicked', async () => {
    const onSelect = vi.fn();
    const placement = makePlacement();
    render(<EventBlock placement={placement} onSelect={onSelect} />);
    await userEvent.click(screen.getByRole('button'));
    expect(onSelect).toHaveBeenCalledWith(placement.event);
  });

  it('calls onSelect on Enter key press', async () => {
    const onSelect = vi.fn();
    const placement = makePlacement();
    render(<EventBlock placement={placement} onSelect={onSelect} />);
    screen.getByRole('button').focus();
    await userEvent.keyboard('{Enter}');
    expect(onSelect).toHaveBeenCalledWith(placement.event);
  });

  it('shows the Horde mark only on Horde-tagged events', () => {
    const { rerender } = render(<EventBlock placement={makePlacement({ isHorde: true })} onSelect={vi.fn()} />);
    expect(screen.getByTestId('horde-mark')).toBeInTheDocument();

    rerender(<EventBlock placement={makePlacement({ isHorde: false })} onSelect={vi.fn()} />);
    expect(screen.queryByTestId('horde-mark')).not.toBeInTheDocument();
  });
});
