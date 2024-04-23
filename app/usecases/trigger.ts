import { APP } from 'app';
import { CreateTrigger, FindTrigger, UpdateTrigger } from 'app/dtos/trigger';
import { TriggerRepository } from 'app/repositories/trigger';
import { Env } from 'config/env';
import request from 'request';
import { AsyncTask, CronJob } from 'toad-scheduler';

export class TriggerUseCase {
	constructor(private repository: TriggerRepository) {}
	async create(payload: CreateTrigger) {
		return this.repository.create(payload);
	}

	async findBy(payload: FindTrigger) {
		return this.repository.findBy(payload);
	}

	async update(payload: UpdateTrigger) {
		const trigger = await this.repository.findBy({ id: payload.id });

		if (!trigger) throw new Error('Trigger not found');

		return this.repository.update(payload);
	}

	async list() {
		return this.repository.list();
	}

	sendToGroups(id: number) {
		request({
			url: `${Env.APP_HOST}/trigger/${id}/send-to-groups`,
			method: 'POST',
		})
			.on('response', (res) =>
				console.log("Response's status code: ", res.statusCode),
			)
			.on('error', (error) => console.error('Error: ', error));
	}

	createJob({ id, scheduling_date }: { id: number; scheduling_date: string }) {
		const [date_part, time_part] = scheduling_date?.split(' ')!;

		const [, month, day] = date_part.split('-');
		const [hours, minutes] = time_part.split(':');

		const cronExpression = `00 ${minutes} ${hours} ${day} ${month} *`;

		console.log(cronExpression);

		const task = new AsyncTask(`trigger-${id}-${scheduling_date}`, async () => {
			console.info(
				`[trigger-${id}-${scheduling_date}] [event: sending to groups]`,
			);

			this.sendToGroups(id);

			return Promise.resolve();
		});

		const job = new CronJob(
			{
				cronExpression,
			},
			task,
			{ preventOverrun: true },
		);

		APP.scheduler.addCronJob(job);
	}
}
