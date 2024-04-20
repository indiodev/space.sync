import { VenomCreateOptions } from 'app/entities/venom';
import { Socket } from 'socket.io';
import { create as CreateVenom } from 'venom-bot';
import { VenomStatus } from './venom';

export async function CreateVenomInstance(socket: Socket) {
	return await CreateVenom({
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
	} as VenomCreateOptions);
}
