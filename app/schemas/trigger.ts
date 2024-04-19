import { z } from 'zod';

export const Trigger = z.object({
	name: z.string(),
	scheduling: z.string().nullable(),
	delay: z.number(),
	copyright: z.string(),
	images: z.array(z.string()),
	groups: z.array(z.string()),
});
