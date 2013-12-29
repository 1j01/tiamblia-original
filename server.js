var io = require("socket.io").listen(1990,{log:false});

var players = [];
var UID = 0;

io.configure(function(){
	io.set('transports', [
		'websocket',
		'flashsocket',
		//'htmlfile',
		//'xhr-polling',
		//'jsonp-polling',
	]);
});

io.sockets.on("connection",function(socket){
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
