var http = require('http');
var fs = require('fs');
var httpServer = http.createServer(requestHandler);
httpServer.listen(8080);

function requestHandler(request, response){
	//console.log(__dirname + '../client/index.html');
	
	var file = request.url === '/' ? '/index.html' : request.url;
	fs.readFile(__dirname + '/../client' + file,

		function (err, data){
			if(err){
				response.writeHead(500);
				return response.end('Error loading');
			}

			response.writeHead(200);
			response.end(data);
		}
	);
}




var emitters = {};

var io = require('socket.io').listen(httpServer);

io.sockets.on('connection', 
	function(socket){
		console.log("connected");
		socket.on('createEmitter', function(data){

			socket.broadcast.emit('createEmitter', data);
			for(var socketId in emitters){
				io.sockets.emit('createEmitter', emitters[socketId]);
			}
			emitters[socket.id] = data;

		});
	
		socket.on('disconnect', function() {

			socket.broadcast.emit('destroyEmitter', emitters[socket.id]);
			console.log("destroy emitter", emitters[socket.id]);
			emitters[socket.id] = null;
		});

	}
);






