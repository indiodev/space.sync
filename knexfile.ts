import type { Knex } from 'knex';
import { join } from 'path';
import { Env } from './env';

// Update with your config settings.

const config: { [key: string]: Knex.Config } = {
	development: {
		client: 'postgresql',
		connection: {
			host: Env.DB_HOST,
			port: Env.DB_PORT,
			user: Env.DB_USERNAME,
			password: Env.DB_PASSWORD,
			database: Env.DB_DATABASE,

			ssl: {
				rejectUnauthorized: false,
			},
		},
		migrations: {
			directory: join(__dirname, 'database/migrations'),
			tableName: 'knex_migrations',
		},
		seeds: {
			directory: join(__dirname, 'database/seeders'),
		},
	},

	staging: {
		client: 'postgresql',
		connection: {
			host: Env.DB_HOST,
			port: Env.DB_PORT,
			user: Env.DB_USERNAME,
			password: Env.DB_PASSWORD,
			database: Env.DB_DATABASE,

			ssl: {
				rejectUnauthorized: false,
			},
		},
		pool: {
			min: 2,
			max: 10,
		},
		migrations: {
			directory: join(__dirname, 'database/migrations'),
			tableName: 'knex_migrations',
		},
		seeds: {
			directory: join(__dirname, 'database/seeders'),
		},
	},

	production: {
		client: 'postgresql',
		connection: {
			host: Env.DB_HOST,
			port: Env.DB_PORT,
			user: Env.DB_USERNAME,
			password: Env.DB_PASSWORD,
			database: Env.DB_DATABASE,

			ssl: {
				rejectUnauthorized: false,
			},
		},
		pool: {
			min: 2,
			max: 10,
		},
		migrations: {
			directory: join(__dirname, 'database/migrations'),
			tableName: 'knex_migrations',
		},
		seeds: {
			directory: join(__dirname, 'database/seeders'),
		},
	},
};

module.exports = config;
