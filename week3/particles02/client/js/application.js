var socket = io.connect('http://localhost:8080/');
var myEmitter;
socket.on('connect', function() {
	connected = true;
	myEmitter = createEmitter();
	socket.emit('createEmitter', myEmitter);
});

socket.on('createEmitter', function(data){

	if(!data || data.id === myEmitter.id) return;
	createEmitter(data.x, data.y, data.id, data.angle);
});

socket.on('mouseposition', function(data){

	if(!data || data.id === myEmitter.id) return;
	changePosition(data.x, data.y);

});

socket.on('destroyEmitter', function(data){
	destroyEmitter(data.id);
});


var sendmouse = function(xval, yval, idval) {

	//console.log("sendmouse: " + xval + " " + yval);
	socket.emit('mouseposition',{ x: xval, y: yval, id: idval});
};