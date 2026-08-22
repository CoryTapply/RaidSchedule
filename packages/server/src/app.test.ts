import type Database from 'better-sqlite3';
import type { FastifyInstance } from 'fastify';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { buildApp } from './app.js';
import { createDb } from './db/client.js';
import { runMigrations } from './db/migrate.js';

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

function makeDb(): Database.Database {
  const db = createDb(':memory:');
  runMigrations(db);
  return db;
}

async function makeApp(raidHelperApiKey = 'unused-in-these-tests', db: Database.Database = makeDb()): Promise<FastifyInstance> {
  return buildApp({
    appPassword: APP_PASSWORD,
    sessionSecret: SESSION_SECRET,
    raidHelperApiKey,
    db,
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

describe('POST /api/events (custom events)', () => {
  let app: FastifyInstance;
  let testCounter = 0;

  beforeEach(async () => {
    testCounter += 1;
    app = await makeApp(`custom-events-test-key-${testCounter}`);
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify([]), { status: 200 })));
  });

  afterEach(async () => {
    await app.close();
    vi.unstubAllGlobals();
  });

  async function loginCookie(app: FastifyInstance) {
    const login = await app.inject({ method: 'POST', url: '/api/auth/login', payload: { password: APP_PASSWORD } });
    return login.cookies.find((c) => c.name === 'raidschedule_session')!.value;
  }

  const validPayload = {
    raidName: 'Guild Night',
    startsAt: '2026-08-21T20:00:00.000Z',
    endsAt: '2026-08-21T23:00:00.000Z',
    status: 'confirmed',
    character: { name: 'Thrashclaw', className: 'Druid' },
  };

  it('requires authentication', async () => {
    const res = await app.inject({ method: 'POST', url: '/api/events', payload: validPayload });
    expect(res.statusCode).toBe(401);
  });

  it('rejects an invalid body', async () => {
    const cookie = await loginCookie(app);
    const res = await app.inject({
      method: 'POST',
      url: '/api/events',
      cookies: { raidschedule_session: cookie },
      payload: { raidName: '' },
    });
    expect(res.statusCode).toBe(400);
  });

  it('creates a custom event and returns it in a subsequent GET /api/events', async () => {
    const cookie = await loginCookie(app);
    const createRes = await app.inject({
      method: 'POST',
      url: '/api/events',
      cookies: { raidschedule_session: cookie },
      payload: validPayload,
    });
    expect(createRes.statusCode).toBe(201);
    const created = createRes.json();
    expect(created.source).toBe('custom');
    expect(created.id).toMatch(/^custom:/);
    expect(created.character.name).toBe('Thrashclaw');

    const listRes = await app.inject({
      method: 'GET',
      url: '/api/events',
      cookies: { raidschedule_session: cookie },
    });
    expect(listRes.statusCode).toBe(200);
    expect(listRes.json().events).toEqual([created]);
  });
});

