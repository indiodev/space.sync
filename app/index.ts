import Static from '@fastify/static';
import fastify from 'fastify';
import Socket from 'fastify-socket.io';
import { join } from 'path';
import { Server } from 'socket.io';
import { ZodError } from 'zod';
import { Schema } from './schemas';
import storage from './services/storage';
const APP = fastify();

APP.register(Static, {
	root: join(__dirname, '..', 'public'),
	prefix: '/public',
});

APP.register(Socket, {
	cors: {
		origin: '*',
	},
});

APP.post('/storage/presigned', async (request, response) => {
	try {
		const payload = Schema.Storage.Presigned.parse(request.body);
		const result = await storage.presigned(payload);
		return response.status(200).send(result);
	} catch (error) {
		if (error instanceof ZodError) {
			return response.status(400).send(error.issues);
		}

		// return response.status(400).send(error);
	}
});

APP.get('/', async (_, response) => {
	return response.sendFile('index.html');
});

declare module 'fastify' {
	export interface FastifyInstance {
		io: Server;
	}
}

export { APP };
