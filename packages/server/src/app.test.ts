import type { FastifyInstance } from 'fastify';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { buildApp } from './app.js';

const APP_PASSWORD = 'correct-horse-battery-staple';
const SESSION_SECRET = 'a'.repeat(32);

async function makeApp(): Promise<FastifyInstance> {
  return buildApp({
    appPassword: APP_PASSWORD,
    sessionSecret: SESSION_SECRET,
    raidHelperApiKey: 'unused-in-these-tests',
    logger: false,
  });
}

describe('auth routes', () => {
  let app: FastifyInstance;

  beforeEach(async () => {
    app = await makeApp();
  });

  afterEach(async () => {
    await app.close();
  });

  it('rejects a login with the wrong password', async () => {
    const res = await app.inject({ method: 'POST', url: '/api/auth/login', payload: { password: 'nope' } });
    expect(res.statusCode).toBe(401);
  });

  it('rejects a malformed login body', async () => {
    const res = await app.inject({ method: 'POST', url: '/api/auth/login', payload: {} });
    expect(res.statusCode).toBe(400);
  });

  it('accepts the correct password and sets a session cookie that /api/auth/session honors', async () => {
    const login = await app.inject({ method: 'POST', url: '/api/auth/login', payload: { password: APP_PASSWORD } });
    expect(login.statusCode).toBe(200);
    const cookie = login.cookies.find((c) => c.name === 'raidschedule_session');
    expect(cookie).toBeDefined();

    const session = await app.inject({
      method: 'GET',
      url: '/api/auth/session',
      cookies: { raidschedule_session: cookie!.value },
    });
    expect(session.statusCode).toBe(200);
    expect(session.json()).toEqual({ authenticated: true });
  });

  it('reports unauthenticated with no cookie', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/auth/session' });
    expect(res.statusCode).toBe(401);
  });

  it('reports unauthenticated with a tampered cookie', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/auth/session',
      cookies: { raidschedule_session: 'tampered-value' },
    });
    expect(res.statusCode).toBe(401);
  });
});

describe('GET /api/events', () => {
  let app: FastifyInstance;

  beforeEach(async () => {
    app = await makeApp();
  });

  afterEach(async () => {
    await app.close();
    vi.unstubAllGlobals();
  });

  it('requires authentication', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/events' });
    expect(res.statusCode).toBe(401);
  });

  it('returns normalized events for an authenticated request', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        new Response(
          JSON.stringify([
            {
              id: 'evt1',
              channelId: 'chan1',
              leaderId: 'lead1',
              leaderName: 'Leader',
              title: 'Nerub-ar Palace',
              description: '',
              startTime: 1755640800,
              endTime: 1755651600,
              closeTime: 1755637200,
              templateId: 'tmpl1',
              color: '000000',
              lastUpdated: 1755600000,
              signUps: [
                { name: 'Thrashclaw', id: 1, userId: 'u1', className: 'Druid', specName: 'Balance', entryTime: 0 },
              ],
            },
          ]),
          { status: 200 },
        ),
      ),
    );

    const login = await app.inject({ method: 'POST', url: '/api/auth/login', payload: { password: APP_PASSWORD } });
    const cookie = login.cookies.find((c) => c.name === 'raidschedule_session')!;

    const res = await app.inject({
      method: 'GET',
      url: '/api/events',
      cookies: { raidschedule_session: cookie.value },
    });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.events).toHaveLength(1);
    expect(body.events[0].status).toBe('confirmed');
    expect(body.events[0].character.name).toBe('Thrashclaw');
  });
});
