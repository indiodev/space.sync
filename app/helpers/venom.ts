import { VenomSendToGroup } from 'app/dtos/venom';
import { Venom } from 'app/services/venom';

export async function SendToGroup(payload: VenomSendToGroup) {
	const venom = Venom.getInstance();

	await venom?.sendText({
		to: payload.serialized_identifier,
		content: payload.copyright,
	});

	for (const image of payload.images) {
		await venom?.sendImage({
			to: payload.serialized_identifier,
			filePath: image.url,
			filename: '',
			caption: '',
		});
	}
}

export function SendToGroupPromise(
	payload: VenomSendToGroup & { delay: number },
) {
	return new Promise((resolve, reject) => {
		try {
			setTimeout(async () => {
				await SendToGroup({
					copyright: payload.copyright,
					serialized_identifier: payload.serialized_identifier,
					images: payload.images,
				});
				resolve({
					name: payload.serialized_identifier,
				});
			}, payload.delay);
		} catch (error) {
			reject(error);
		}
	});
}
