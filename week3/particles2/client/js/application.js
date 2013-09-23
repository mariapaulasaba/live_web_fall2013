var socket = io.connect('http://192.168.0.11:8080/');
var myEmitter;
socket.on('connect', function() {
	myEmitter = createEmitter();
	socket.emit('createEmitter', myEmitter);
});

socket.on('createEmitter', function(data){

	if(!data || data.id === myEmitter.id) return;
	createEmitter(data.x, data.y, data.id, data.angle);
});

socket.on('destroyEmitter', function(data){
	destroyEmitter(data.id);
});