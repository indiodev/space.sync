import { APP } from './src/app';

APP.listen({
	host: '0.0.0.0',
	port: 3000,
}).then(() => {
	console.log('Server is running on port 3000');
});
