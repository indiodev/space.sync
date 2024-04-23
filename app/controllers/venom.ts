import { Venom } from 'app/services/venom';
import { FastifyReply, FastifyRequest } from 'fastify';

class VenomController {
	constructor() {}

	async groups(request: FastifyRequest, response: FastifyReply) {
		const venom = Venom.getInstance();

		if (!venom.isConnected)
			return response.status(400).send({
				message: 'Venom not initialized',
			});

		const groups = await venom?.groupList();

		const result = groups?.map(({ name, id: { _serialized } }) => ({
			name,
			serialized_identifier: _serialized,
		}));

		return response.status(200).send(result);
	}
}

export default new VenomController();
