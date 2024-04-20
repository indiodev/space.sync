import { Group } from 'app/entities/group';
import { Image } from 'app/entities/image';
import { Trigger } from 'app/entities/trigger';
import { Whatsapp as Venom } from 'venom-bot';

export async function SendMessageToGroup(
	venom: Venom,
	payload: {
		trigger: Omit<Trigger, 'groups' | 'images'>;
		group: Group;
		images: Image[];
	},
) {
	try {
		await venom.sendText(
			payload.group.serialized_identifier,
			payload.trigger.copyright,
		);

		for (const image of payload.images) {
			await venom.sendImage(
				payload.group.serialized_identifier,
				image.url,
				'',
				'',
			);
		}
	} catch (error) {
		console.log(error);
	}
}

export async function SendMessageToGroupWithDelay(
	venom: Venom,
	payload: {
		group: Group;
		trigger: Omit<Trigger, 'groups' | 'images'>;
		images: Image[];
	},
) {
	return new Promise<void>((resolve, reject) => {
		try {
			setTimeout(async () => {
				await SendMessageToGroup(venom, {
					group: payload.group,
					images: payload.images,
					trigger: payload.trigger,
				});
				resolve();
			}, payload.trigger.delay * 1000);
		} catch (error) {
			reject(error);
		}
	});
}
