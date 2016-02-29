function Plotter(width, height) {
  this.enable = true;
  this.sample = [];
  this.canvas = document.getElementById("canvas");
  this.canvas.width = width;
  this.canvas.height = height;
  this.ctx = canvas.getContext("2d");
  this.ctx.lineWidth = 1;
  this.lastX = 0;
  this.lastY = 0;
  this.lastZ = 0;
  this.lastT = 0;
  this.i = 0;
  this.initComponents();
}

Plotter.prototype.initComponents = function() {
  var self = this; 
  console.log(document.getElementById("protter-enable"))
  document.getElementById("protter-enable").addEventListener("click", function() {
    self.enable = !self.enable;
  });
};

Plotter.prototype.notify = function(buffer) {
  if (this.enable) {
    for (var i = 0; i < buffer.length; i++) {
      if (this.sample.length == 11) {
        this.plotSample();
        this.sample = [];
      }
      this.sample.push(buffer[i]);
    }
  }
}

Plotter.prototype.plotSample = function() {
  var decodedSample = this.decodeRawSample();
  if (decodedSample != null) {
    if (this.i > 1000) {
      var imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.putImageData(imageData, -1, 0);
    } else {
      this.i++;
    }
    this.plotX(decodedSample.x);
    this.plotY(decodedSample.y);
    this.plotZ(decodedSample.z);
    this.plotE(decodedSample.e);
    this.plotT(decodedSample.t);
    this.plotLine();
  }
};

Plotter.prototype.decodeRawSample = function() {
  var x = ((this.sample[0] << 8) & 0xff00) | (this.sample[1] & 0xff);
  var y = ((this.sample[2] << 8) & 0xff00) | (this.sample[3] & 0xff);
  var z = ((this.sample[4] << 8) & 0xff00) | (this.sample[5] & 0xff);
  var e = this.sample[6];
  var t = ((this.sample[10] << 24) & 0xff000000) | ((this.sample[9] << 16) & 0xff0000) | ((this.sample[8] << 8) & 0xff00) | (this.sample[7] & 0xff);
  return {x: toSigned(x, 16), y: toSigned(y, 16), z: toSigned(z, 16), e: e, t: t};
}

Plotter.prototype.normalize = function (y) {
  return (this.canvas.height - ((y + 32768) * (this.canvas.height/65535)));
}

Plotter.prototype.plotX = function(x) {
  this.ctx.beginPath();
  this.ctx.moveTo(this.i - 1, this.normalize(this.lastX));
  this.ctx.lineTo(this.i, this.normalize(x));
  this.ctx.strokeStyle = '#ff0000';
  this.ctx.stroke();
  this.lastX = x;
}

Plotter.prototype.plotY = function(y) {
  this.ctx.beginPath();
  this.ctx.moveTo(this.i - 1, this.normalize(this.lastY));
  this.ctx.lineTo(this.i, this.normalize(y));
  this.ctx.strokeStyle = '#00ff00';
  this.ctx.stroke();
  this.lastY = y;
}

Plotter.prototype.plotLine = function() {
  this.ctx.beginPath();
  this.ctx.moveTo(this.i - 1, this.canvas.height/2);
  this.ctx.lineTo(this.i, this.canvas.height/2);
  this.ctx.strokeStyle = '#ffffff';
  this.ctx.stroke();
}

Plotter.prototype.plotZ = function(z) {
  this.ctx.beginPath();
  this.ctx.moveTo(this.i - 1, this.normalize(this.lastZ));
  this.ctx.lineTo(this.i, this.normalize(z));
  this.ctx.strokeStyle = '#0000ff';
  this.ctx.stroke();
  this.lastZ = z;
}

Plotter.prototype.plotT = function(t) {
  if (Math.ceil(t/1000) > this.lastT) {
    this.ctx.strokeStyle = '#666666';
    this.ctx.beginPath();
    this.ctx.moveTo(this.i, 0);
    this.ctx.lineTo(this.i, 100);
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.moveTo(this.i, this.canvas.height - 100);
    this.ctx.lineTo(this.i, this.canvas.height);
    this.ctx.stroke();
    this.lastT = Math.ceil(t/1000);
  }
}

Plotter.prototype.plotE = function(e) {
  if (e > 0) {
    this.ctx.beginPath();
    this.ctx.moveTo(this.i, 100);
    this.ctx.lineTo(this.i, this.canvas.height - 100);
    this.ctx.strokeStyle = '#ffffff';
    this.ctx.stroke();
  }
}
