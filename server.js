var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname));

http.listen(3000, function(){
	console.log('listening on *:3000');
});

var players = [];
var UID = 0;

io.on("connection",function(socket){

	var player = {socket:socket, id:UID++};
	players.push(player);
	console.log(`a user connected, now ${players.length} player${players.length === 1 ? "" : "s"}`);
	
	socket.on('disconnect', function(){
		var index = players.indexOf(player);
		if(index >= 0){
			players.splice(index, 1);
		}
		console.log(`user disconnected, now ${players.length} player${players.length === 1 ? "" : "s"}`);
	});

	socket.on("position",function(pos){
		player.pos = pos;
		
		socket.broadcast.volatile.emit("position",{id:player.id, pos:player.pos});
	});
});
