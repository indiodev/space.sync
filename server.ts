import { APP } from 'app';
import { SocketHandler } from 'app/helpers/socket';
import { Env } from 'config/env';

// export const update_job = new AsyncTask('Simple Task', async () => {
// 	const triggers = await Connection.manyOrNone<Trigger>(
// 		/*sql*/ `SELECT * FROM triggers WHERE status = 'pending' AND scheduling_date >= CURRENT_TIMESTAMP AT TIME ZONE 'UTC';`,
// 	);

// 	const tasks = triggers.map(
// 		(trigger) =>
// 			new Task(trigger.name, () => {
// 				console.log(trigger.id + ' ' + trigger.scheduling_date);
// 			}),
// 	);

// 	const jobs = tasks.map((task) => new SimpleIntervalJob({ seconds: 5 }, task));

// 	// APP.scheduler.addSimpleIntervalJob

// 	jobs.map((job) => APP.scheduler.addSimpleIntervalJob(job));

// 	console.log('trigger', JSON.stringify(triggers, null, 2));
// 	return Promise.resolve();
// });

// export const update_job_request = new SimpleIntervalJob(
// 	{ seconds: 5 },
// 	update_job,
// );

APP.ready((err) => {
	if (err) throw err;
	APP.io.on('connection', SocketHandler);
	// APP.scheduler.addSimpleIntervalJob(update_job_request);
});

APP.listen({
	host: '0.0.0.0',
	port: Env.APP_PORT,
}).then(async () => {
	console.log(`Server is running on ${Env.APP_HOST}`);
});
