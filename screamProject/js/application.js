
			var gainNode = null;
			var frequencies = null;
			var analyser = null;
			var volumeDegree = 0;
			var volume = 0;
			var images = [];


					
			var init = function() {
				console.log("init");
				
				// These help with cross-browser functionality
				window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
				navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
				navigator.getUserMedia({audio: true}, webRTCInit, function(error) {alert(error);});

				for(var i = 1; i < 7; i++){
					var imageObj = new Image(); // new instance for each image
    				imageObj.src = "img/"+i+".jpg";
    				images.push(imageObj);
    				console.log(imageObj);
				}
				
			};
			
			var webRTCInit = function(stream) {
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
		