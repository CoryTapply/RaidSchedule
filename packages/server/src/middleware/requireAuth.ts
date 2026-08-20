import type { FastifyReply, FastifyRequest } from 'fastify';

export const SESSION_COOKIE_NAME = 'raidschedule_session';
const SESSION_COOKIE_VALUE = 'ok';

export function isAuthenticated(request: FastifyRequest): boolean {
  const raw = request.cookies[SESSION_COOKIE_NAME];
  if (!raw) return false;
  const unsigned = request.unsignCookie(raw);
  return unsigned.valid && unsigned.value === SESSION_COOKIE_VALUE;
}

export async function requireAuth(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  if (!isAuthenticated(request)) {
    await reply.code(401).send({ error: 'unauthorized' });
  }
}

export function setSessionCookie(reply: FastifyReply): void {
  reply.setCookie(SESSION_COOKIE_NAME, SESSION_COOKIE_VALUE, {
    signed: true,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
}

export function clearSessionCookie(reply: FastifyReply): void {
  reply.clearCookie(SESSION_COOKIE_NAME, { path: '/' });
}
