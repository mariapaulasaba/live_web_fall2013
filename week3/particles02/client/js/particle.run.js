//"use strict";

var maxParticles = 20000,
  particleSize = 1,
  emissionRate = 20,
  objectSize = 3; // drawSize of emitter/field

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var particles = []; 

var midX = canvas.width / 2;
var midY = canvas.height / 2; 

var connected = false;

// Add one emitter located at `{ x : 100, y : 230}` from the origin (top left)
// that emits at a velocity of `2` shooting out from the right (angle `0`)
//var emitters = [new Emitter(new Vector(midX - 150, midY), Vector.fromAngle(0, 2))];
var emitters = [];

// Add one field located at `{ x : 400, y : 230}` (to the right of our emitter)
// that repels with a force of `140`
var fields = [new Field(new Vector(midX + 150, midY), -140)];

function addNewParticles() {
  // if we're at our max, stop emitting.
  if (particles.length > maxParticles) return;

  // for each emitter
  for (var i = 0; i < emitters.length; i++) {

    // emit [emissionRate] particles and store them in our particles array
    for (var j = 0; j < emissionRate; j++) {
      particles.push(emitters[i].emitParticle());
    }

  }
}

function plotParticles(boundsX, boundsY) {
  // a new array to hold particles within our bounds
  var currentParticles = [];

  for (var i = 0; i < particles.length; i++) {
    var particle = particles[i];
    var pos = particle.position;

    // If we're out of bounds, drop this particle and move on to the next
    if (pos.x < 0 || pos.x > boundsX || pos.y < 0 || pos.y > boundsY) continue;

    // Update velocities and accelerations to account for the fields
    particle.submitToFields(fields);

    // Move our particles
    particle.move();

    // Add this particle to the list of current particles
    currentParticles.push(particle);
  }

  // Update our global particles reference
  particles = currentParticles;
}

function drawParticles() {
  ctx.fillStyle = 'rgb(0,0,255)';
  for (var i = 0; i < particles.length; i++) {
    var position = particles[i].position;
    ctx.fillRect(position.x, position.y, particleSize, particleSize);
  }
}

function drawCircle(object) {
  ctx.fillStyle = object.drawColor;
  ctx.beginPath();
  ctx.arc(object.position.x, object.position.y, objectSize, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();
}

 
function createEmitter(x,y, id, angle){
	var posX = x || Math.max(20, Math.random()*canvas.width);
	var posY = y || Math.max(20, Math.random()*canvas.height)
	var _id = id || "client_" + posX + "_" + posY + "_" + Math.floor(Math.random()*1000);
	angle = angle || Math.random()*360;
  var emitter = new Emitter(new Vector(posX, posY), Vector.fromAngle(angle, 2), _id);
	emitters.push(emitter);

	return {x: posX, y: posY, id:_id, angle:angle}; 

}

function changePosition(x,y,id){
  for(var i = 0; i<emitters.length; i++){
    
    if(emitters[i].id === id){
      emitters.setPosition(x, y);
      return;
    }
  }


}


function destroyEmitter(id){
	for(var i = 0; i<emitters.length; i++){
		
		if(emitters[i].id === id){
			emitters.splice(i, 1);
			return;
		}
	}
}



function loop() {
  clear();
  update();
  draw();
  queue();
}

function clear() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function update() {
  addNewParticles();
  plotParticles(canvas.width, canvas.height);
}

function draw() {
  drawParticles();

  //desenha o circulo dos fields e emitters.
  fields.forEach(drawCircle);
  emitters.forEach(drawCircle);

}

function queue() {
  window.requestAnimationFrame(loop);
}

loop();



function getMousePosition(canvas, event) {
	var rect = canvas.getBoundingClientRect();
	return {
		x: event.clientX - rect.left,
		y: event.clientY - rect.top
	};
}

canvas.addEventListener('mousemove', function(evt) {
	var mousePos = getMousePosition(canvas, evt);
	//emitters[0].setPosition(mousePos.x, mousePos.y);
	//fields[0].setPosition(mousePos.x, mousePos.y);
  if(connected){
  emitters[myEmitter.id].setPosition(mousePos.x, mousePos.y);
  sendmouse(mousePos.x, mousePos.y, myEmitter.id); 
  } 


}, false);



