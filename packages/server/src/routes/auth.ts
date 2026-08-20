import { timingSafeEqual } from 'node:crypto';
import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { clearSessionCookie, isAuthenticated, setSessionCookie } from '../middleware/requireAuth.js';

const loginBodySchema = z.object({
  password: z.string().min(1),
});

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export function registerAuthRoutes(fastify: FastifyInstance, appPassword: string): void {
  fastify.post('/api/auth/login', async (request, reply) => {
    const body = loginBodySchema.safeParse(request.body);
    if (!body.success) {
      return reply.code(400).send({ error: 'invalid_request' });
    }
    if (!safeEqual(body.data.password, appPassword)) {
      return reply.code(401).send({ error: 'invalid_password' });
    }
    setSessionCookie(reply);
    return reply.send({ ok: true });
  });

  fastify.post('/api/auth/logout', async (_request, reply) => {
    clearSessionCookie(reply);
    return reply.send({ ok: true });
  });

  fastify.get('/api/auth/session', async (request, reply) => {
    if (!isAuthenticated(request)) {
      return reply.code(401).send({ authenticated: false });
    }
    return reply.send({ authenticated: true });
  });
}
