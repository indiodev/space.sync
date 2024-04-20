import Static from '@fastify/static';
import fastify from 'fastify';
import Socket from 'fastify-socket.io';
import { join } from 'path';
import { Server } from 'socket.io';

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

APP.get('/', async (_, response) => {
	return response.sendFile('index.html');
});

declare module 'fastify' {
	export interface FastifyInstance {
		io: Server;
	}
}

export { APP };
