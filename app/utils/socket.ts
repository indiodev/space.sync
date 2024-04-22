import { Socket } from 'app/services/Socket';
import { Venom } from 'app/services/venom';
import { Socket as SocketBase } from 'socket.io';
import { VenomStatus } from './venom';

export async function SocketHandler(socket: SocketBase) {
	console.info('Socket connected!', socket.id);

	const _socket = Socket.getInstance();
	const venom = Venom.getInstance();

	if (!_socket.isInitialized()) {
		_socket?.init(socket);
	}

	if (venom.isInitialized()) {
		console.log('Venom not initialized');
		socket.emit('venom_status', {
			message: VenomStatus.online,
			status: 'online',
		});
	}

	socket.on('disconnect', () => {
		console.info('Socket disconnected!', socket.id);
	});
}
