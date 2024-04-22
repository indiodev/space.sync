import { ChatGroup, VenomSendImage, VenomSendText } from 'app/dtos/venom';
import { VenomCreateOptions } from 'app/entities/venom';
import { existsSync } from 'fs';
import { rm } from 'fs/promises';
import { Whatsapp, create } from 'venom-bot';

export class Venom {
	private static instance: Venom | null = null;
	private whatsapp: Whatsapp | null = null;
	private session: string = 'venom_bot';

	constructor() {}

	static getInstance() {
		if (!Venom.instance) Venom.instance = new Venom();

		return Venom.instance;
	}

	isInitialized() {
		return this.whatsapp !== null;
	}

	async init(payload: VenomCreateOptions) {
		this.session = payload.session ?? this.session;
		this.whatsapp = await create(payload);
		return this;
	}

	async sendText({ to, content }: VenomSendText) {
		if (!this.whatsapp) throw new Error('Venom not initialized');
		return await this.whatsapp.sendText(to, content);
	}

	async sendImage({
		to,
		filePath,
		caption = '',
		filename = 'venom_image',
		passId,
	}: VenomSendImage) {
		if (!this.whatsapp) throw new Error('Venom not initialized');
		return this.whatsapp.sendImage(to, filePath, caption, filename, passId);
	}

	async groupList(): Promise<ChatGroup[]> {
		if (!this.whatsapp) throw new Error('Venom not initialized');

		const groups = await this.whatsapp.getAllChatsGroups();
		return groups as ChatGroup[];
	}

	async clear() {
		if (!this.whatsapp || !this.isInitialized())
			throw new Error('Venom not initialized');

		await this.whatsapp.logout();
		await this.whatsapp.close();

		if (existsSync(`./tokens/${this.session}`)) {
			await rm(`./tokens/${this.session}`, { recursive: true });
		}
	}
}
