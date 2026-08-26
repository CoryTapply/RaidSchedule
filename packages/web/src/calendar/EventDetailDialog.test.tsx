import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { RaidEvent } from '@raidschedule/shared';
import { EventDetailDialog } from './EventDetailDialog.js';

const event: RaidEvent = {
  id: 'raid-helper:evt1:1',
  raidHelperEventId: 'evt1',
  source: 'raid-helper',
  raidName: 'Nerub-ar Palace',
  startsAt: '2026-08-18T20:00:00.000Z',
  endsAt: '2026-08-18T23:00:00.000Z',
  status: 'confirmed',
  character: { name: 'Thrashclaw', className: 'Druid' },
};

const customEvent: RaidEvent = {
  ...event,
  id: 'custom:evt-1',
  raidHelperEventId: undefined,
  source: 'custom',
};

describe('EventDetailDialog', () => {
  it('renders raid name, character, and class', () => {
    render(<EventDetailDialog event={event} onClose={vi.fn()} onEdit={vi.fn()} />);
    expect(screen.getByText('Nerub-ar Palace')).toBeInTheDocument();
    expect(screen.getByText('Thrashclaw')).toBeInTheDocument();
    expect(screen.getByText('Druid')).toBeInTheDocument();
  });

  it('renders the date and full time range in the description', () => {
    render(<EventDetailDialog event={event} onClose={vi.fn()} onEdit={vi.fn()} />);
    expect(screen.getByText(/August 18, 2026/)).toBeInTheDocument();
  });

  it('shows a Confirmed badge for a confirmed event and Signed up for a pending one', () => {
    const { rerender } = render(<EventDetailDialog event={event} onClose={vi.fn()} onEdit={vi.fn()} />);
    expect(screen.getByText('Confirmed')).toBeInTheDocument();

    rerender(<EventDetailDialog event={{ ...event, status: 'pending' }} onClose={vi.fn()} onEdit={vi.fn()} />);
    expect(screen.getByText('Signed up')).toBeInTheDocument();
  });

  it('calls onClose when the backdrop is clicked', async () => {
    const onClose = vi.fn();
    const { container } = render(<EventDetailDialog event={event} onClose={onClose} onEdit={vi.fn()} />);
    await userEvent.click(container.firstElementChild!);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when the close button is clicked', async () => {
    const onClose = vi.fn();
    render(<EventDetailDialog event={event} onClose={onClose} onEdit={vi.fn()} />);
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when the panel itself is clicked', async () => {
    const onClose = vi.fn();
    render(<EventDetailDialog event={event} onClose={onClose} onEdit={vi.fn()} />);
    await userEvent.click(screen.getByText('Nerub-ar Palace'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('calls onEdit with just the event (no position — this always opens centered) when Edit is clicked', async () => {
    const onEdit = vi.fn();
    render(<EventDetailDialog event={event} onClose={vi.fn()} onEdit={onEdit} />);
    await userEvent.click(screen.getByRole('button', { name: 'Edit' }));
    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onEdit).toHaveBeenCalledWith(event);
  });

  it('shows the Raid-Helper time note for a raid-helper event', () => {
    render(<EventDetailDialog event={event} onClose={vi.fn()} onEdit={vi.fn()} />);
    expect(screen.getByText("Times come from Raid-Helper and can't be changed here.")).toBeInTheDocument();
  });

  it('does not show the Raid-Helper time note for a custom event', () => {
    render(<EventDetailDialog event={customEvent} onClose={vi.fn()} onEdit={vi.fn()} />);
    expect(screen.queryByText("Times come from Raid-Helper and can't be changed here.")).not.toBeInTheDocument();
  });
});
