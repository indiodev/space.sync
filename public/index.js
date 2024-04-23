document.addEventListener('DOMContentLoaded', function () {
	var socket = io();

	const img = document.querySelector('img');
	const status = document.getElementById('status');
	const toggle = document.getElementById('toggle');
	const qrcode_container = document.getElementById('qrcode_container');

	toggle.addEventListener('click', function () {
		toggle.checked = false;
		socket.emit('create_venom_instance', () => {});
	});

	socket.on('venom_status', ({ message, status: venom_status }) => {
		console.log(venom_status, message);
		if (venom_status === 'online' || venom_status === 'successChat') {
			toggle.checked = true;
			img.src = '/public/logo.jpg';
			qrcode_container.setAttribute('data-qrcode', 'no-generated');
		}

		if (venom_status === 'notLogged') {
			qrcode_container.setAttribute('data-qrcode', 'generated');
		}

		status.textContent = `${message}`;
	});

	socket.on('qrcode', function ({ qrCode }) {
		const img = document.querySelector('img');
		img.src = qrCode;
	});
});
