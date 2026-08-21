import type { CreateCustomEventInput, EventsResponse, RaidEvent } from '@raidschedule/shared';

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

export async function deleteCustomEvent(id: string, signal?: AbortSignal): Promise<void> {
  const res = await fetch(`/api/events/${encodeURIComponent(id)}`, { method: 'DELETE', signal });
  if (!res.ok) {
    throw new Error(`Failed to delete event (${res.status})`);
  }
}

export async function confirmCustomEvent(id: string, signal?: AbortSignal): Promise<RaidEvent> {
  const res = await fetch(`/api/events/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'confirmed' }),
    signal,
  });
  if (!res.ok) {
    throw new Error(`Failed to confirm event (${res.status})`);
  }
  return (await res.json()) as RaidEvent;
}
