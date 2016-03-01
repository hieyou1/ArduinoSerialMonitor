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

function areArraysEqual(a0, a1) {
  return JSON.stringify(a0) == JSON.stringify(a1);
}
