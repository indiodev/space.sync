document.addEventListener('DOMContentLoaded', function () {
	var socket = io();

	const img = document.querySelector('img');
	const status = document.getElementById('status');
	const toggle = document.getElementById('toggle');

	toggle.addEventListener('click', function () {
		toggle.checked = false;

		axios
			.post('/venom/new-instance/generate-qr-code')
			.then(console.log)
			.catch(console.log);
	});

	socket.on('venom_status', ({ message, status: venom_status }) => {
		if (venom_status === 'online') {
			toggle.checked = true;
			img.src = '/public/logo.png';
		}

		status.textContent = `${message}`;
	});

	socket.on('qrcode', function ({ qrCode }) {
		console.log({ qrCode });
		const img = document.querySelector('img');
		img.src = qrCode;
	});
});
