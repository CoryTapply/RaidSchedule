import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { lockoutStart, type RaidEvent } from '@raidschedule/shared';
import {
  createCustomEvent,
  deleteCustomEvent,
  fetchEvents,
  updateCustomEvent,
  updateRaidHelperEventOverride,
} from '../../api/eventsClient.js';
import { MobileCalendarPage } from './MobileCalendarPage.js';

vi.mock('../../api/eventsClient.js', () => ({
  fetchEvents: vi.fn(),
  createCustomEvent: vi.fn(),
  updateCustomEvent: vi.fn(),
  deleteCustomEvent: vi.fn(),
  updateRaidHelperEventOverride: vi.fn(),
}));

const mockFetchEvents = vi.mocked(fetchEvents);
const mockCreateCustomEvent = vi.mocked(createCustomEvent);
const mockUpdateCustomEvent = vi.mocked(updateCustomEvent);
const mockDeleteCustomEvent = vi.mocked(deleteCustomEvent);
const mockUpdateRaidHelperEventOverride = vi.mocked(updateRaidHelperEventOverride);

// Wednesday, August 19, 2026 — a known "today".
const TODAY = new Date(2026, 7, 19);

function makeEvent(overrides: Partial<RaidEvent> = {}): RaidEvent {
  return {
    id: 'evt-1',
    source: 'custom',
    raidName: 'Nerub-ar Palace',
    startsAt: TODAY.toISOString(),
    status: 'confirmed',
    character: { name: 'Thrashclaw', className: 'Druid' },
    ...overrides,
  };
}

beforeEach(() => {
  vi.setSystemTime(TODAY);
  mockFetchEvents.mockReset();
  mockFetchEvents.mockResolvedValue({ events: [] });
  mockCreateCustomEvent.mockReset();
  mockCreateCustomEvent.mockImplementation(async (input) => ({ id: 'custom:server-id', source: 'custom', ...input }) as RaidEvent);
  mockUpdateCustomEvent.mockReset();
  mockDeleteCustomEvent.mockReset();
  mockUpdateRaidHelperEventOverride.mockReset();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('MobileCalendarPage', () => {
  it('loads events and renders the lockout header for today', async () => {
    render(<MobileCalendarPage />);

    expect(await screen.findByText('August 2026')).toBeInTheDocument();
    expect(lockoutStart(TODAY).getDate()).toBe(18);
    expect(screen.getByText(/^Lockout Aug 18 –/)).toBeInTheDocument();
  });

  it('tapping an event card opens the detail sheet, and Edit opens the composer prefilled', async () => {
    mockFetchEvents.mockResolvedValue({ events: [makeEvent()] });
    render(<MobileCalendarPage />);

    fireEvent.click(await screen.findByText('Nerub-ar Palace'));
    // The composer sheet is pre-mounted (inert) even when closed now, so more than one
    // role="dialog" element can exist at once — the detail sheet is the one that isn't inert.
    const openDialogs = screen.getAllByRole('dialog').filter((el) => !el.closest('[inert]'));
    expect(openDialogs).toHaveLength(1);
    expect(screen.getByText('Thrashclaw')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Edit' }));
    expect(screen.getByLabelText('Title')).toHaveValue('Nerub-ar Palace');
    expect(screen.getByText('Edit event')).toBeInTheDocument();
  });

  it('long-pressing an empty day opens the composer, and saving creates the event and shows a toast', async () => {
    render(<MobileCalendarPage />);

    const row = await screen.findByTestId('day-row-2026-08-19');
    fireEvent.pointerDown(row, { pointerType: 'touch' });
    await new Promise((r) => setTimeout(r, 450));

    expect(await screen.findByText('New event')).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Black Temple' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add' }));

    expect(await screen.findByText('Event published')).toBeInTheDocument();
    expect(mockCreateCustomEvent).toHaveBeenCalledWith(expect.objectContaining({ raidName: 'Black Temple' }));
    // The sheet stays mounted after saving (so it can slide out instead of vanishing) — closed means inert, not gone.
    expect(screen.getByRole('dialog').closest('[inert]')).not.toBeNull();
  });

  it('shows an error banner when the initial fetch fails', async () => {
    mockFetchEvents.mockRejectedValue(new Error('Failed to load events (500)'));
    render(<MobileCalendarPage />);

    expect(await screen.findByRole('alert')).toHaveTextContent('Failed to load events (500)');
  });
});
