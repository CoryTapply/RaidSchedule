import type { FastifyInstance } from 'fastify';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { buildApp } from './app.js';

const APP_PASSWORD = 'correct-horse-battery-staple';
const SESSION_SECRET = 'a'.repeat(32);

interface RawEventOverrides {
  id: string;
  startTime: number;
  characterName: string;
}

function rawEvent({ id, startTime, characterName }: RawEventOverrides) {
  return {
    id,
    channelId: 'chan1',
    leaderId: 'lead1',
    leaderName: 'Leader',
    title: 'Nerub-ar Palace',
    description: '',
    startTime,
    endTime: startTime + 3600,
    closeTime: startTime - 3600,
    templateId: 'tmpl1',
    color: '000000',
    lastUpdated: startTime,
    signUps: [
      { name: characterName, id: 1, userId: 'u1', className: 'Druid', specName: 'Balance', entryTime: 0 },
    ],
  };
}

async function makeApp(raidHelperApiKey = 'unused-in-these-tests'): Promise<FastifyInstance> {
  return buildApp({
    appPassword: APP_PASSWORD,
    sessionSecret: SESSION_SECRET,
    raidHelperApiKey,
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
  let testCounter = 0;

  beforeEach(async () => {
    // fetchRaidHelperEvents caches by API key for 60s; give each test its own key so
    // they don't read back another test's stubbed response.
    testCounter += 1;
    app = await makeApp(`test-key-${testCounter}`);
  });

  afterEach(async () => {
    await app.close();
    vi.unstubAllGlobals();
  });

  async function loginAndFetchEvents(app: FastifyInstance) {
    const login = await app.inject({ method: 'POST', url: '/api/auth/login', payload: { password: APP_PASSWORD } });
    const cookie = login.cookies.find((c) => c.name === 'raidschedule_session')!;
    return app.inject({ method: 'GET', url: '/api/events', cookies: { raidschedule_session: cookie.value } });
  }

  it('requires authentication', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/events' });
    expect(res.statusCode).toBe(401);
  });

  it('returns normalized events for an authenticated request', async () => {
    const nowSeconds = Math.floor(Date.now() / 1000);
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        new Response(
          JSON.stringify([rawEvent({ id: 'evt1', startTime: nowSeconds + 3600, characterName: 'Thrashclaw' })]),
          { status: 200 },
        ),
      ),
    );

    const res = await loginAndFetchEvents(app);
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.events).toHaveLength(1);
    expect(body.events[0].status).toBe('confirmed');
    expect(body.events[0].character.name).toBe('Thrashclaw');
  });

  it('excludes events older than the 60-day lookback window, keeps recent and future ones', async () => {
    const nowSeconds = Math.floor(Date.now() / 1000);
    const DAY = 86_400;
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        new Response(
          JSON.stringify([
            rawEvent({ id: 'too-old', startTime: nowSeconds - 61 * DAY, characterName: 'TooOld' }),
            rawEvent({ id: 'within-window', startTime: nowSeconds - 59 * DAY, characterName: 'WithinWindow' }),
            rawEvent({ id: 'future', startTime: nowSeconds + 30 * DAY, characterName: 'Future' }),
          ]),
          { status: 200 },
        ),
      ),
    );

    const res = await loginAndFetchEvents(app);
    expect(res.statusCode).toBe(200);
    const names = res.json().events.map((e: { character: { name: string } }) => e.character.name);
    expect(names).toEqual(['WithinWindow', 'Future']);
  });
});
