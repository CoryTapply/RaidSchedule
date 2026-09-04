import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MobileComposerSheet } from './MobileComposerSheet.js';
import type { MobileComposerState } from './mobileComposer.js';

function makeComposer(overrides: Partial<MobileComposerState> = {}): MobileComposerState {
  return {
    mode: 'create',
    key: '2026-08-30',
    dateLabel: 'Sun, August 30, 2026',
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

function renderSheet(overrides: Partial<MobileComposerState> = {}) {
  const onChange = vi.fn();
  const onStartChange = vi.fn();
  const onCancel = vi.fn();
  const onSave = vi.fn();
  const onDelete = vi.fn();
  const utils = render(
    <MobileComposerSheet
      composer={makeComposer(overrides)}
      onChange={onChange}
      onStartChange={onStartChange}
      onCancel={onCancel}
      onSave={onSave}
      onDelete={onDelete}
    />,
  );
  return { ...utils, onChange, onStartChange, onCancel, onSave, onDelete };
}

describe('MobileComposerSheet', () => {
  it('shows "New event" and an "Add" button, disabled while the title is empty', () => {
    renderSheet({ mode: 'create', title: '' });
    expect(screen.getByText('New event')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add' })).toBeDisabled();
  });

  it('enables Add once a title is entered', () => {
    renderSheet({ mode: 'create', title: 'Black Temple' });
    expect(screen.getByRole('button', { name: 'Add' })).toBeEnabled();
  });

  it('shows the live preview with "Untitled raid" placeholder and updates with the title', () => {
    const { rerender } = renderSheet({ mode: 'create', title: '' });
    expect(screen.getByText('Untitled raid')).toBeInTheDocument();

    rerender(
      <MobileComposerSheet
        composer={makeComposer({ title: 'Black Temple' })}
        onChange={vi.fn()}
        onStartChange={vi.fn()}
        onCancel={vi.fn()}
        onSave={vi.fn()}
        onDelete={vi.fn()}
      />,
    );
    expect(screen.getByText('Black Temple')).toBeInTheDocument();
  });

  it('calls onChange when the title is edited', () => {
    const { onChange } = renderSheet({ mode: 'create' });
    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Nerub-ar Palace' } });
    expect(onChange).toHaveBeenCalledWith({ title: 'Nerub-ar Palace' });
  });

  it('calls onCancel when Cancel is clicked', () => {
    const { onCancel } = renderSheet();
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('calls onSave when Save/Add is clicked and enabled', () => {
    const { onSave } = renderSheet({ title: 'Nerub-ar Palace' });
    fireEvent.click(screen.getByRole('button', { name: 'Add' }));
    expect(onSave).toHaveBeenCalledTimes(1);
  });

  describe('create / edit-custom', () => {
    it('shows editable Start/End time selects', () => {
      renderSheet({ mode: 'create' });
      expect(screen.getByLabelText('Start')).toBeInTheDocument();
      expect(screen.getByLabelText('End')).toBeInTheDocument();
      expect(screen.queryByText('Set in Raid-Helper.')).not.toBeInTheDocument();
    });

    it('shows Delete only in edit-custom mode, not create', () => {
      const { rerender } = renderSheet({ mode: 'create' });
      expect(screen.queryByRole('button', { name: 'Delete event' })).not.toBeInTheDocument();

      rerender(
        <MobileComposerSheet
          composer={makeComposer({ mode: 'edit-custom', id: 'custom:1', title: 'Test' })}
          onChange={vi.fn()}
          onStartChange={vi.fn()}
          onCancel={vi.fn()}
          onSave={vi.fn()}
          onDelete={vi.fn()}
        />,
      );
      expect(screen.getByRole('button', { name: 'Delete event' })).toBeInTheDocument();
    });

    it('shows "Save" (not "Add") and "Edit event" in edit-custom mode', () => {
      renderSheet({ mode: 'edit-custom', id: 'custom:1', title: 'Test' });
      expect(screen.getByText('Edit event')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    });

    it('calls onDelete when Delete is clicked', () => {
      const { onDelete } = renderSheet({ mode: 'edit-custom', id: 'custom:1', title: 'Test' });
      fireEvent.click(screen.getByRole('button', { name: 'Delete event' }));
      expect(onDelete).toHaveBeenCalledTimes(1);
    });

    it('does not show the Visibility control or Raid-Helper footer note', () => {
      renderSheet({ mode: 'edit-custom', id: 'custom:1', title: 'Test' });
      expect(screen.queryByLabelText('Visibility')).not.toBeInTheDocument();
      expect(screen.queryByText(/From Raid-Helper/)).not.toBeInTheDocument();
    });
  });

  describe('edit-raid-helper', () => {
    function raidHelperComposer(overrides: Partial<MobileComposerState> = {}) {
      return { mode: 'edit-raid-helper' as const, id: 'raid-helper:evt1:1', title: 'Test Raid', timeLabel: '8:00 PM – 11:00 PM', ...overrides };
    }

    it('shows a read-only time well instead of Start/End selects', () => {
      renderSheet(raidHelperComposer());
      expect(screen.queryByLabelText('Start')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('End')).not.toBeInTheDocument();
      expect(screen.getByText('Set in Raid-Helper.')).toBeInTheDocument();
      expect(screen.getByText('8:00 PM – 11:00 PM')).toBeInTheDocument();
    });

    it('shows the Visibility control', () => {
      renderSheet(raidHelperComposer());
      expect(screen.getByLabelText('Visibility')).toBeInTheDocument();
      expect(screen.getByText('Hide this from the calendar without deleting it in Raid-Helper.')).toBeInTheDocument();
    });

    it('shows the Raid-Helper footer note and hides Delete', () => {
      renderSheet(raidHelperComposer());
      expect(screen.getByText("From Raid-Helper. Times come from the bot and can't be changed here.")).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Delete event' })).not.toBeInTheDocument();
    });

    it('still allows editing identity fields (title, character, class, faction, status)', () => {
      const { onChange } = renderSheet(raidHelperComposer());
      fireEvent.change(screen.getByLabelText('Character'), { target: { value: 'Windrunner' } });
      expect(onChange).toHaveBeenCalledWith({ character: 'Windrunner' });
    });
  });

  it('shows a save error when present', () => {
    renderSheet({ saveError: 'Failed to save event (500)' });
    expect(screen.getByRole('alert')).toHaveTextContent('Failed to save event (500)');
  });

  describe('staying mounted across close/reopen (so closing can slide out instead of vanishing)', () => {
    it('pre-mounts inert placeholder content before the composer has ever been opened, so the first real open is not also the first mount', () => {
      render(
        <MobileComposerSheet composer={null} onChange={vi.fn()} onStartChange={vi.fn()} onCancel={vi.fn()} onSave={vi.fn()} onDelete={vi.fn()} />,
      );
      expect(screen.getByRole('dialog').closest('[inert]')).not.toBeNull();
    });

    it('focuses the dialog container (not a field) on a real open — autofocusing a field would force the keyboard up and can trigger the iOS zoom bug', () => {
      const { rerender } = render(
        <MobileComposerSheet composer={null} onChange={vi.fn()} onStartChange={vi.fn()} onCancel={vi.fn()} onSave={vi.fn()} onDelete={vi.fn()} />,
      );
      expect(screen.getByRole('dialog')).not.toHaveFocus();
      expect(screen.getByLabelText('Title')).not.toHaveFocus();

      rerender(
        <MobileComposerSheet
          composer={makeComposer()}
          onChange={vi.fn()}
          onStartChange={vi.fn()}
          onCancel={vi.fn()}
          onSave={vi.fn()}
          onDelete={vi.fn()}
        />,
      );
      expect(screen.getByRole('dialog')).toHaveFocus();
      expect(screen.getByLabelText('Title')).not.toHaveFocus();
    });

    it('keeps rendering the last draft, marked inert, once composer goes back to null', () => {
      const { rerender } = render(
        <MobileComposerSheet
          composer={makeComposer({ title: 'Nerub-ar Palace' })}
          onChange={vi.fn()}
          onStartChange={vi.fn()}
          onCancel={vi.fn()}
          onSave={vi.fn()}
          onDelete={vi.fn()}
        />,
      );
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByRole('dialog').closest('[inert]')).toBeNull();

      rerender(
        <MobileComposerSheet composer={null} onChange={vi.fn()} onStartChange={vi.fn()} onCancel={vi.fn()} onSave={vi.fn()} onDelete={vi.fn()} />,
      );
      // Still in the DOM with its last content, not unmounted — that's what lets it slide out.
      expect(screen.getByText('Nerub-ar Palace')).toBeInTheDocument();
      expect(screen.getByRole('dialog').closest('[inert]')).not.toBeNull();
    });

    it('shows fresh content and clears inert when reopened with a new draft', () => {
      const { rerender } = render(
        <MobileComposerSheet
          composer={makeComposer({ title: 'First' })}
          onChange={vi.fn()}
          onStartChange={vi.fn()}
          onCancel={vi.fn()}
          onSave={vi.fn()}
          onDelete={vi.fn()}
        />,
      );
      rerender(
        <MobileComposerSheet composer={null} onChange={vi.fn()} onStartChange={vi.fn()} onCancel={vi.fn()} onSave={vi.fn()} onDelete={vi.fn()} />,
      );
      rerender(
        <MobileComposerSheet
          composer={makeComposer({ title: 'Second' })}
          onChange={vi.fn()}
          onStartChange={vi.fn()}
          onCancel={vi.fn()}
          onSave={vi.fn()}
          onDelete={vi.fn()}
        />,
      );

      expect(screen.queryByText('First')).not.toBeInTheDocument();
      expect(screen.getByText('Second')).toBeInTheDocument();
      expect(screen.getByRole('dialog').closest('[inert]')).toBeNull();
    });
  });
});
