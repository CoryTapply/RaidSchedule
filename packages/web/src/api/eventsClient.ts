import type { EventsResponse } from '@raidschedule/shared';

export async function fetchEvents(signal?: AbortSignal): Promise<EventsResponse> {
  const res = await fetch('/api/events', { signal });
  if (!res.ok) {
    throw new Error(`Failed to load events (${res.status})`);
  }
  return (await res.json()) as EventsResponse;
}
