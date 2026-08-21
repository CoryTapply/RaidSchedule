import { WOW_CLASSES, type EventsResponse } from '@raidschedule/shared';
import type Database from 'better-sqlite3';
import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { deleteCustomEvent, insertCustomEvent, listCustomEvents, updateCustomEventStatus } from '../db/customEvents.js';
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

const updateCustomEventStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed']),
});

const createCustomEventSchema = z.object({
  raidName: z.string().min(1),
  startsAt: z.string().min(1),
  endsAt: z.string().min(1).optional(),
  status: z.enum(['pending', 'confirmed']),
  character: z.object({
    name: z.string().min(1),
    className: z.enum([...WOW_CLASSES, 'Unknown']),
    spec: z.string().optional(),
  }),
});

export function registerEventRoutes(fastify: FastifyInstance, raidHelperApiKey: string, db: Database.Database): void {
  fastify.get('/api/events', { preHandler: requireAuth }, async (_request, reply) => {
    try {
      const raw = await fetchRaidHelperEvents(raidHelperApiKey);
      const cutoffSeconds = Math.floor(Date.now() / 1000) - LOOKBACK_DAYS * 86_400;
      const events = raw.filter((event) => isWithinLookback(event, cutoffSeconds)).flatMap(normalizeRaidHelperEvent);
      events.push(...listCustomEvents(db));
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

  fastify.post('/api/events', { preHandler: requireAuth }, async (request, reply) => {
    const body = createCustomEventSchema.safeParse(request.body);
    if (!body.success) {
      return reply.code(400).send({ error: 'invalid_request' });
    }
    const event = insertCustomEvent(db, body.data);
    return reply.code(201).send(event);
  });

  fastify.patch('/api/events/:id', { preHandler: requireAuth }, async (request, reply) => {
    const { id } = request.params as { id: string };
    if (!id.startsWith('custom:')) {
      return reply.code(400).send({ error: 'invalid_request' });
    }
    const body = updateCustomEventStatusSchema.safeParse(request.body);
    if (!body.success) {
      return reply.code(400).send({ error: 'invalid_request' });
    }
    const event = updateCustomEventStatus(db, id.slice('custom:'.length), body.data.status);
    if (!event) {
      return reply.code(404).send({ error: 'not_found' });
    }
    return reply.send(event);
  });

  fastify.delete('/api/events/:id', { preHandler: requireAuth }, async (request, reply) => {
    const { id } = request.params as { id: string };
    if (!id.startsWith('custom:')) {
      return reply.code(400).send({ error: 'invalid_request' });
    }
    const deleted = deleteCustomEvent(db, id.slice('custom:'.length));
    if (!deleted) {
      return reply.code(404).send({ error: 'not_found' });
    }
    return reply.code(204).send();
  });
}
