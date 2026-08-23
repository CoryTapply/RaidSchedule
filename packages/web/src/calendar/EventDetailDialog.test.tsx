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

const customEvent: RaidEvent = {
  ...event,
  id: 'custom:evt-1',
  source: 'custom',
};

const pendingCustomEvent: RaidEvent = {
  ...customEvent,
  status: 'pending',
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

  it('does not render a delete button for a raid-helper event', () => {
    render(<EventDetailDialog event={event} onClose={vi.fn()} />);
    expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument();
  });

  it('requires a second click to confirm deleting a custom event', async () => {
    const onDelete = vi.fn();
    render(<EventDetailDialog event={customEvent} onClose={vi.fn()} onDelete={onDelete} />);

    const deleteButton = screen.getByRole('button', { name: 'Delete event' });
    await userEvent.click(deleteButton);
    expect(onDelete).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Confirm delete' })).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Confirm delete' }));
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it('disables the delete button and shows progress text while deleting', () => {
    render(<EventDetailDialog event={customEvent} onClose={vi.fn()} deleting />);
    const deleteButton = screen.getByRole('button', { name: 'Deleting…' });
    expect(deleteButton).toBeDisabled();
  });

  it('shows a delete error message when present', () => {
    render(<EventDetailDialog event={customEvent} onClose={vi.fn()} deleteError="Failed to delete event (500)" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Failed to delete event (500)');
  });

  it('does not render a confirm button for a confirmed custom event', () => {
    render(<EventDetailDialog event={customEvent} onClose={vi.fn()} />);
    expect(screen.queryByRole('button', { name: /mark confirmed/i })).not.toBeInTheDocument();
  });

  it('does not render a confirm button for a pending raid-helper event', () => {
    render(<EventDetailDialog event={{ ...event, status: 'pending' }} onClose={vi.fn()} />);
    expect(screen.queryByRole('button', { name: /mark confirmed/i })).not.toBeInTheDocument();
  });

  it('calls onConfirm on a single click for a pending custom event, no double-confirm needed', async () => {
    const onConfirm = vi.fn();
    render(<EventDetailDialog event={pendingCustomEvent} onClose={vi.fn()} onConfirm={onConfirm} />);

    await userEvent.click(screen.getByRole('button', { name: 'Mark confirmed' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('disables the confirm button and shows progress text while confirming', () => {
    render(<EventDetailDialog event={pendingCustomEvent} onClose={vi.fn()} confirming />);
    const confirmButton = screen.getByRole('button', { name: 'Confirming…' });
    expect(confirmButton).toBeDisabled();
  });

  it('shows a confirm error message when present', () => {
    render(
      <EventDetailDialog event={pendingCustomEvent} onClose={vi.fn()} confirmError="Failed to confirm event (500)" />,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Failed to confirm event (500)');
  });

  it('does not render a Horde toggle when onToggleHorde is not provided', () => {
    render(<EventDetailDialog event={event} onClose={vi.fn()} />);
    expect(screen.queryByRole('button', { name: /horde/i })).not.toBeInTheDocument();
  });

  it('offers to mark a non-Horde raid-helper event as Horde, and calls onToggleHorde when clicked', async () => {
    const onToggleHorde = vi.fn();
    render(<EventDetailDialog event={event} onClose={vi.fn()} onToggleHorde={onToggleHorde} />);

    const toggleButton = screen.getByRole('button', { name: 'Mark as Horde' });
    await userEvent.click(toggleButton);
    expect(onToggleHorde).toHaveBeenCalledTimes(1);
  });

  it('offers to remove the Horde tag from an already-tagged raid-helper event', () => {
    render(<EventDetailDialog event={{ ...event, isHorde: true }} onClose={vi.fn()} onToggleHorde={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Remove Horde tag' })).toBeInTheDocument();
  });

  it('does not render a Horde toggle for a custom event when onToggleHorde is not provided', () => {
    render(<EventDetailDialog event={customEvent} onClose={vi.fn()} />);
    expect(screen.queryByRole('button', { name: /horde/i })).not.toBeInTheDocument();
  });

  it('offers to mark a non-Horde custom event as Horde, and calls onToggleHorde when clicked', async () => {
    const onToggleHorde = vi.fn();
    render(<EventDetailDialog event={customEvent} onClose={vi.fn()} onToggleHorde={onToggleHorde} />);

    const toggleButton = screen.getByRole('button', { name: 'Mark as Horde' });
    await userEvent.click(toggleButton);
    expect(onToggleHorde).toHaveBeenCalledTimes(1);
  });

  it('offers to remove the Horde tag from an already-tagged custom event', () => {
    render(<EventDetailDialog event={{ ...customEvent, isHorde: true }} onClose={vi.fn()} onToggleHorde={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Remove Horde tag' })).toBeInTheDocument();
  });

  it('disables the Horde toggle and shows progress text while updating', () => {
    render(<EventDetailDialog event={event} onClose={vi.fn()} onToggleHorde={vi.fn()} togglingHorde />);
    const toggleButton = screen.getByRole('button', { name: 'Updating…' });
    expect(toggleButton).toBeDisabled();
  });

  it('shows a Horde tag error message when present', () => {
    render(
      <EventDetailDialog event={event} onClose={vi.fn()} onToggleHorde={vi.fn()} hordeError="Failed to update Horde tag (500)" />,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Failed to update Horde tag (500)');
  });
});
