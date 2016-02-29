function bufferToArrayBuffer(buffer) {
  var buf = new ArrayBuffer(buffer.length);
  var bufView = new Uint8Array(buf);
  for (var i = 0; i < buffer.length; i++) {
    bufView[i] = buffer[i];
  }
  return buf;
}

function stringToArrayBuffer(string) {
  var buf = new ArrayBuffer(string.length);
  var bufView = new Uint8Array(buf);
  for (var i = 0; i < string.length; i++) {
    bufView[i] = string.charCodeAt(i);
  }
  return buf;
}

function toSigned(n, len) {
  if (n > Math.pow(2, len - 1)) {
    n -= Math.pow(2, len) 
  }
  return n;
}

