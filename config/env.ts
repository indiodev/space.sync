import 'dotenv/config';

import { z } from 'zod';

const Schema = z.object({
	NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
	JWT_SECRET: z.string(),

	APP_PORT: z.coerce.number().default(3333),
	APP_HOST: z.string(),

	DB_HOST: z.string(),
	DB_USERNAME: z.string(),
	DB_PASSWORD: z.string(),
	DB_DATABASE: z.string(),
	DB_PORT: z.coerce.number().default(5432),

	STORAGE_ACCESS_KEY_ID: z.string(),
	STORAGE_SECRET_ACCESS_KEY: z.string(),
	STORAGE_DEFAULT_REGION: z.string(),
	STORAGE_BUCKET_NAME: z.string(),
});

const parse = Schema.safeParse(process.env);

if (!parse.success) {
	console.error('❌️ Invalid environment variables', parse.error.format());

	throw new Error('Invalid environment variables.');
}

export const Env = parse.data;
