function Monitor() {
  this.autoScroll = true;
  this.output = document.getElementById("output");
}

Monitor.prototype.notify = function(buffer) {
  this.output.innerHTML += String.fromCharCode.apply(null, new Uint16Array(buffer));
  if (this.autoScroll) {
    this.output.scrollTop = this.output.scrollHeight;
  }
};

Monitor.prototype.invertAutoScroll = function() {
  this.autoScroll = !this.autoScroll;
};
