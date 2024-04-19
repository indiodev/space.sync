import Trigger from 'app/controllers/trigger';
import type { FastifyInstance } from 'fastify';

export async function TriggerRoute(app: FastifyInstance): Promise<void> {
	app.post('/', Trigger.create);
}
