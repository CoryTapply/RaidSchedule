import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { RaidEvent } from '@raidschedule/shared';
import { MobileDetailSheet } from './MobileDetailSheet.js';

function makeEvent(overrides: Partial<RaidEvent> = {}): RaidEvent {
  return {
    id: 'evt-1',
    source: 'custom',
    raidName: 'Nerub-ar Palace',
    startsAt: '2026-08-29T20:00:00.000Z',
    endsAt: '2026-08-29T23:00:00.000Z',
    status: 'confirmed',
    character: { name: 'Thrashclaw', className: 'Druid' },
    ...overrides,
  };
}

describe('MobileDetailSheet', () => {
  it('renders the title, date/time, character, and class', () => {
    render(<MobileDetailSheet event={makeEvent()} onClose={vi.fn()} onEdit={vi.fn()} />);
    expect(screen.getByText('Nerub-ar Palace')).toBeInTheDocument();
    expect(screen.getByText(/^\w{3} \d{1,2}, \d{4} · /)).toBeInTheDocument();
    expect(screen.getByText('Thrashclaw')).toBeInTheDocument();
    expect(screen.getByText('Druid')).toBeInTheDocument();
  });

  it('shows a Confirmed badge for a confirmed event, Signed up otherwise', () => {
    const { rerender } = render(<MobileDetailSheet event={makeEvent({ status: 'confirmed' })} onClose={vi.fn()} onEdit={vi.fn()} />);
    expect(screen.getByText('Confirmed')).toBeInTheDocument();

    rerender(<MobileDetailSheet event={makeEvent({ status: 'pending' })} onClose={vi.fn()} onEdit={vi.fn()} />);
    expect(screen.getByText('Signed up')).toBeInTheDocument();
  });

  it('has only the ✕ icon button and Edit — no separate Close button', () => {
    render(<MobileDetailSheet event={makeEvent()} onClose={vi.fn()} onEdit={vi.fn()} />);
    expect(screen.getAllByRole('button')).toHaveLength(2);
  });

  it('calls onClose when the ✕ button is clicked', () => {
    const onClose = vi.fn();
    render(<MobileDetailSheet event={makeEvent()} onClose={onClose} onEdit={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when the scrim is clicked, but not when the sheet itself is clicked', () => {
    const onClose = vi.fn();
    const { container } = render(<MobileDetailSheet event={makeEvent()} onClose={onClose} onEdit={vi.fn()} />);
    fireEvent.click(screen.getByRole('dialog'));
    expect(onClose).not.toHaveBeenCalled();

    fireEvent.click(container.firstChild as Element);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onEdit with the event when Edit is clicked', () => {
    const onEdit = vi.fn();
    const event = makeEvent();
    render(<MobileDetailSheet event={event} onClose={vi.fn()} onEdit={onEdit} />);
    fireEvent.click(screen.getByRole('button', { name: 'Edit' }));
    expect(onEdit).toHaveBeenCalledWith(event);
  });

  describe('staying mounted across close/reopen (so closing can slide out instead of vanishing)', () => {
    it('is inert when rendered with event=null', () => {
      render(<MobileDetailSheet event={null} onClose={vi.fn()} onEdit={vi.fn()} />);
      expect(screen.getByRole('dialog').closest('[inert]')).not.toBeNull();
    });

    it('keeps rendering the last event, marked inert, once event goes back to null', () => {
      const { rerender } = render(<MobileDetailSheet event={makeEvent()} onClose={vi.fn()} onEdit={vi.fn()} />);
      expect(screen.getByRole('dialog').closest('[inert]')).toBeNull();

      rerender(<MobileDetailSheet event={null} onClose={vi.fn()} onEdit={vi.fn()} />);
      expect(screen.getByText('Nerub-ar Palace')).toBeInTheDocument();
      expect(screen.getByRole('dialog').closest('[inert]')).not.toBeNull();
    });

    it('shows fresh content and clears inert when reopened with a new event', () => {
      const { rerender } = render(<MobileDetailSheet event={makeEvent({ raidName: 'First' })} onClose={vi.fn()} onEdit={vi.fn()} />);
      rerender(<MobileDetailSheet event={null} onClose={vi.fn()} onEdit={vi.fn()} />);
      rerender(<MobileDetailSheet event={makeEvent({ raidName: 'Second' })} onClose={vi.fn()} onEdit={vi.fn()} />);

      expect(screen.queryByText('First')).not.toBeInTheDocument();
      expect(screen.getByText('Second')).toBeInTheDocument();
      expect(screen.getByRole('dialog').closest('[inert]')).toBeNull();
    });
  });
});
