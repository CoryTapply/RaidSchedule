import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { RaidEvent, TimelinePlacement } from '@raidschedule/shared';
import { EventBlock } from './EventBlock.js';

function makePlacement(
  overrides: Partial<RaidEvent> = {},
  placementOverrides: Partial<Omit<TimelinePlacement<RaidEvent>, 'event'>> = {},
): TimelinePlacement<RaidEvent> {
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
  return { event, topHours: 3, heightHours: 3, laneIndex: 0, laneCount: 1, ...placementOverrides };
}

function renderBlock(placement: TimelinePlacement<RaidEvent>) {
  const onSelect = vi.fn();
  const onEdit = vi.fn();
  const utils = render(<EventBlock placement={placement} onSelect={onSelect} onEdit={onEdit} />);
  return { ...utils, onSelect, onEdit };
}

describe('EventBlock', () => {
  it('renders the raid name and character', () => {
    renderBlock(makePlacement());
    expect(screen.getByText('Nerub-ar Palace')).toBeInTheDocument();
    expect(screen.getByText(/Thrashclaw/)).toBeInTheDocument();
  });

  it('calls onSelect with the event when clicked', async () => {
    const placement = makePlacement();
    const { onSelect } = renderBlock(placement);
    await userEvent.click(screen.getByRole('button'));
    expect(onSelect).toHaveBeenCalledWith(placement.event);
  });

  it('calls onSelect on Enter key press', async () => {
    const placement = makePlacement();
    const { onSelect } = renderBlock(placement);
    screen.getByRole('button').focus();
    await userEvent.keyboard('{Enter}');
    expect(onSelect).toHaveBeenCalledWith(placement.event);
  });

  it('calls onEdit with the event and click position on right-click, without opening the native menu', () => {
    const placement = makePlacement();
    const { onEdit } = renderBlock(placement);
    const result = fireEvent.contextMenu(screen.getByRole('button'), { clientX: 42, clientY: 24 });
    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onEdit.mock.calls[0]![0]).toBe(placement.event);
    expect(onEdit.mock.calls[0]![1]).toMatchObject({ clientX: 42, clientY: 24 });
    // fireEvent.contextMenu returns false when preventDefault() was called.
    expect(result).toBe(false);
  });

  it('shows the Horde mark only on Horde-tagged events', () => {
    const { rerender } = render(<EventBlock placement={makePlacement({ isHorde: true })} onSelect={vi.fn()} onEdit={vi.fn()} />);
    expect(screen.getByTestId('horde-mark')).toBeInTheDocument();

    rerender(<EventBlock placement={makePlacement({ isHorde: false })} onSelect={vi.fn()} onEdit={vi.fn()} />);
    expect(screen.queryByTestId('horde-mark')).not.toBeInTheDocument();
  });

  describe('an event longer than 1 hour', () => {
    it('shows the title and a separate "time · character" line', () => {
      renderBlock(makePlacement({}, { heightHours: 2 }));
      expect(screen.getByText('Nerub-ar Palace')).toBeInTheDocument();
      expect(screen.getByText(/^\d{1,2}:\d{2}\s?(AM|PM) · Thrashclaw$/)).toBeInTheDocument();
    });

    it('uses the full-size Horde mark', () => {
      renderBlock(makePlacement({ isHorde: true }, { heightHours: 2 }));
      const mark = screen.getByTestId('horde-mark');
      expect(mark.className).not.toMatch(/hordeMarkSmall/);
    });
  });

  describe('an event 1 hour or shorter', () => {
    it('combines the title and character onto one "Title · Character" line, without the time', () => {
      renderBlock(makePlacement({}, { heightHours: 1 }));
      expect(screen.getByRole('button')).toHaveTextContent('Nerub-ar Palace · Thrashclaw');
      expect(screen.queryByText(/\d{1,2}:\d{2}\s?(AM|PM)/)).not.toBeInTheDocument();
    });

    it('uses the smaller Horde mark', () => {
      renderBlock(makePlacement({ isHorde: true }, { heightHours: 1 }));
      const mark = screen.getByTestId('horde-mark');
      expect(mark.className).toMatch(/hordeMarkSmall/);
    });

    it('reserves room for the Horde mark so the combined line ellipsizes before running under it', () => {
      renderBlock(makePlacement({ isHorde: true }, { heightHours: 1 }));
      expect(screen.getByText(/Nerub-ar Palace/).className).toMatch(/hordeClearShort/);
    });

    it('does not reserve Horde-mark room when the event isn\'t Horde-tagged', () => {
      renderBlock(makePlacement({ isHorde: false }, { heightHours: 1 }));
      expect(screen.getByText(/Nerub-ar Palace/).className).not.toMatch(/hordeClearShort/);
    });

    it('still shows only the title, with no character at all, when clustered with an overlapping event', () => {
      renderBlock(makePlacement({}, { heightHours: 1, laneCount: 2 }));
      expect(screen.getByText('Nerub-ar Palace')).toBeInTheDocument();
      expect(screen.queryByText(/Thrashclaw/)).not.toBeInTheDocument();
    });
  });
});
