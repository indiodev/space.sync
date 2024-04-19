import 'dotenv/config';

import { z } from 'zod';

const Schema = z.object({
	NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
	JWT_SECRET: z.string(),

	APP_PORT: z.coerce.number().default(3333),

	DB_HOST: z.string(),
	DB_USERNAME: z.string(),
	DB_PASSWORD: z.string(),
	DB_DATABASE: z.string(),
	DB_PORT: z.coerce.number().default(5432),
});

const parse = Schema.safeParse(process.env);

if (!parse.success) {
	console.error('❌️ Invalid environment variables', parse.error.format());

	throw new Error('Invalid environment variables.');
}

export const Env = parse.data;
