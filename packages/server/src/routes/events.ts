import type { EventsResponse } from '@raidschedule/shared';
import type { FastifyInstance } from 'fastify';
import { fetchRaidHelperEvents, RaidHelperError } from '../integrations/raidHelper/client.js';
import { normalizeRaidHelperEvent } from '../integrations/raidHelper/normalize.js';
import { requireAuth } from '../middleware/requireAuth.js';

export function registerEventRoutes(fastify: FastifyInstance, raidHelperApiKey: string): void {
  fastify.get('/api/events', { preHandler: requireAuth }, async (_request, reply) => {
    try {
      const raw = await fetchRaidHelperEvents(raidHelperApiKey);
      const events = raw.flatMap(normalizeRaidHelperEvent);
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
