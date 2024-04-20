import { APP } from 'app';
import { ChatGroup } from 'app/dtos/venom';
import { TriggerFactory } from 'app/factories/trigger';
import { Schema } from 'app/schemas';
import { CreateVenomInstance } from 'app/utils/socket';
import { VenomStatus } from 'app/utils/venom';
import { Env } from 'config/env';
import { Socket } from 'socket.io';
import { Whatsapp as Venom } from 'venom-bot';

let venom: Venom | null = null;
let socket: Socket | null = null;

APP.get('/venom/groups', async (_, response) => {
	if (!venom)
		return response.status(400).send({
			message: 'Venom not initialized',
		});

	const groups = (await venom?.getAllChatsGroups()) as ChatGroup[];
	const result = groups?.map(({ name, id: { _serialized } }) => ({
		name,
		serialized_identifier: _serialized,
	}));
	return response.status(200).send(result);
});

APP.post('/trigger', async (request, response) => {
	if (!venom)
		return response.status(400).send({
			message: 'Venom not initialized',
		});

	const payload = Schema.Trigger.parse(request.body);

	const factory = TriggerFactory();

	const result = await factory.create(payload);

	if (!result.scheduling) {
		const { images, groups, ...trigger } = result;

		const messages = groups.map(async ({ serialized_identifier }, index) => {
			return new Promise((resolve, reject) => {
				try {
					setTimeout(async () => {
						await venom?.sendText(serialized_identifier, trigger.copyright);
						for (const image of images) {
							await venom?.sendImage(serialized_identifier, image.url, '', '');
						}
						resolve({
							name: trigger.name,
							status: 'success',
							message: 'Enviado com sucesso',
						});
					}, 15 * 1000 * (index + 1));
				} catch (error) {
					reject({
						name: trigger.name,
						status: 'error',
						message: 'Erro ao enviar',
					});
				}
			});
		});

		Promise.all(messages).then(() => {});
	}

	return response.status(200).send(result);
});

APP.ready((err) => {
	if (err) throw err;

	APP.io.on('connection', async (so) => {
		console.info('Socket connected!', so.id);
		socket = so;

		if (venom) {
			so.emit('venom_status', {
				message: VenomStatus.isLogged,
				status: 'isLogged',
			});
			venom.initialize();
			venom.reload();
		}

		socket.on('create_venom', async () => {
			venom = await CreateVenomInstance(so);
		});

		socket.on('disconnect', () => {
			console.info('Socket disconnected!', so.id);
		});
	});
});

APP.listen({
	host: '0.0.0.0',
	port: Env.APP_PORT,
}).then(async () => {
	console.log(`Server is running on http://localhost:${Env.APP_PORT}`);
});
