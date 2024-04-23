import { CreateTrigger, FindTrigger, UpdateTrigger } from 'app/dtos/trigger';
import { Group } from 'app/entities/group';
import { Image } from 'app/entities/image';
import { Trigger } from 'app/entities/trigger';
import { IDatabase } from 'pg-promise';

export class TriggerRepository {
	constructor(private db: IDatabase<{}>) {}

	async create({
		groups,
		images,
		...trigger
	}: CreateTrigger): Promise<Trigger> {
		const tx = await this.db.tx(async (transaction) => {
			const [created_trigger] = await transaction.query<Trigger[]>(
				/*sql*/ `INSERT INTO triggers (name, scheduling_date, delay, copyright) VALUES ($1, $2, $3, $4) RETURNING *;`,
				[
					trigger.name,
					trigger.scheduling_date,
					trigger.delay,
					trigger.copyright,
				],
			);

			const image_values = images
				.flatMap((image) => `(${created_trigger.id}, '${image}')`)
				.join(',\n ');

			const created_images = await transaction.query<Image[]>(/*sql*/ `
				INSERT INTO images (trigger_id, url) VALUES
				${image_values} RETURNING *
			`);

			const group_values = groups
				.flatMap((group) => `(${created_trigger.id}, '${group}')`)
				.join(',\n ');

			const created_groups = await transaction.query<Group[]>(/*sql*/ `
				INSERT INTO groups (trigger_id, serialized_identifier) VALUES
				${group_values} RETURNING *
			`);

			return {
				...created_trigger,
				images: created_images,
				groups: created_groups,
			};
		});

		return tx;
	}

	async findBy({ op, ...payload }: FindTrigger) {
		const WHERE_VALUES = Object.entries(payload)
			.map(([key, value]) => `t.${key} = '${value}'`)
			.join(` ${op} `);

		return await this.db.oneOrNone<Trigger>(/*sql*/ `
			SELECT t.*, 
			(
				SELECT json_agg(json_build_object('url', i.url, 'trigger_id', i.trigger_id))
        FROM images i
        WHERE i.trigger_id = t.id
			) AS images, 
			(
				SELECT json_agg(json_build_object('serialized_identifier', g.serialized_identifier, 'trigger_id', g.trigger_id))
				FROM groups g
				WHERE g.trigger_id = t.id
			) as groups
			FROM triggers t
			LEFT JOIN groups g ON t.id = g.trigger_id
			WHERE ${WHERE_VALUES}
			GROUP BY t.id
		`);
	}

	async update({ id, ...payload }: UpdateTrigger) {
		const tx = await this.db.tx(async (transaction) => {
			const values = Object.values(payload);
			const keys = Object.keys(payload);
			const UPDATE_COLUMNS = keys
				.map((key, index) => `${key} = $${index + 1}`)
				.join(', ');
			const WHERE_VALUES = `${UPDATE_COLUMNS} WHERE id = $${keys.length + 1}`;

			const [updated_trigger] = await transaction.query<Trigger[]>(
				/*sql*/ `UPDATE triggers SET ${WHERE_VALUES} RETURNING *;`,
				[...values, id],
			);

			return updated_trigger;
		});

		return tx;
	}

	async list() {
		return await this.db.manyOrNone<Trigger>(/*sql*/ `SELECT * FROM triggers;`);
	}
}
