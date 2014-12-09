			//my part
			var myaudio = null;
			var mystream = null;
			var mypeerid = null;
			var peer = null;
			//katie part	

			var gainNode = null;
			var frequencies = null;
			var analyser = null;
			var volume= 0;
			var volumeDegree = 0;
			var score = 0;
			var recording = false;
			var started = null;
			var screamerID = 0;
			var images = [];


			var currentUser = null;
			var clientUserName = null;

			var allUserArr = null;

					
			var init = function() {
				console.log("init");
				myaudio = document.getElementById('myaudio');
				// These help with cross-browser functionality
				window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
				navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
				navigator.getUserMedia({audio: true}, webRTCInit, function(error) {alert(error);});

				for(var i = 1; i < 7; i++){
					var imageObj = new Image(); // new instance for each image
    				imageObj.src = "http://itp.nyu.edu/~hj657/liveweb/img/"+i+".jpg";
    				images.push(imageObj);
    				console.log(imageObj);
				}

				peer = new Peer({key:'uohu08l7r6swcdi'});
				
				peer.on('open', function(id) {
				  console.log('My peer ID is: ' + id);
				  mypeerid = id;
				});

				peer.on('call', function(call) {
					
					enableMic();
					myaudio.muted = true;

					call.answer(mystream);
					call.on('stream', function(remoteStream) {
				      
				      		console.log("got call");
				    });					
				});

			};

			//all the peer go to here

			var placecall = function(anotherPeerId) {				
					var call = peer.call(anotherPeerId, mystream);
						call.on('stream', function(remoteStream) {
						// Show stream in some video/canvas element.
						
							myaudio.src = window.URL.createObjectURL(remoteStream) || remoteStream;
							myaudio.play();
					});

					muteMic();
					myaudio.muted = false;
			};

	/*socket part*/

			var otherUsers = new Array();
			

			var socket = io.connect('http://ec2-54-200-31-212.us-west-2.compute.amazonaws.com:8080/');
			


			socket.on('connect', function() {
				console.log("Connected");
			});

			// Receive a call to place
			socket.on('requestBroadcast', function(data) {
				console.log("Got: " + data);
				placecall(data);
			});

			///**when disconnected
			socket.on('kill',function(data){
				//console.log("clinet wrong");
				var removeDiv = document.getElementById(data);
				removeDiv.parentNode.removeChild(removeDiv);
			});
			
			//get score from server and replace html
			
			socket.on('setScore',function(data){
			
			console.log("lets judge people, score function" + data.user);
			var lis = document.getElementsByTagName("li");
			
				for(var i = 0; i<lis.length; i++){
					if(lis[i].id == data.user){
						console.log("user to give score");
						lis[i].innerHTML = data.user +" : "+data.score;
					}
				}
			
			
			});


			//This part is related with css!!! 

			socket.on('setUser',function(data){


				 if(clientUserName === data){
					///enable the GO button
						console.log("current user is " + data);
						document.getElementById('gobtn').style.display = 'block';
						currentUser = data;
						
				 }else{
		 				document.getElementById('gobtn').style.display = 'none';
		 			
				 };
				 	//why doesn't first user change the color? 
					var lis = document.getElementsByTagName("li");
					
					for(var i = 0; i<lis.length; i++){
						if(lis[i].id == data){
							console.log("hello I am user I will change color");
							lis[i].style.color = "#ff0000";
						}else{
							lis[i].style.color = "#ffffff";
						}
					
					}

			});
			
			
			socket.on('gameOver',function(data){
			
				console.log("winner : " + data.winner +"  score : "+data.score);
				
					var scoreli = document.createElement("li");
				 	scoreli.id = "scoreResult";
				 	scoreli.className= "user";
				 	scoreli.innerHTML = "GameOver <br>" + data.winner + "<br>"+data.score;
				 	document.getElementById("userlist").appendChild(scoreli);
			});





			//recieve users info, push new user, delete all boxes and create again
			socket.on('getAllUsers',function(data){
			
				console.log("hi");
				console.log(data.length);

				allUserArr = data;
			//	console.log(userNum);
				var arr = document.getElementsByClassName("user");


				if(arr.length>0){

					for(var i=0; i<data.length-1; i++){
						
							var removeDiv= document.getElementById(data[i].name);
							removeDiv.parentNode.removeChild(removeDiv);
						
					}
				}

			for(var i=0; i<data.length; i++){

				 	var userli = document.createElement("li");
				 	userli.id = data[i].name;
				 	userli.className= "user";
				 	userli.innerHTML = data[i].name;
				 	document.getElementById("userlist").appendChild(userli);
				}

			});
			


			//Debugging
			
			var startGame = function(){
				console.log("let's start game");
				requestBroadcast();

			}
			var requestBroadcast = function(){
				console.log("I am gonna play the role : "+ mypeerid);
				socket.emit('requestBroadcast',mypeerid);
			};

			
			
			//send user name with peer id

			var sendPeerId = function(){
				//console.log("I am sedning my peer id now : "+ mypeerid);

				var username = document.getElementById('username').value;
				clientUserName = username;
				//console.log(clientUserName);
				hideJoinBtn();
				
				
				socket.emit('peerevent',username+","+mypeerid);
			};
			
			
			var hideJoinBtn = function(){
					document.getElementById('username').style.display = "none";
					document.getElementById('joinbtn').style.display = "none";
			
			}



			//just mic part. 
			//mic should be muted after its term
			//should be on when its term.

			function muteMic() { // stream is your local WebRTC stream
				console.log("mic muted");
 				 var audioTracks = mystream.getAudioTracks();
  				for (var i = 0, l = audioTracks.length; i < l; i++) {
 				   audioTracks[i].enabled = false;//!audioTracks[i].enabled;
 				 }
			}

			function enableMic() { // stream is your local WebRTC stream
				console.log("mic enabled");
 				 var audioTracks = mystream.getAudioTracks();
  				for (var i = 0, l = audioTracks.length; i < l; i++) {
 				   audioTracks[i].enabled = true;//!audioTracks[i].enabled;
 				 }
			}

			//webRTC part
			//audio src =>should be from peer call
			
			var webRTCInit = function(stream) {

				//get my stream as audio source, not sure this part is needed
				mystream = stream;
				myaudio.src = window.URL.createObjectURL(stream) || stream;
				
				// Fixes prefix issues

			    window.AudioContext = window.AudioContext||window.webkitAudioContext;
			
				// The context is the base for the API.
				var audioContext = new AudioContext();
			
				gainNode = audioContext.createGain();
				gainNode.gain.value = .1;
						
				// We can load an audio file by using an audio tag
				//var audiotoload = document.getElementById("audiotoplay");	
				//var audioSource = audioContext.createMediaElementSource(audiotoload);
				var audioSource = audioContext.createMediaStreamSource(stream);
				
				// To simply play it, we can connect it to the "destination" or default output of the context
				audioSource.connect(gainNode); // Connect to the default output
				gainNode.connect(audioContext.destination);
				//audiotoload.play();	
				
				// FFT
				analyser = (analyser || audioContext.createAnalyser());
				audioSource.connect(analyser);
				frequencies = new Uint8Array(analyser.frequencyBinCount);
				analyser.getByteFrequencyData(frequencies);

				animate();
			};

			var recordMe = function(){
				recording = true;
				console.log("here");
				started = Date.now();

			};

			var drawGraph = function(){

				//first, let's draw the graph
				analyser.getByteFrequencyData(frequencies);
				var graph = document.getElementById('graph');
				var mycontextGraph = graph.getContext('2d');
				mycontextGraph.fillStyle = "#00ff00";
				mycontextGraph.clearRect(0,0,graph.width, graph.height);
				
				for (var i = 0; i < frequencies.length; i++)
				{
					mycontextGraph.fillRect(i,graph.height/2-frequencies[i]/2, 2, frequencies[i]);	
					volumeDegree+=frequencies[i];
					//console.log(frequencies[i]);
				}	
				volumeDegree /= frequencies.length;

				//this is for changing the progress bar according to volume
				var bar = document.getElementById('volumeValue');
				volume = volumeDegree/2;
				var volumeSt = volume +"%"
				bar.style.width = volumeSt;

				//record volume score, has to be here because of animation loop
				if (recording == true){
						console.log("recording function is being called");
					if(volume >=20){
						score+=1;
						
						console.log(score);
						}
				
					if (Date.now() - started > 4000) {
	
						muteMic();
						console.log("I am being called"+recording);
						//startGame();
						//send scream score
						socket.emit('sendScore', {user:clientUserName,
													score:score});
						//say that go to next user
						socket.emit('readyForGame');
			
						recording = false;
						muteMic();
						
					}
				}
			};
	

			var pumpkin = function() {
				
			
				//now, let's draw the character
				var mycanvas = document.getElementById('character');
				var mycontextCanvas = mycanvas.getContext('2d');
				mycanvas.width = 580;
				mycanvas.height = 420;
				mycontextCanvas.clearRect(0,0,mycanvas.width, mycanvas.height);

				var range = [{min:0, max:10, frame:"1"}, 
				{min:10, max:20, frame:"2"}, {min:20, max:40, frame:"3"},
				{min:40, max:60, frame:"4"}, {min:60, max:80, frame:"5"},				
				{min:80, max:10000, frame:"6"}];

				var img;
				for(var i = 0; i < range.length; i++){
				var item = range[i];
				if(volume >= item.min && volume < item.max){
					img = i;
					break;
					}
				else{
					img = range.length-1;
				}
				}

				mycontextCanvas.drawImage(images[img], 0, 0);



			};

			var animate = function(){
				drawGraph();
				pumpkin();
				window.requestAnimationFrame(animate);	
			};
			

			window.addEventListener('load', init, false);
		