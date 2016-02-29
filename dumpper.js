function Dumpper() {
  this.enable = true;
  this.initComponents();
}

Dumpper.prototype.initComponents = function() {
  var self = this;
  this.output = document.getElementById("output");  
  document.getElementById("dumpper-enable").addEventListener("click", function() {
    self.enable = !self.enable;
  });
};

Dumpper.prototype.notify = function(buffer) {
  if (this.enable) {
    this.output.innerHTML += String.fromCharCode.apply(null, new Uint16Array(buffer));
  }
};
