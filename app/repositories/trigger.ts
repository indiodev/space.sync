import { CreateTrigger } from 'app/dtos/trigger';
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
				/*sql*/ `INSERT INTO triggers (name, scheduling, delay, copyright) VALUES ($1, $2, $3, $4) RETURNING *;`,
				[trigger.name, trigger.scheduling, trigger.delay, trigger.copyright],
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

	async findBy({ op, ...payload }: any) {
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
			WHERE ${Object.keys(payload)
				.map((key) => `t.${key} = '${payload[key]}'`)
				.join(` ${op} `)}
			GROUP BY t.id
		`);
	}
}
