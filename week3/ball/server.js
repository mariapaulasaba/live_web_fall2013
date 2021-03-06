// HTTP Portion
var http = require('http');
var fs = require('fs'); // Using the filesystem module
var httpServer = http.createServer(requestHandler);
httpServer.listen(8080);

function requestHandler(req, res) {
	// Read index.html
	fs.readFile(__dirname + '/index.html', 
		// Callback function for reading
		function (err, data) {
			// if there is an error
			if (err) {
				res.writeHead(500);
				return res.end('Error loading canvas_socket.html');
			}
			// Otherwise, send the data, the contents of the file
			res.writeHead(200);
			res.end(data);
  		}
  	);
};


// WebSocket Portion
// WebSockets work with the HTTP server
var io = require('socket.io').listen(httpServer);

var users = new Array();


// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection', 
	// We are given a websocket object in our function
	function (socket) {
		users[users.length] = socket.id;

		socket.emit('myBall', socket.id);

		for(var i = 0; i < users.length; i++){
		   socket.emit('createBall', users[i]);	
		   //console.log('created bal with id '+clientId);
		}


		//console.log("We have a new client: " + socket.id);
		socket.on('createBall', function(data){
			socket.broadcast.emit('createBall', data);
		});

		socket.on('sendmouse', function(data){
			socket.broadcast.emit('sendmouse', data);
		});
		
		socket.on('disconnect', function() {
			console.log("Client has disconnected " + socket.id);
			for(var i = 0; i < users.length; i++){
			socket.broadcast.emit('destroyBall', socket.id);
			users.splice[socket.id,1];
			}
		});

	}
);
