import type { RawRaidHelperEvent } from './types.js';

const RAID_HELPER_BASE_URL = 'https://raid-helper.xyz/api/v4';
const CACHE_TTL_MS = 60_000;

let cache: { key: string; expiresAt: number; events: Promise<RawRaidHelperEvent[]> } | null = null;

export class RaidHelperError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = 'RaidHelperError';
  }
}

async function fetchFromRaidHelper(apiKey: string): Promise<RawRaidHelperEvent[]> {
  const response = await fetch(`${RAID_HELPER_BASE_URL}/users/${encodeURIComponent(apiKey)}/events`);
  if (!response.ok) {
    throw new RaidHelperError(`raid-helper API returned ${response.status}`, response.status);
  }
  return (await response.json()) as RawRaidHelperEvent[];
}

/**
 * Fetches the caller's raid-helper events, cached in-memory for a short TTL to avoid
 * hammering raid-helper on rapid navigation/refresh clicks. `apiKey` is read from a
 * server-side env var by the caller and never forwarded to the browser.
 */
export function fetchRaidHelperEvents(apiKey: string): Promise<RawRaidHelperEvent[]> {
  const now = Date.now();
  if (cache && cache.key === apiKey && cache.expiresAt > now) {
    return cache.events;
  }
  const events = fetchFromRaidHelper(apiKey);
  cache = { key: apiKey, expiresAt: now + CACHE_TTL_MS, events };
  events.catch(() => {
    // Don't serve a cached rejection past its own request; let the next call retry.
    if (cache?.events === events) cache = null;
  });
  return events;
}
