import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EventComposer } from './EventComposer.js';
import type { ComposerState } from './composer.js';

function makeComposer(overrides: Partial<ComposerState> = {}): ComposerState {
  return {
    mode: 'create',
    key: '2026-08-18',
    dateLabel: 'Tue, August 18, 2026',
    centered: false,
    x: 100,
    y: 100,
    title: '',
    start: '20:00',
    end: '23:00',
    timeLabel: '',
    character: '',
    cls: 'Druid',
    status: 'confirmed',
    isHorde: false,
    hidden: false,
    saving: false,
    saveError: null,
    ...overrides,
  };
}

function renderComposer(overrides: Partial<ComposerState> = {}) {
  const onChange = vi.fn();
  const onCancel = vi.fn();
  const onSave = vi.fn();
  const onDelete = vi.fn();
  const utils = render(
    <EventComposer composer={makeComposer(overrides)} onChange={onChange} onCancel={onCancel} onSave={onSave} onDelete={onDelete} />,
  );
  return { ...utils, onChange, onCancel, onSave, onDelete };
}

describe('EventComposer', () => {
  it('renders the header mode label and date for a new event', () => {
    renderComposer();
    expect(screen.getByText('New event')).toBeInTheDocument();
    expect(screen.getByText('Tue, August 18, 2026')).toBeInTheDocument();
  });

  it('renders "Edit event" for an edit-custom composer', () => {
    renderComposer({ mode: 'edit-custom', id: 'custom:evt-1' });
    expect(screen.getByText('Edit event')).toBeInTheDocument();
  });

  it('renders "Edit Raid-Helper event" for an edit-raid-helper composer', () => {
    renderComposer({ mode: 'edit-raid-helper', id: 'raid-helper:1:1' });
    expect(screen.getByText('Edit Raid-Helper event')).toBeInTheDocument();
  });

  it('anchors the panel at composer.x/y when not centered', () => {
    renderComposer({ centered: false, x: 123, y: 45 });
    const panel = screen.getByText('New event').closest('div[class*="panel"]') as HTMLElement;
    expect(panel.style.left).toBe('123px');
    expect(panel.style.top).toBe('45px');
    expect(panel.className).not.toMatch(/panelCentered/);
  });

  it('centers the panel instead of anchoring it at x/y when centered', () => {
    renderComposer({ centered: true, x: 123, y: 45 });
    const panel = screen.getByText('New event').closest('div[class*="panel"]') as HTMLElement;
    expect(panel.style.left).toBe('');
    expect(panel.style.top).toBe('');
    expect(panel.className).toMatch(/panelCentered/);
  });

  it('disables Add event when the title is empty and enables it once typed', () => {
    const { rerender, onChange, onCancel, onSave, onDelete } = renderComposer({ title: '' });
    expect(screen.getByRole('button', { name: 'Add event' })).toBeDisabled();

    rerender(
      <EventComposer
        composer={makeComposer({ title: 'Nerub-ar Palace' })}
        onChange={onChange}
        onCancel={onCancel}
        onSave={onSave}
        onDelete={onDelete}
      />,
    );
    expect(screen.getByRole('button', { name: 'Add event' })).not.toBeDisabled();
  });

  it('shows Save instead of Add event when editing', () => {
    renderComposer({ mode: 'edit-custom', id: 'custom:evt-1', title: 'Nerub-ar Palace' });
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Add event' })).not.toBeInTheDocument();
  });

  it('treats a whitespace-only title as empty', () => {
    renderComposer({ title: '   ' });
    expect(screen.getByRole('button', { name: 'Add event' })).toBeDisabled();
  });

  it('calls onCancel when Cancel is clicked', async () => {
    const { onCancel } = renderComposer();
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when the close button is clicked', async () => {
    const { onCancel } = renderComposer();
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when the overlay (outside the panel) is clicked', async () => {
    const { container, onCancel } = renderComposer();
    await userEvent.click(container.firstElementChild!);
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('does not call onCancel when the panel itself is clicked', async () => {
    const { onCancel } = renderComposer();
    await userEvent.click(screen.getByText('New event'));
    expect(onCancel).not.toHaveBeenCalled();
  });

  it('shows Druid selected by default', () => {
    renderComposer();
    expect(screen.getByRole('combobox', { name: 'Class' })).toHaveValue('Druid');
  });

  it('calls onChange with the picked class when a new class is selected', async () => {
    const { onChange } = renderComposer();
    await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Class' }), 'Mage');
    expect(onChange).toHaveBeenCalledWith({ cls: 'Mage' });
  });

  it('calls onChange when the title field is edited', async () => {
    const { onChange } = renderComposer();
    await userEvent.type(screen.getByPlaceholderText('Black Temple'), 'X');
    expect(onChange).toHaveBeenCalledWith({ title: 'X' });
  });

  it('calls onChange when the character field is edited', async () => {
    const { onChange } = renderComposer();
    await userEvent.type(screen.getByPlaceholderText('Character name'), 'X');
    expect(onChange).toHaveBeenCalledWith({ character: 'X' });
  });

  it('calls onSave when Add event is clicked with a title present', async () => {
    const { onSave } = renderComposer({ title: 'Nerub-ar Palace' });
    await userEvent.click(screen.getByRole('button', { name: 'Add event' }));
    expect(onSave).toHaveBeenCalledTimes(1);
  });

  it('calls onSave when Enter is pressed in the title field with a title present', async () => {
    const { onSave } = renderComposer({ title: 'Nerub-ar Palace' });
    screen.getByPlaceholderText('Black Temple').focus();
    await userEvent.keyboard('{Enter}');
    expect(onSave).toHaveBeenCalledTimes(1);
  });

  it('calls onSave when Enter is pressed in the character field', async () => {
    const { onSave } = renderComposer({ title: 'Nerub-ar Palace' });
    screen.getByPlaceholderText('Character name').focus();
    await userEvent.keyboard('{Enter}');
    expect(onSave).toHaveBeenCalledTimes(1);
  });

  it('does not call onSave on Enter when the title is empty', async () => {
    const { onSave } = renderComposer({ title: '' });
    screen.getByPlaceholderText('Black Temple').focus();
    await userEvent.keyboard('{Enter}');
    expect(onSave).not.toHaveBeenCalled();
  });

  it('shows Confirmed selected by default', () => {
    renderComposer();
    expect(screen.getByRole('tab', { name: 'Confirmed' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'Signed up' })).toHaveAttribute('aria-selected', 'false');
  });

  it('calls onChange with pending status when Signed up is clicked', async () => {
    const { onChange } = renderComposer();
    await userEvent.click(screen.getByRole('tab', { name: 'Signed up' }));
    expect(onChange).toHaveBeenCalledWith({ status: 'pending' });
  });

  it('calls onChange with confirmed status when Confirmed is clicked', async () => {
    const { onChange } = renderComposer({ status: 'pending' });
    await userEvent.click(screen.getByRole('tab', { name: 'Confirmed' }));
    expect(onChange).toHaveBeenCalledWith({ status: 'confirmed' });
  });

  it('shows Alliance selected by default', () => {
    renderComposer();
    expect(screen.getByRole('tab', { name: 'Alliance' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'Horde' })).toHaveAttribute('aria-selected', 'false');
  });

  it('calls onChange with isHorde true when Horde is clicked', async () => {
    const { onChange } = renderComposer();
    await userEvent.click(screen.getByRole('tab', { name: 'Horde' }));
    expect(onChange).toHaveBeenCalledWith({ isHorde: true });
  });

  it('calls onChange with isHorde false when Alliance is clicked', async () => {
    const { onChange } = renderComposer({ isHorde: true });
    await userEvent.click(screen.getByRole('tab', { name: 'Alliance' }));
    expect(onChange).toHaveBeenCalledWith({ isHorde: false });
  });

  it('does not call onSave when Enter is pressed on a status option button', async () => {
    const { onSave } = renderComposer({ title: 'Nerub-ar Palace' });
    screen.getByRole('tab', { name: 'Signed up' }).focus();
    await userEvent.keyboard('{Enter}');
    expect(onSave).not.toHaveBeenCalled();
  });

  it('shows editable Start/End time inputs for a new event', () => {
    renderComposer();
    expect(screen.getByLabelText('Start')).toBeInTheDocument();
    expect(screen.getByLabelText('End')).toBeInTheDocument();
  });

  it('shows editable Start/End time inputs when editing a custom event', () => {
    renderComposer({ mode: 'edit-custom', id: 'custom:evt-1' });
    expect(screen.getByLabelText('Start')).toBeInTheDocument();
    expect(screen.getByLabelText('End')).toBeInTheDocument();
  });

  it('shows a read-only time well instead of Start/End when editing a Raid-Helper event', () => {
    renderComposer({ mode: 'edit-raid-helper', id: 'raid-helper:1:1', timeLabel: '8:00 PM – 11:00 PM' });
    expect(screen.queryByLabelText('Start')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('End')).not.toBeInTheDocument();
    expect(screen.getByText('8:00 PM – 11:00 PM')).toBeInTheDocument();
    expect(screen.getByText('Set in Raid-Helper.')).toBeInTheDocument();
  });

  it('shows a Delete button only when editing a custom event, and calls onDelete', async () => {
    const { onDelete } = renderComposer({ mode: 'edit-custom', id: 'custom:evt-1', title: 'Nerub-ar Palace' });
    const deleteButton = screen.getByRole('button', { name: 'Delete' });
    await userEvent.click(deleteButton);
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it('does not show a Delete button for a new event', () => {
    renderComposer();
    expect(screen.queryByRole('button', { name: 'Delete' })).not.toBeInTheDocument();
  });

  it('does not show a Delete button when editing a Raid-Helper event', () => {
    renderComposer({ mode: 'edit-raid-helper', id: 'raid-helper:1:1' });
    expect(screen.queryByRole('button', { name: 'Delete' })).not.toBeInTheDocument();
  });

  it('shows "From Raid-Helper" only when editing a Raid-Helper event', () => {
    renderComposer({ mode: 'edit-raid-helper', id: 'raid-helper:1:1' });
    expect(screen.getByText('From Raid-Helper')).toBeInTheDocument();
  });

  it('shows "Esc to dismiss" only for a new event', () => {
    renderComposer();
    expect(screen.getByText('Esc to dismiss')).toBeInTheDocument();
  });

  it('shows the save error when present', () => {
    renderComposer({ saveError: 'Failed to save event (500)' });
    expect(screen.getByRole('alert')).toHaveTextContent('Failed to save event (500)');
  });
});