describe('DELETE /api/events/:id (custom events)', () => {
  let app: FastifyInstance;
  let testCounter = 0;

  beforeEach(async () => {
    testCounter += 1;
    app = await makeApp(`custom-events-delete-test-key-${testCounter}`);
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify([]), { status: 200 })));
  });

  afterEach(async () => {
    await app.close();
    vi.unstubAllGlobals();
  });

  async function loginCookie(app: FastifyInstance) {
    const login = await app.inject({ method: 'POST', url: '/api/auth/login', payload: { password: APP_PASSWORD } });
    return login.cookies.find((c) => c.name === 'raidschedule_session')!.value;
  }

  const validPayload = {
    raidName: 'Guild Night',
    startsAt: '2026-08-21T20:00:00.000Z',
    endsAt: '2026-08-21T23:00:00.000Z',
    status: 'confirmed',
    character: { name: 'Thrashclaw', className: 'Druid' },
  };

  it('requires authentication', async () => {
    const res = await app.inject({ method: 'DELETE', url: '/api/events/custom:does-not-exist' });
    expect(res.statusCode).toBe(401);
  });

  it('rejects an id that is not a custom event id', async () => {
    const cookie = await loginCookie(app);
    const res = await app.inject({
      method: 'DELETE',
      url: '/api/events/raid-helper:123:456',
      cookies: { raidschedule_session: cookie },
    });
    expect(res.statusCode).toBe(400);
  });

  it('returns 404 for an unknown custom event id', async () => {
    const cookie = await loginCookie(app);
    const res = await app.inject({
      method: 'DELETE',
      url: '/api/events/custom:does-not-exist',
      cookies: { raidschedule_session: cookie },
    });
    expect(res.statusCode).toBe(404);
  });

  it('deletes a custom event and removes it from a subsequent GET /api/events', async () => {
    const cookie = await loginCookie(app);
    const createRes = await app.inject({
      method: 'POST',
      url: '/api/events',
      cookies: { raidschedule_session: cookie },
      payload: validPayload,
    });
    const created = createRes.json();

    const deleteRes = await app.inject({
      method: 'DELETE',
      url: `/api/events/${encodeURIComponent(created.id)}`,
      cookies: { raidschedule_session: cookie },
    });
    expect(deleteRes.statusCode).toBe(204);

    const listRes = await app.inject({
      method: 'GET',
      url: '/api/events',
      cookies: { raidschedule_session: cookie },
    });
    expect(listRes.json().events).toEqual([]);
  });
});

describe('PATCH /api/events/:id (custom events)', () => {
  let app: FastifyInstance;
  let testCounter = 0;

  beforeEach(async () => {
    testCounter += 1;
    app = await makeApp(`custom-events-patch-test-key-${testCounter}`);
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify([]), { status: 200 })));
  });

  afterEach(async () => {
    await app.close();
    vi.unstubAllGlobals();
  });

  async function loginCookie(app: FastifyInstance) {
    const login = await app.inject({ method: 'POST', url: '/api/auth/login', payload: { password: APP_PASSWORD } });
    return login.cookies.find((c) => c.name === 'raidschedule_session')!.value;
  }

  const pendingPayload = {
    raidName: 'Guild Night',
    startsAt: '2026-08-21T20:00:00.000Z',
    endsAt: '2026-08-21T23:00:00.000Z',
    status: 'pending',
    character: { name: 'Thrashclaw', className: 'Druid' },
  };

  it('requires authentication', async () => {
    const res = await app.inject({
      method: 'PATCH',
      url: '/api/events/custom:does-not-exist',
      payload: { status: 'confirmed' },
    });
    expect(res.statusCode).toBe(401);
  });

  it('rejects an id that is not a custom event id', async () => {
    const cookie = await loginCookie(app);
    const res = await app.inject({
      method: 'PATCH',
      url: '/api/events/raid-helper:123:456',
      cookies: { raidschedule_session: cookie },
      payload: { status: 'confirmed' },
    });
    expect(res.statusCode).toBe(400);
  });

  it('rejects an invalid body', async () => {
    const cookie = await loginCookie(app);
    const res = await app.inject({
      method: 'PATCH',
      url: '/api/events/custom:does-not-exist',
      cookies: { raidschedule_session: cookie },
      payload: { status: 'not-a-status' },
    });
    expect(res.statusCode).toBe(400);
  });

  it('returns 404 for an unknown custom event id', async () => {
    const cookie = await loginCookie(app);
    const res = await app.inject({
      method: 'PATCH',
      url: '/api/events/custom:does-not-exist',
      cookies: { raidschedule_session: cookie },
      payload: { status: 'confirmed' },
    });
    expect(res.statusCode).toBe(404);
  });

  it('updates a pending custom event to confirmed and reflects it in a subsequent GET /api/events', async () => {
    const cookie = await loginCookie(app);
    const createRes = await app.inject({
      method: 'POST',
      url: '/api/events',
      cookies: { raidschedule_session: cookie },
      payload: pendingPayload,
    });
    const created = createRes.json();
    expect(created.status).toBe('pending');

    const patchRes = await app.inject({
      method: 'PATCH',
      url: `/api/events/${encodeURIComponent(created.id)}`,
      cookies: { raidschedule_session: cookie },
      payload: { status: 'confirmed' },
    });
    expect(patchRes.statusCode).toBe(200);
    expect(patchRes.json()).toMatchObject({ id: created.id, status: 'confirmed' });

    const listRes = await app.inject({
      method: 'GET',
      url: '/api/events',
      cookies: { raidschedule_session: cookie },
    });
    expect(listRes.json().events).toEqual([{ ...created, status: 'confirmed' }]);
  });
});

