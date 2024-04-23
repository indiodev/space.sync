import { Socket as SocketBase } from 'socket.io';

export class Socket {
	private static instance: Socket | null = null;
	public io: SocketBase | null = null;
	public isConnected = false;

	constructor() {}

	static getInstance(): Socket {
		if (!Socket.instance) Socket.instance = new Socket();

		return Socket.instance;
	}

	public init(socket: SocketBase) {
		this.io = socket;
		this.isConnected = true;
		return this;
	}
}
