import { z } from 'zod';

export const CreateTrigger = z.object({
	name: z.string(),
	scheduling_date: z.string().nullable(),
	delay: z.number(),
	copyright: z.string(),
	images: z.array(z.string()),
	groups: z.array(z.string()),
});

export const UpdateTrigger = z.object({
	id: z.coerce.number(),
	name: z.string().optional(),
	status: z.enum(['pending', 'success', 'failed', 'sending']).optional(),
	scheduling_date: z.string().nullable().optional(),
	delay: z.number().optional(),
	copyright: z.string().optional(),
});
