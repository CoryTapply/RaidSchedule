import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import fastifyStatic from '@fastify/static';
import type { FastifyInstance } from 'fastify';

const defaultWebDistPath = join(dirname(fileURLToPath(import.meta.url)), '../../../web/dist');

export async function registerStaticFrontend(fastify: FastifyInstance, webDistPath = defaultWebDistPath): Promise<void> {
  await fastify.register(fastifyStatic, {
    root: webDistPath,
    wildcard: false,
  });

  fastify.setNotFoundHandler((request, reply) => {
    if (request.raw.url?.startsWith('/api')) {
      return reply.code(404).send({ error: 'not_found' });
    }
    return reply.sendFile('index.html', webDistPath);
  });
}
