var app = require('http').createServer(handler)
 , io = require('socket.io').listen(app)
 , fs = require('fs');

app.listen(8080);

function handler (req, res) {
 fs.readFile(__dirname + '/index.html',
 function (err, data) {
 if (err) {
 res.writeHead(500);
 return res.end('Error loading index.html');
 }
 res.writeHead(200);
 res.end(data);
 });
}


var users = new Array();
var userNum = 4;
var indexNum = 0;


io.sockets.on('connection', function (socket) {


	console.log("we have bling bling new client : "+socket.id );
 

 // 	socket.on('message', function (data) {
 // 	console.log("message: " + data);
// socket.broadcast.emit('message',data);
// });

	socket.on('requestBroadcast', function(data) {

		console.log("this is the peer id that you should make call "+ data);
		socket.broadcast.emit('requestBroadcast',data);

	});

	socket.on('peerevent', function(data) {	
		
		// user data is being sent in 'username,peerid' form.
	var userinfo = data.split(",");	

		users.push({
	 		s_id:socket.id,
			name :userinfo[0],
			peerid : userinfo[1],
			score : null,
			active: false
	 	});



		if(users.length > userNum -1){
					console.log("hellow you just hit 4, so I am seding first user data"+indexNum);
					io.sockets.emit('setUser',users[indexNum].name);
		}


//		users.push(data);
//		for(var i =0; i<users.length;i++){
//			if(i === indexNum ) users[i].active = true;
//			else user[i].active = false;
//			//users[0].active = true;
//		}
	

		io.sockets.emit('getAllUsers',users);

	});
	
	
	socket.on('readyForGame',function(){
	
			indexNum++;
			//indexNum%=userNum;
			console.log(indexNum);
			if(indexNum > users.length-1) {
				
				var maxValue = 0;
				var winner = null;
				
				for(var i = 0; i<users.length; i++){
					
					if(users[i].score > maxValue) {
						maxValue = users[i].score;
						winner = users[i].name;
						}
		
				}
			
				io.sockets.emit('gameOver',{winner:winner,score:maxValue});
			}else{
				io.sockets.emit('setUser',users[indexNum].name);
			}
	});
	

	socket.on('sendScore',function(data){

	console.log("why am I being called?"+data);

		for(var i = 0; i<users.length; i++){

			if(users[i].name === data.user){
				users[i].score = data.score;
				//indexNum++;
			} 

		}
		io.sockets.emit('setScore',data);
	});

	socket.on('disconnect', function() {

		for(var i =0; i<users.length; i++){

				if(users[i].s_id === socket.id){
					console.log("server wrong");
					socket.broadcast.emit('kill',users[i].name);
					users.splice(i);
			}
		}

		//var spliced = users.splice(users.indexOf(socket.id));
		console.log("Client has disconnected");
	});

 
});

