
			var gainNode = null;
			var frequencies = null;
			var analyser = null;
			var volumeDegree = 0;
		
					
			var init = function() {
				console.log("init");
				
				// These help with cross-browser functionality
				window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
				navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
				navigator.getUserMedia({audio: true}, webRTCInit, function(error) {alert(error);});
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
				
				for (var i = 0; i < frequencies.length; i++)
				{
					console.log(frequencies[i]);
				}
				window.requestAnimationFrame(animate);
			};


			var animate = function() {
				
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
				var volume = volumeDegree/2;
				var volumeSt = volume +"%"
				bar.style.width = volumeSt;

				//now, let's draw the character
				var mycanvas = document.getElementById('character');
				var mycontextCanvas = mycanvas.getContext('2d');
				mycanvas.width = 580;
				mycanvas.height = 420;


				mycontextCanvas.clearRect(0,0,mycanvas.width, mycanvas.height);

				var img=document.getElementById('4');

				 if(volume < 20){
				 img=document.getElementById('4');
				 }
				 else if(volume >= 20 && volume < 40){
				 img=document.getElementById('3');
				 }
				else if(volume >= 40 && volume < 60){
				img=document.getElementById('2');
				}
				else if(volume >= 60 && volume < 80){
				img=document.getElementById('1');
			 }

				mycontextCanvas.drawImage(img, mycanvas.width/2-50, mycanvas.height/2-50);
				window.requestAnimationFrame(animate);	

			};
			
			window.addEventListener('load', init, false);
		