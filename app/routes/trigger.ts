import trigger from 'app/controllers/trigger';
import { FastifyInstance } from 'fastify';

export async function TriggerRoute(app: FastifyInstance) {
	app.post('/', trigger.create);
	app.post('/send-to-groups/:id', trigger.sendToGroups);
}
