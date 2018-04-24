const socket = io.connect('http://socktest.fr.openode.io:80');

socket.on('connect', () => {
	socket.emit('adduser', prompt("Enter username"));
});

socket.on('updatechat', (username, data) => {
	$('#conversation').append(`<b>${username}:</b> ${data}<br>`);
});

socket.on('updaterooms', (rooms, current_room) => {
	$('#rooms').empty();
	$.each(rooms, (key, value) => {
		if(value == current_room){
			$('#rooms').append(`<div>${value}</div>`);
		}
		else {
			$('#rooms').append(`<div><a href="#" onclick="switchRoom('${value}')">${value}</a></div>`);
		}
	});
});

const switchRoom = (room) => {
	socket.emit('switchRoom', room);
}

$(() => {
	$('#datasend').click( () => {
		const message = $('#data').val();
		$('#data').val('');
		socket.emit('sendchat', message);
	});

	$('#data').keypress((e) => {
		if(e.which == 13) {
			$(this).blur();
			$('#datasend').focus().click();
		}
	});
});
