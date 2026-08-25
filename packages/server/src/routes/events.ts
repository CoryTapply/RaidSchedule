import { isHordeTitle, WOW_CLASSES, type EventsResponse } from '@raidschedule/shared';
import type Database from 'better-sqlite3';
import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { deleteCustomEvent, insertCustomEvent, listCustomEvents, updateCustomEvent } from '../db/customEvents.js';
import { getHordeTags, setHordeTag } from '../db/hordeTags.js';
import { applyRaidHelperOverride, getRaidHelperOverrides, setRaidHelperOverride } from '../db/raidHelperOverrides.js';
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

const characterPatchSchema = z.object({
  name: z.string().min(1),
  className: z.enum([...WOW_CLASSES, 'Unknown']),
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
  isHorde: z.boolean(),
});

/** A PATCH only writes the keys it's given — every field here is optional. */
const updateCustomEventSchema = z.object({
  raidName: z.string().min(1).optional(),
  startsAt: z.string().min(1).optional(),
  endsAt: z.string().min(1).optional(),
  status: z.enum(['pending', 'confirmed']).optional(),
  character: characterPatchSchema.optional(),
  isHorde: z.boolean().optional(),
});

/** The raid's own schedule always comes from raid-helper.xyz — only identity fields and the local Horde tag are overridable. */
const raidHelperOverrideSchema = z.object({
  raidName: z.string().min(1).optional(),
  character: characterPatchSchema.optional(),
  status: z.enum(['pending', 'confirmed']).optional(),
  isHorde: z.boolean().optional(),
});

const RAID_HELPER_EVENT_ID_PATTERN = /^raid-helper:([^:]+):[^:]+$/;

export function registerEventRoutes(fastify: FastifyInstance, raidHelperApiKey: string, db: Database.Database): void {
  fastify.get('/api/events', { preHandler: requireAuth }, async (_request, reply) => {
    try {
      const raw = await fetchRaidHelperEvents(raidHelperApiKey);
      const cutoffSeconds = Math.floor(Date.now() / 1000) - LOOKBACK_DAYS * 86_400;
      const hordeTags = getHordeTags(db);
      const overrides = getRaidHelperOverrides(db);
      const events = raw
        .filter((event) => isWithinLookback(event, cutoffSeconds))
        .flatMap((event) => normalizeRaidHelperEvent(event, hordeTags.get(event.id) ?? isHordeTitle(event.title)))
        .map((event) => applyRaidHelperOverride(event, overrides.get(event.id)));
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
    const body = updateCustomEventSchema.safeParse(request.body);
    if (!body.success) {
      return reply.code(400).send({ error: 'invalid_request' });
    }
    const event = updateCustomEvent(db, id.slice('custom:'.length), body.data);
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

  /**
   * Local override for a Raid-Helper-sourced event: `eventId` is the full
   * `RaidEvent.id` (`raid-helper:{raidHelperEventId}:{signUpId}`), since
   * identity fields (title/character/status) are overridden per sign-up.
   * `isHorde` is the exception — it's stored per `raidHelperEventId` (the
   * whole raid), reusing the pre-existing horde-tag mechanism.
   */
  fastify.patch('/api/raid-helper-events/:eventId/override', { preHandler: requireAuth }, async (request, reply) => {
    const { eventId } = request.params as { eventId: string };
    const match = RAID_HELPER_EVENT_ID_PATTERN.exec(eventId);
    if (!match) {
      return reply.code(400).send({ error: 'invalid_request' });
    }
    const raidHelperEventId = match[1]!;
    const body = raidHelperOverrideSchema.safeParse(request.body);
    if (!body.success) {
      return reply.code(400).send({ error: 'invalid_request' });
    }
    const { raidName, character, status, isHorde } = body.data;
    if (isHorde !== undefined) {
      setHordeTag(db, raidHelperEventId, isHorde);
    }
    if (raidName !== undefined || character !== undefined || status !== undefined) {
      setRaidHelperOverride(db, eventId, { raidName, characterName: character?.name, characterClassName: character?.className, status });
    }
    return reply.send({ eventId, raidHelperEventId, raidName, character, status, isHorde });
  });
}
