import type {
  CreateCustomEventInput,
  EventsResponse,
  RaidEvent,
  RaidHelperEventOverrideInput,
  UpdateCustomEventInput,
} from '@raidschedule/shared';

export async function fetchEvents(signal?: AbortSignal): Promise<EventsResponse> {
  const res = await fetch('/api/events', { signal });
  if (!res.ok) {
    throw new Error(`Failed to load events (${res.status})`);
  }
  return (await res.json()) as EventsResponse;
}

export async function createCustomEvent(input: CreateCustomEventInput, signal?: AbortSignal): Promise<RaidEvent> {
  const res = await fetch('/api/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
    signal,
  });
  if (!res.ok) {
    throw new Error(`Failed to create event (${res.status})`);
  }
  return (await res.json()) as RaidEvent;
}

export async function updateCustomEvent(id: string, patch: UpdateCustomEventInput, signal?: AbortSignal): Promise<RaidEvent> {
  const res = await fetch(`/api/events/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
    signal,
  });
  if (!res.ok) {
    throw new Error(`Failed to save event (${res.status})`);
  }
  return (await res.json()) as RaidEvent;
}

export async function deleteCustomEvent(id: string, signal?: AbortSignal): Promise<void> {
  const res = await fetch(`/api/events/${encodeURIComponent(id)}`, { method: 'DELETE', signal });
  if (!res.ok) {
    throw new Error(`Failed to delete event (${res.status})`);
  }
}

/**
 * `eventId` is the full `RaidEvent.id` (`raid-helper:{raidHelperEventId}:{signUpId}`)
 * of a Raid-Helper-sourced event. Returns the patch actually applied — the
 * server doesn't reconstruct a full `RaidEvent` (that would mean re-fetching
 * raid-helper.xyz), so the caller merges this onto its own local copy.
 */
export async function updateRaidHelperEventOverride(
  eventId: string,
  patch: RaidHelperEventOverrideInput,
  signal?: AbortSignal,
): Promise<RaidHelperEventOverrideInput> {
  const res = await fetch(`/api/raid-helper-events/${encodeURIComponent(eventId)}/override`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
    signal,
  });
  if (!res.ok) {
    throw new Error(`Failed to save event (${res.status})`);
  }
  return (await res.json()) as RaidHelperEventOverrideInput;
}
