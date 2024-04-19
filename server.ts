// import Static from '@fastify/static';
import { createServer } from 'http';
// import { join } from 'path';
import { Server } from 'socket.io';
import { APP } from './app';

// APP.register(Static, {
// 	root: join(__dirname, 'public'),
// 	prefix: '/public/',
// });

const SERVER = createServer(APP.server);

const IO = new Server(SERVER, {
	cors: {
		origin: '*',
	},
});

IO.on('connection', (socket) => {
	console.log('a user connected');
	socket.on('disconnect', () => {
		console.log('user disconnected');
	});
});

APP.get('/', (request, response) => {
	// response.sendFile('index.html');
	response.send('Hello World');
});

APP.listen({
	host: '0.0.0.0',
	port: 3000,
}).then(() => {
	console.log('Server is running on http://localhost:3000');
});
