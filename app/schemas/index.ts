import { Presigned, Remove } from './storage';
import { CreateTrigger, UpdateTrigger } from './trigger';

export const Schema = {
	Trigger: {
		Create: CreateTrigger,
		Update: UpdateTrigger,
	},
	Storage: {
		Presigned,
		Remove,
	},
};
