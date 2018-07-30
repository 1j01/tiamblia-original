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
	console.log('a user connected');

	var player = {socket:socket, id:UID++};
	players.push(player);
	
	//socket.emit("ok",);
	socket.on("position",function(pos){
		player.pos = pos;
		
		//io.sockets.emit("position",{pid:player.pid});
		socket.broadcast.volatile.emit("position",{id:player.id, pos:player.pos});
		
		//console.log("position",pos,"id",player.id);
	});
	
});
