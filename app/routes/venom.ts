import venom from 'app/controllers/venom';
import { FastifyInstance } from 'fastify';

export async function VenomRoute(app: FastifyInstance) {
	app.get('/groups', venom.groups);
}
