export type ChatGroup = {
	name: string;
	id: { _serialized: string };
};

export type VenomSendText = {
	to: string;
	content: string;
	passId?: any;
	checkNumber?: boolean;
	forcingReturn?: boolean;
	delSend?: boolean;
};

export type VenomSendImage = {
	to: string;
	filePath: string;
	filename?: string;
	caption?: string;
	passId?: any;
};
