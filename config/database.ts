import promise from 'pg-promise';
import { Env } from './env';

export const Connection = promise({})({
	// idleTimeoutMillis: 30,
	host: Env.DB_HOST,
	port: Env.DB_PORT,
	database: Env.DB_DATABASE,
	user: Env.DB_USERNAME,
	password: Env.DB_PASSWORD,
	// ssl: {
	// 	rejectUnauthorized: false,
	// },
	ssl: false,
});
