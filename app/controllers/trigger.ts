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

		const payload = Schema.Trigger.Create.parse(request.body);

		const factory = TriggerFactory();

		const result = await factory.create(payload);

		if (!result.scheduling_date) {
			req({
				url: `${Env.APP_HOST}/trigger/${result.id}/send-to-groups`,
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

		await factory.update({ id, status: 'sending' });

		const messages = trigger.groups.map(
			async ({ serialized_identifier }, index) => {
				const DELAY_IN_SECONDS = trigger.delay * 1000 * (index + 1);

				return SendToGroupPromise({
					delay: DELAY_IN_SECONDS,
					copyright: trigger.copyright,
					serialized_identifier,
					images: trigger.images,
				});
			},
		);

		Promise.all(messages)
			.then(async () => {
				await factory.update({ id, status: 'success' });
			})
			.catch(async (error) => {
				console.log(error);
				await factory.update({ id, status: 'failed' });
			});

		return response.status(200).send({
			message: 'Agendamento Enviado com sucesso',
		});
	}

	async update(request: FastifyRequest, response: FastifyReply) {
		const { id } = Schema.Trigger.Update.parse(request.params);
		const payload = Schema.Trigger.Update.parse(request.body);
		const factory = TriggerFactory();
		const result = await factory.update({ ...payload, id });
		return response.status(200).send(result);
	}

	async paginate(request: FastifyRequest, response: FastifyReply) {
		const triggers = await TriggerFactory().list();
		return response.status(200).send(triggers);
	}
}

export default new TriggerController();
