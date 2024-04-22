import { Socket } from 'app/services/Socket';
import { Venom } from 'app/services/venom';
import { VenomStatus } from 'app/utils/venom';
import { FastifyReply, FastifyRequest } from 'fastify';

class VenomController {
	constructor() {}

	async groups(request: FastifyRequest, response: FastifyReply) {
		const venom = Venom.getInstance();

		if (!venom.isInitialized())
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

	async initialized(request: FastifyRequest, response: FastifyReply) {
		const socket = Socket.getInstance();
		const venom = Venom.getInstance();

		if (venom.isInitialized()) {
			venom.clear();
		}

		if (!socket.isInitialized())
			return response.status(400).send({
				message: 'you need to connect your client to the socket',
			});

		venom.init({
			session: 'space_sync',
			logQR: false,
			multidevice: false,
			catchQR: (qrCode) => {
				socket.event().emit('qrcode', { qrCode });
			},
			statusFind: (status) => {
				socket.event().emit('venom_status', {
					message:
						VenomStatus[status as keyof typeof VenomStatus] ||
						'Erro ao buscar status da sessão',
					status,
				});
			},
		});

		return response
			.status(200)
			.send({ message: 'starting services and generating the qrcode, wait.' });
	}
}

export default new VenomController();
