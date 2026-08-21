import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EventComposer } from './EventComposer.js';
import type { ComposerState } from './composer.js';

function makeComposer(overrides: Partial<ComposerState> = {}): ComposerState {
  return {
    key: '2026-08-18',
    dateLabel: 'Tue, August 18, 2026',
    x: 100,
    y: 100,
    title: '',
    start: '20:00',
    end: '23:00',
    character: '',
    cls: 'Druid',
    status: 'confirmed',
    saving: false,
    saveError: null,
    ...overrides,
  };
}

describe('EventComposer', () => {
  it('renders the header title and date', () => {
    render(<EventComposer composer={makeComposer()} onChange={vi.fn()} onCancel={vi.fn()} onSave={vi.fn()} />);
    expect(screen.getByText('New event')).toBeInTheDocument();
    expect(screen.getByText('Tue, August 18, 2026')).toBeInTheDocument();
  });

  it('disables Add event when the title is empty and enables it once typed', () => {
    const { rerender } = render(
      <EventComposer composer={makeComposer({ title: '' })} onChange={vi.fn()} onCancel={vi.fn()} onSave={vi.fn()} />,
    );
    expect(screen.getByRole('button', { name: 'Add event' })).toBeDisabled();

    rerender(
      <EventComposer
        composer={makeComposer({ title: 'Nerub-ar Palace' })}
        onChange={vi.fn()}
        onCancel={vi.fn()}
        onSave={vi.fn()}
      />,
    );
    expect(screen.getByRole('button', { name: 'Add event' })).not.toBeDisabled();
  });

  it('treats a whitespace-only title as empty', () => {
    render(
      <EventComposer composer={makeComposer({ title: '   ' })} onChange={vi.fn()} onCancel={vi.fn()} onSave={vi.fn()} />,
    );
    expect(screen.getByRole('button', { name: 'Add event' })).toBeDisabled();
  });

  it('calls onCancel when Cancel is clicked', async () => {
    const onCancel = vi.fn();
    render(<EventComposer composer={makeComposer()} onChange={vi.fn()} onCancel={onCancel} onSave={vi.fn()} />);
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when the × button is clicked', async () => {
    const onCancel = vi.fn();
    render(<EventComposer composer={makeComposer()} onChange={vi.fn()} onCancel={onCancel} onSave={vi.fn()} />);
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when the overlay (outside the panel) is clicked', async () => {
    const onCancel = vi.fn();
    const { container } = render(
      <EventComposer composer={makeComposer()} onChange={vi.fn()} onCancel={onCancel} onSave={vi.fn()} />,
    );
    await userEvent.click(container.firstElementChild!);
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('does not call onCancel when the panel itself is clicked', async () => {
    const onCancel = vi.fn();
    render(<EventComposer composer={makeComposer()} onChange={vi.fn()} onCancel={onCancel} onSave={vi.fn()} />);
    await userEvent.click(screen.getByText('New event'));
    expect(onCancel).not.toHaveBeenCalled();
  });

  it('shows Druid selected by default', () => {
    render(<EventComposer composer={makeComposer()} onChange={vi.fn()} onCancel={vi.fn()} onSave={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Druid' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Mage' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('calls onChange with the picked class when a class option is clicked', async () => {
    const onChange = vi.fn();
    render(<EventComposer composer={makeComposer()} onChange={onChange} onCancel={vi.fn()} onSave={vi.fn()} />);
    await userEvent.click(screen.getByRole('button', { name: 'Mage' }));
    expect(onChange).toHaveBeenCalledWith({ cls: 'Mage' });
  });

  it('calls onChange when the title field is edited', async () => {
    const onChange = vi.fn();
    render(<EventComposer composer={makeComposer()} onChange={onChange} onCancel={vi.fn()} onSave={vi.fn()} />);
    await userEvent.type(screen.getByPlaceholderText('Black Temple'), 'X');
    expect(onChange).toHaveBeenCalledWith({ title: 'X' });
  });

  it('calls onChange when the character field is edited', async () => {
    const onChange = vi.fn();
    render(<EventComposer composer={makeComposer()} onChange={onChange} onCancel={vi.fn()} onSave={vi.fn()} />);
    await userEvent.type(screen.getByPlaceholderText('Character name'), 'X');
    expect(onChange).toHaveBeenCalledWith({ character: 'X' });
  });

  it('calls onSave when Add event is clicked with a title present', async () => {
    const onSave = vi.fn();
    render(
      <EventComposer
        composer={makeComposer({ title: 'Nerub-ar Palace' })}
        onChange={vi.fn()}
        onCancel={vi.fn()}
        onSave={onSave}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Add event' }));
    expect(onSave).toHaveBeenCalledTimes(1);
  });

  it('calls onSave when Enter is pressed in the title field with a title present', async () => {
    const onSave = vi.fn();
    render(
      <EventComposer
        composer={makeComposer({ title: 'Nerub-ar Palace' })}
        onChange={vi.fn()}
        onCancel={vi.fn()}
        onSave={onSave}
      />,
    );
    screen.getByPlaceholderText('Black Temple').focus();
    await userEvent.keyboard('{Enter}');
    expect(onSave).toHaveBeenCalledTimes(1);
  });

  it('calls onSave when Enter is pressed in the character field', async () => {
    const onSave = vi.fn();
    render(
      <EventComposer
        composer={makeComposer({ title: 'Nerub-ar Palace' })}
        onChange={vi.fn()}
        onCancel={vi.fn()}
        onSave={onSave}
      />,
    );
    screen.getByPlaceholderText('Character name').focus();
    await userEvent.keyboard('{Enter}');
    expect(onSave).toHaveBeenCalledTimes(1);
  });

  it('does not call onSave on Enter when the title is empty', async () => {
    const onSave = vi.fn();
    render(
      <EventComposer composer={makeComposer({ title: '' })} onChange={vi.fn()} onCancel={vi.fn()} onSave={onSave} />,
    );
    screen.getByPlaceholderText('Black Temple').focus();
    await userEvent.keyboard('{Enter}');
    expect(onSave).not.toHaveBeenCalled();
  });

  it('shows Signed up selected by default', () => {
    render(<EventComposer composer={makeComposer()} onChange={vi.fn()} onCancel={vi.fn()} onSave={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Signed up' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Tentative' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('calls onChange with pending status when Tentative is clicked', async () => {
    const onChange = vi.fn();
    render(<EventComposer composer={makeComposer()} onChange={onChange} onCancel={vi.fn()} onSave={vi.fn()} />);
    await userEvent.click(screen.getByRole('button', { name: 'Tentative' }));
    expect(onChange).toHaveBeenCalledWith({ status: 'pending' });
  });

  it('calls onChange with confirmed status when Signed up is clicked', async () => {
    const onChange = vi.fn();
    render(
      <EventComposer
        composer={makeComposer({ status: 'pending' })}
        onChange={onChange}
        onCancel={vi.fn()}
        onSave={vi.fn()}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Signed up' }));
    expect(onChange).toHaveBeenCalledWith({ status: 'confirmed' });
  });

  it('does not call onSave when Enter is pressed on a class option button', async () => {
    const onSave = vi.fn();
    const onChange = vi.fn();
    render(
      <EventComposer
        composer={makeComposer({ title: 'Nerub-ar Palace' })}
        onChange={onChange}
        onCancel={vi.fn()}
        onSave={onSave}
      />,
    );
    screen.getByRole('button', { name: 'Mage' }).focus();
    await userEvent.keyboard('{Enter}');
    expect(onSave).not.toHaveBeenCalled();
  });
});
