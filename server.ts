import { APP } from 'app';
import { SocketHandler } from 'app/helpers/socket';
import { Env } from 'config/env';

APP.ready((err) => {
	if (err) throw err;
	APP.io.on('connection', SocketHandler);
});

APP.listen({
	host: '0.0.0.0',
	port: Env.APP_PORT,
}).then(async () => {
	console.log(`Server is running on ${Env.APP_HOST}`);
});
