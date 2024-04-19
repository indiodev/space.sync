import { TriggerFactory } from 'app/factories/trigger';
import { Schema } from 'app/schemas';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';

class TriggerController {
	constructor() {}
	async create(request: FastifyRequest, response: FastifyReply) {
		try {
			const payload = Schema.Trigger.parse(request.body);

			const factory = TriggerFactory();

			const result = await factory.create(payload);

			return response.status(200).send(result);
		} catch (error) {
			if (error instanceof ZodError) {
				return response.status(400).send(error.issues);
			}
			return response.status(400).send(error);
		}
	}
}

export default new TriggerController();
