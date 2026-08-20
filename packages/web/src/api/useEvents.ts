import type { RaidEvent } from '@raidschedule/shared';
import { useEffect, useState } from 'react';
import { fetchEvents } from './eventsClient.js';

export interface UseEventsResult {
  events: RaidEvent[];
  loading: boolean;
  error: string | null;
}

export function useEvents(): UseEventsResult {
  const [events, setEvents] = useState<RaidEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetchEvents(controller.signal)
      .then((response) => setEvents(response.events))
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setError(err instanceof Error ? err.message : 'Failed to load events');
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  return { events, loading, error };
}
