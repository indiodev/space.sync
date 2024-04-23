import { TriggerFactory } from 'app/factories/trigger';
import { SendToGroupPromise } from 'app/helpers/venom';
import { Schema } from 'app/schemas';
import { Venom } from 'app/services/venom';
import { Env } from 'config/env';
import { FastifyReply, FastifyRequest } from 'fastify';

import req from 'request';

class TriggerController {
	constructor() {}

	async create(request: FastifyRequest, response: FastifyReply) {
		const venom = Venom.getInstance();

		if (!venom.isConnected)
			return response.status(400).send({
				message: 'Venom not initialized',
			});

		const payload = Schema.Trigger.parse(request.body);

		const factory = TriggerFactory();

		const result = await factory.create(payload);

		if (!result.scheduling) {
			req({
				url: `${Env.APP_HOST}/trigger/send-to-groups/${result.id}`,
				method: 'POST',
			})
				.on('response', (res) =>
					console.log("Response's status code: ", res.statusCode),
				)
				.on('error', (error) => console.error('Error: ', error));
		}

		return response.status(200).send(result);
	}

	async sendToGroups(request: FastifyRequest, response: FastifyReply) {
		const { id } = request.params as { id: number };
		const venom = Venom.getInstance();

		if (!venom.isConnected)
			return response.status(400).send({
				message: 'Venom not initialized',
			});

		const factory = TriggerFactory();

		const trigger = await factory.findBy({ id });

		if (!trigger) {
			return response.status(400).send({
				message: 'Trigger not found',
			});
		}

		const messages = trigger.groups.map(
			async ({ serialized_identifier }, index) =>
				SendToGroupPromise({
					delay: 15 * 1000 * (index + 1),
					copyright: trigger.copyright,
					serialized_identifier,
					images: trigger.images,
				}),
		);

		Promise.all(messages).then(console.log).catch(console.log);

		return response.status(200).send({
			message: 'Agendamento Enviado com sucesso',
		});
	}
}

export default new TriggerController();
