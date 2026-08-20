import fastifyCookie from '@fastify/cookie';
import type { FastifyInstance } from 'fastify';

export async function registerCookies(fastify: FastifyInstance, sessionSecret: string): Promise<void> {
  await fastify.register(fastifyCookie, {
    secret: sessionSecret,
  });
}