describe('PUT /api/raid-helper-events/:raidHelperEventId/horde', () => {
  let app: FastifyInstance;
  let testCounter = 0;

  beforeEach(async () => {
    testCounter += 1;
    app = await makeApp(`horde-tag-test-key-${testCounter}`);
  });

  afterEach(async () => {
    await app.close();
    vi.unstubAllGlobals();
  });

  async function loginCookie(app: FastifyInstance) {
    const login = await app.inject({ method: 'POST', url: '/api/auth/login', payload: { password: APP_PASSWORD } });
    return login.cookies.find((c) => c.name === 'raidschedule_session')!.value;
  }

  it('requires authentication', async () => {
    const res = await app.inject({ method: 'PUT', url: '/api/raid-helper-events/evt1/horde', payload: { isHorde: true } });
    expect(res.statusCode).toBe(401);
  });

  it('rejects an invalid body', async () => {
    const cookie = await loginCookie(app);
    const res = await app.inject({
      method: 'PUT',
      url: '/api/raid-helper-events/evt1/horde',
      cookies: { raidschedule_session: cookie },
      payload: { isHorde: 'yes' },
    });
    expect(res.statusCode).toBe(400);
  });

  it('tags a raid-helper raid as Horde and carries it onto every sign-up in a subsequent GET /api/events', async () => {
    const cookie = await loginCookie(app);
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

    const before = await app.inject({ method: 'GET', url: '/api/events', cookies: { raidschedule_session: cookie } });
    expect(before.json().events[0].isHorde).toBe(false);

    const putRes = await app.inject({
      method: 'PUT',
      url: '/api/raid-helper-events/evt1/horde',
      cookies: { raidschedule_session: cookie },
      payload: { isHorde: true },
    });
    expect(putRes.statusCode).toBe(200);
    expect(putRes.json()).toEqual({ raidHelperEventId: 'evt1', isHorde: true });

    const after = await app.inject({ method: 'GET', url: '/api/events', cookies: { raidschedule_session: cookie } });
    expect(after.json().events[0].isHorde).toBe(true);
  });

  it('overrides title-based detection in either direction', async () => {
    const cookie = await loginCookie(app);
    const nowSeconds = Math.floor(Date.now() / 1000);
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        new Response(
          JSON.stringify([
            { ...rawEvent({ id: 'evt1', startTime: nowSeconds + 3600, characterName: 'Thrashclaw' }), title: 'Thursday Horde Run' },
          ]),
          { status: 200 },
        ),
      ),
    );

    const before = await app.inject({ method: 'GET', url: '/api/events', cookies: { raidschedule_session: cookie } });
    expect(before.json().events[0].isHorde).toBe(true);

    await app.inject({
      method: 'PUT',
      url: '/api/raid-helper-events/evt1/horde',
      cookies: { raidschedule_session: cookie },
      payload: { isHorde: false },
    });

    const after = await app.inject({ method: 'GET', url: '/api/events', cookies: { raidschedule_session: cookie } });
    expect(after.json().events[0].isHorde).toBe(false);
  });
});
