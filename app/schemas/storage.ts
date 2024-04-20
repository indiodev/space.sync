import { z } from 'zod';

export const Presigned = z.object({
	extname: z.string(),
	type: z.string(),
});

export const Remove = z.object({
	path: z.string(),
});
