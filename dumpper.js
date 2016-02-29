function Dumpper() {
  this.autoscroll = false;
  this.output = document.getElementById("output");
}

Dumpper.prototype.notify = function(buffer) {
  this.output.innerHTML += String.fromCharCode.apply(null, new Uint16Array(buffer));
  if (this.autoscroll) {
    this.output.scrollTop = this.output.scrollHeight;
  }
};

Dumpper.prototype.invertAutoscroll = function() {
  this.autoscroll = !this.autoscroll;
}
