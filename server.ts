import Static from '@fastify/static';
import { TriggerRoute } from 'app/routes/trigger';
import { Env } from 'config/env';
import Socket from 'fastify-socket.io';
import { join } from 'path';
import { Server } from 'socket.io';
import { CreateOptions, create as CreateVenom, Whatsapp } from 'venom-bot';
import { APP } from './app';

let whatsapp: Whatsapp | null = null;

APP.register(Static, {
	root: join(__dirname, 'public'),
	prefix: '/public/',
});

APP.register(Socket, {
	cors: {
		origin: '*',
	},
});

type VenomCreateOptions = CreateOptions & { multidevice?: boolean };

// async function sendMessage(message: Message) {
// 	console.log(message);
// }

// async function Start(client: Whatsapp) {
// 	try {
// 		// await client.onMessage(sendMessage);
// 		const groups = await client.getAllChatsGroups();
// 		console.log({ groups_total: groups.length, groups });
// 	} catch (error) {
// 		console.error(error);
// 	}
// }

APP.register(TriggerRoute, { prefix: '/trigger' });

APP.post('/send-message', async (request, response) => {
	if (!whatsapp || !whatsapp.isConnected()) {
		return response.status(404).send({ message: 'Whatsapp not connected' });
	}
	await whatsapp.sendText(
		'120363272121267113@g.us',
		`_Ofertas exclusivas de sorvete para você!_\n*Supervisa Atacadista! Melhor preço todo dia!*
		`,
	);

	await whatsapp.sendImage(
		'120363272121267113@g.us',
		// './public/image.jpeg',
		'https://imgs.search.brave.com/GVhv2H-5YUyfUhNneCOZ-FMECzXCg4d7tNusD-Il5ek/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMudmV4ZWxzLmNv/bS9tZWRpYS91c2Vy/cy8zLzMyMjMxMS9p/c29sYXRlZC9wcmV2/aWV3LzU2M2E1ZjUz/ZTA4ODgzMjIzODYw/OGI0ZTc1MDljNjY4/LXBpcmVzLWRlLXNv/cnZldGUucG5n',
		'image.jpeg',
		'',
	);
	return response.status(200).send({ message: 'Message sent' });
});

APP.get('/groups', async (request, response) => {
	if (!whatsapp || !whatsapp.isConnected()) {
		return response.status(404).send({ message: 'Whatsapp not connected' });
	}

	const all_groups = (await whatsapp.getAllChatsGroups()) as {
		name: string;
		id: { _serialized: string };
	}[];
	const groups = all_groups.map(({ name, id: { _serialized } }) => ({
		name,
		serialized_identifier: _serialized,
	}));
	return response.status(200).send(groups);
});

APP.get('/', async (request, response) => {
	return response.sendFile('index.html');
});

APP.ready((err) => {
	if (err) throw err;

	APP.io.on('connection', (socket) => {
		console.info('Socket connected!', socket.id);

		socket.emit('message', 'Hello World!');

		socket.on('generate qrcode', async () => {
			whatsapp = await CreateVenom({
				session: 'space_sync',
				logQR: true,
				multidevice: false,
			} as VenomCreateOptions);
		});

		socket.on('disconnect', () => {
			console.info('Socket disconnected!', socket.id);
		});
	});
});

APP.listen({
	host: '0.0.0.0',
	port: Env.APP_PORT,
}).then(async () => {
	console.log(`Server is running on http://localhost:${Env.APP_PORT}`);
});

declare module 'fastify' {
	export interface FastifyInstance {
		io: Server;
	}
}
