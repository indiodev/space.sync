import { ChatGroup, VenomSendImage, VenomSendText } from 'app/dtos/venom';
import { VenomCreateOptions } from 'app/entities/venom';
import { Whatsapp, create } from 'venom-bot';

export class Venom {
	private static instance: Venom | null = null;
	private whatsapp: Whatsapp | null = null;
	public isConnected = false;

	constructor() {}

	static getInstance() {
		if (!Venom.instance) Venom.instance = new Venom();

		return Venom.instance;
	}

	async init(payload: VenomCreateOptions) {
		this.whatsapp = await create(payload);
		this.isConnected = true;
		return this;
	}

	async sendText({ to, content }: VenomSendText) {
		await this.whatsapp?.startTyping(to, true);
		return await this.whatsapp?.sendText(to, content);
	}

	async sendImage({
		to,
		filePath,
		caption = '',
		filename = 'venom_image',
		passId,
	}: VenomSendImage) {
		return this.whatsapp?.sendImage(to, filePath, caption, filename, passId);
	}

	async groupList(): Promise<ChatGroup[]> {
		const groups = await this.whatsapp?.getAllChatsGroups();
		return groups as ChatGroup[];
	}
}
