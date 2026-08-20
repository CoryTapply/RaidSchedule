import Fastify, { type FastifyInstance, type FastifyServerOptions } from 'fastify';
import { registerCookies } from './plugins/cookies.js';
import { registerStaticFrontend } from './plugins/staticFrontend.js';
import { registerAuthRoutes } from './routes/auth.js';
import { registerEventRoutes } from './routes/events.js';

export interface BuildAppOptions {
  appPassword: string;
  sessionSecret: string;
  raidHelperApiKey: string;
  logger?: FastifyServerOptions['logger'];
  /** Override for tests; when omitted, the frontend static plugin is skipped. */
  webDistPath?: string;
}

export async function buildApp(options: BuildAppOptions): Promise<FastifyInstance> {
  const fastify = Fastify({
    logger: options.logger ?? true,
  });

  await registerCookies(fastify, options.sessionSecret);
  registerAuthRoutes(fastify, options.appPassword);
  registerEventRoutes(fastify, options.raidHelperApiKey);

  if (options.webDistPath !== undefined) {
    await registerStaticFrontend(fastify, options.webDistPath);
  } else if (process.env.NODE_ENV !== 'test') {
    await registerStaticFrontend(fastify);
  }

  return fastify;
}
