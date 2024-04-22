import { TriggerFactory } from 'app/factories/trigger';
import { Schema } from 'app/schemas';
import { Venom } from 'app/services/venom';
import { FastifyReply, FastifyRequest } from 'fastify';

class TriggerController {
	constructor() {}

	async create(request: FastifyRequest, response: FastifyReply) {
		const venom = Venom.getInstance();

		if (!venom.isInitialized())
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
							await venom?.sendText({
								to: serialized_identifier,
								content: trigger.copyright,
							});
							for (const image of images) {
								await venom?.sendImage({
									to: serialized_identifier,
									filePath: image.url,
									filename: '',
									caption: '',
								});
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
	}
}

export default new TriggerController();
