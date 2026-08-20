import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { RaidEvent } from '@raidschedule/shared';
import { EventDetailDialog } from './EventDetailDialog.js';

const event: RaidEvent = {
  id: 'evt-1',
  source: 'raid-helper',
  raidName: 'Nerub-ar Palace',
  startsAt: '2026-08-18T20:00:00.000Z',
  status: 'confirmed',
  character: { name: 'Thrashclaw', className: 'Druid' },
};

describe('EventDetailDialog', () => {
  it('renders raid name, character, and no difficulty line', () => {
    render(<EventDetailDialog event={event} onClose={vi.fn()} />);
    expect(screen.getByText('Nerub-ar Palace')).toBeInTheDocument();
    expect(screen.getByText(/Thrashclaw · Druid/)).toBeInTheDocument();
    expect(screen.queryByText(/Difficulty/)).not.toBeInTheDocument();
  });

  it('calls onClose when the backdrop is clicked', async () => {
    const onClose = vi.fn();
    const { container } = render(<EventDetailDialog event={event} onClose={onClose} />);
    await userEvent.click(container.firstElementChild!);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when the × button is clicked', async () => {
    const onClose = vi.fn();
    render(<EventDetailDialog event={event} onClose={onClose} />);
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when the panel itself is clicked', async () => {
    const onClose = vi.fn();
    render(<EventDetailDialog event={event} onClose={onClose} />);
    await userEvent.click(screen.getByText('Nerub-ar Palace'));
    expect(onClose).not.toHaveBeenCalled();
  });
});
