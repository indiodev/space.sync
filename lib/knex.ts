import knex from 'knex';

export const Knex = knex({
	client: 'pg',
	connection: {},
});
