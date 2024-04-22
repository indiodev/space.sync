import { Socket as SocketBase } from 'socket.io';

export class Socket {
	private static instance: Socket | null = null;
	private io: SocketBase | null = null;

	constructor() {}

	static getInstance(): Socket {
		if (!Socket.instance) Socket.instance = new Socket();

		return Socket.instance;
	}

	isInitialized() {
		return this.io !== null;
	}

	public init(socket: SocketBase) {
		this.io = socket;
		return this;
	}

	event(): SocketBase {
		if (!this.isInitialized()) throw new Error('Socket not initialized');
		return this.io!;
	}
}
