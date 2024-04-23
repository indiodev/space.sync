import { Socket } from 'app/services/socket';
import { Venom } from 'app/services/venom';
import { Socket as SocketBase } from 'socket.io';
import { VenomStatus } from './constant';

export async function SocketHandler(socket: SocketBase) {
	console.info('Socket connected!', socket.id);

	const _socket = Socket.getInstance();
	const venom = Venom.getInstance();

	if (!_socket.isConnected) {
		_socket?.init(socket);
	}

	if (venom.isConnected) {
		socket.emit('venom_status', {
			message: VenomStatus.online,
			status: 'online',
		});
	}

	socket.on('create_venom_instance', async () => {
		await venom.init({
			session: 'space_sync',
			logQR: false,
			multidevice: false,
			catchQR: (qrCode) => {
				socket.emit('qrcode', { qrCode });
			},
			statusFind: (status) => {
				socket.emit('venom_status', {
					message:
						VenomStatus[status as keyof typeof VenomStatus] ||
						'Erro ao buscar status da sessão',
					status,
				});
			},
		});
	});

	socket.on('disconnect', () => {
		console.info('Socket disconnected!', socket.id);
	});
}
