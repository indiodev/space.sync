import { Group } from './group';
import { Image } from './image';

export type Trigger = {
	id: number;
	name: string;
	scheduling_date: string;
	status: 'pending' | 'success' | 'failed' | 'sending';
	delay: number;
	copyright: string;
	created_at: string;
	updated_at: string;
	groups: Group[];
	images: Image[];
};
