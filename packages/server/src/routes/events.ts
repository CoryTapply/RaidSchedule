import type { EventsResponse } from '@raidschedule/shared';
import type { FastifyInstance } from 'fastify';
import { fetchRaidHelperEvents, RaidHelperError } from '../integrations/raidHelper/client.js';
import { normalizeRaidHelperEvent } from '../integrations/raidHelper/normalize.js';
import type { RawRaidHelperEvent } from '../integrations/raidHelper/types.js';
import { requireAuth } from '../middleware/requireAuth.js';

/**
 * raid-helper's `StartTimeFilter` query param is silently ignored by the live API — verified
 * directly against a real response, passing it (in any casing, at any value) changes nothing.
 * So the lookback window is enforced here instead, before normalization.
 */
const LOOKBACK_DAYS = 60;

function isWithinLookback(event: RawRaidHelperEvent, cutoffSeconds: number): boolean {
  return event.startTime >= cutoffSeconds;
}

export function registerEventRoutes(fastify: FastifyInstance, raidHelperApiKey: string): void {
  fastify.get('/api/events', { preHandler: requireAuth }, async (_request, reply) => {
    try {
      const raw = await fetchRaidHelperEvents(raidHelperApiKey);
      const cutoffSeconds = Math.floor(Date.now() / 1000) - LOOKBACK_DAYS * 86_400;
      const events = raw.filter((event) => isWithinLookback(event, cutoffSeconds)).flatMap(normalizeRaidHelperEvent);
      // Phase 2 seam: a custom-events SQLite source will be concatenated into `events` here.
      const body: EventsResponse = { events };
      return reply.send(body);
    } catch (error) {
      if (error instanceof RaidHelperError) {
        fastify.log.error({ err: error }, 'raid-helper request failed');
        return reply.code(502).send({ error: 'raid_helper_unavailable' });
      }
      throw error;
    }
  });
}
