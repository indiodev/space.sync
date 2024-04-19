import { Group } from './group';
import { Image } from './image';

export type Trigger = {
	id: number;
	name: string;
	scheduling: string;
	delay: number;
	copyright: number;
	created_at: string;
	updated_at: string;
	groups: Group[] | null;
	images: Image[] | null;
};
