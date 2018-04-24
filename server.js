const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io').listen(server);

server.listen(80) ?
 console.log('Connected to localhost:80')
 :console.log('failed');

 app.use(express.static('public'))

// routing
app.get('/', (req, res) => {
  res.sendFile('index.html');
});

const usernames = {};

const rooms = ['default','fish','fly','fruit', 'random'];

io.sockets.on('connection', socket => {
	
	socket.on('adduser', username => {
		socket.username = username;
		socket.room = 'default';
		usernames[username] = username;
		socket.join('default');
		socket.emit('updatechat', 'SERVER', 'you have connected to default');
		socket.broadcast.to('room1').emit('updatechat', 'SERVER', `${username} has connected to this room`);
		socket.emit('updaterooms', rooms, 'default');
	});
	
	// when the client emits 'sendchat', this listens and executes
	socket.on('sendchat', data => {
		io.sockets.in(socket.room).emit('updatechat', socket.username, data);
	});
	
	socket.on('switchRoom', newroom => {
		socket.leave(socket.room);
		socket.join(newroom);
		socket.emit('updatechat', 'SERVER', `you have connected to ${newroom}`);
		socket.broadcast.to(socket.room).emit('updatechat', 'SERVER', `${socket.username} has left this room`);
		socket.room = newroom;
		socket.broadcast.to(newroom).emit('updatechat', 'SERVER', `${socket.username} has joined this room`);
		socket.emit('updaterooms', rooms, newroom);
	});
	

	// when the user disconnects.. perform this
	socket.on('disconnect', () => {
		delete usernames[socket.username];
		io.sockets.emit('updateusers', usernames);
		socket.broadcast.emit('updatechat', 'SERVER', `${socket.username} has disconnected`);
		socket.leave(socket.room);
	});
});
