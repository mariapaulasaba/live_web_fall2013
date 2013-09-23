function Particle(point, velocity, acceleration) {
		  this.position = point || new Vector(0, 0);
		  this.velocity = velocity || new Vector(0, 0);
		  this.acceleration = acceleration || new Vector(0, 0);
		}

Particle.prototype.submitToFields = function (fields) {
  // our starting acceleration this frame
  var totalAccelerationX = 0;
  var totalAccelerationY = 0;

  // for each passed field
  for (var i = 0; i < fields.length; i++) {
    var field = fields[i];

    // find the distance between the particle and the field
    var vectorX = field.position.x - this.position.x;
    var vectorY = field.position.y - this.position.y;

    // calculate the force via MAGIC and HIGH SCHOOL SCIENCE!
    var force = field.mass / Math.pow(vectorX*vectorX+vectorY*vectorY,1.5);

    // add to the total acceleration the force adjusted by distance
    totalAccelerationX += vectorX * force;
    totalAccelerationY += vectorY * force;
  }

  // update our particle's acceleration
  this.acceleration = new Vector(totalAccelerationX, totalAccelerationY);
};

Particle.prototype.move = function () {
  this.velocity.add(this.acceleration);
  this.position.add(this.velocity);
};


function Field(point, mass) {
  this.position = point;
  this.setMass(mass);
}

Field.prototype.setMass = function(mass) {
  this.mass = mass || 100;
  this.drawColor = mass < 0 ? "#f00" : "#0f0";
}

Field.prototype.setPosition = function(x,y){
	this.position = new Vector(x,y);
}

function Vector(x, y) {
  this.x = x || 0;
  this.y = y || 0;
}

Vector.prototype.add = function(vector) {
  this.x += vector.x;
  this.y += vector.y;
}

Vector.prototype.getMagnitude = function () {
  return Math.sqrt(this.x * this.x + this.y * this.y);
};

Vector.prototype.getAngle = function () {
  return Math.atan2(this.y,this.x);
};

Vector.fromAngle = function (angle, magnitude) {
  return new Vector(magnitude * Math.cos(angle), magnitude * Math.sin(angle));
};

function Emitter(point, velocity, id, spread) {
  this.position = point; // Vector
  this.velocity = velocity; // Vector
  this.spread = spread || Math.PI / 32; // possible angles = velocity +/- spread
  this.drawColor = "#999"; // So we can tell them apart from Fields later
  this.id = id;
}
Emitter.prototype.setPosition = function(x, y){
	this.position.x = x;
	this.position.y = y;
}

Emitter.prototype.emitParticle = function() {
  // Use an angle randomized over the spread so we have more of a "spray"
  var angle = this.velocity.getAngle() + this.spread - (Math.random() * this.spread * 2);

  // The magnitude of the emitter's velocity
  var magnitude = this.velocity.getMagnitude();

  // The emitter's position
  var position = new Vector(this.position.x, this.position.y);

  // New velocity based off of the calculated angle and magnitude
  var velocity = Vector.fromAngle(angle, magnitude);

  // return our new Particle!
  return new Particle(position,velocity);
};
