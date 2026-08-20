import { buildApp } from './app.js';
import { createDb } from './db/client.js';
import { runMigrations } from './db/migrate.js';
import { loadEnv } from './env.js';

const env = loadEnv();

// Scaffolded for phase 2 (custom events); no route touches this yet.
const db = createDb(env.DB_PATH);
runMigrations(db);

const app = await buildApp({
  appPassword: env.APP_PASSWORD,
  sessionSecret: env.SESSION_SECRET,
  raidHelperApiKey: env.RAID_HELPER_API_KEY,
  logger: env.NODE_ENV === 'development' ? { transport: { target: 'pino-pretty' } } : true,
});

await app.listen({ port: env.PORT, host: '0.0.0.0' });
