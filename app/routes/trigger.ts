import trigger from 'app/controllers/trigger';
import { FastifyInstance } from 'fastify';

export async function TriggerRoute(app: FastifyInstance) {
	app.post('/', trigger.create);
	app.post('/:id/send-to-groups', trigger.sendToGroups);
	app.patch('/:id', trigger.update);
	app.get('/paginate', trigger.paginate);
}
