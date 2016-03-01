var autoscrollInput;
var statusText;
var serialPort;
var connectButton;
var portsSelect;
var baudrateSelect;
var sendButton;
var outputTextArea;
var inputText;
var dumpper;
var previousPorts;
var lineEndingSelect;

function initComponents() {
  autoscrollInput = document.getElementById("autoscroll");
  statusText = document.getElementById("status");
  sendButton = document.getElementById("send");
  outputTextArea = document.getElementById("output");
  inputText = document.getElementById("input");
  portsSelect = document.getElementById("ports");
  baudrateSelect = document.getElementById("baudrate");
  connectButton = document.getElementById("connect");
  lineEndingSelect = document.getElementById("line-ending");
  dumpper = new Dumpper();
}

function listPorts(ports) {
  portsSelect.innerHTML = "";
  var options = portsSelect.options;
  ports.map(function(port) {
    options[options.length] = new Option(port, port, false, (serialPort && serialPort.isConnected() && serialPort.path == port));
  });
};

function connect(port, baudrate) {
  if (serialPort && serialPort.isConnected()) {
    serialPort.disconnect();
  } else {
    serialPort = new SerialPort(port, {bitrate: parseInt(baudrate), ctsFlowControl: true});
    serialPort.addEventListener(SerialPort.EVENT.STATE_CHANGE, {notify: notify});
    serialPort.addEventListener(SerialPort.EVENT.DATA_AVAILABLE, dumpper);
    serialPort.connect();
  }
}

function notify(newState) {
  statusText.innerHTML = serialPort.stateMessage();
  if (newState == SerialPort.STATE.CONNECTED) {
    connectButton.innerHTML = "Dicsonnect";
  } else {
    connectButton.innerHTML = "Connect";
  }
}

function send() {
  if (serialPort && serialPort.isConnected()) {
    serialPort.writeString(inputText.value + lineEndingSelect.options[lineEndingSelect.selectedIndex].value);
    inputText.value = "";
  }
}

function attachEvents() {
  connectButton.addEventListener("click", function() {
    try {
      var port = portsSelect.options[portsSelect.selectedIndex].value;
      var baudrate = baudrateSelect.options[baudrateSelect.selectedIndex].value;
      connect(port, baudrate);
    } catch(e) {
      statusText.innerHTML = "No port to connect.";
    }
  });
  sendButton.addEventListener("click", function() {
    send();
  });
  inputText.addEventListener("keypress", function(e) {
    if (e.which == 13) {
      send();
    }
  });
  autoscrollInput.addEventListener("click", function() {
    if (dumpper) {
      dumpper.invertAutoscroll();
    }
  });
}

function extractPaths(ports) {
  var paths = [];
  ports.map(function(port) {
    paths.push(port.path);
  });
  return paths;
}

window.addEventListener("load", function() {
  if (typeof chrome != "undefined" && chrome.serial) {
    initComponents();
    attachEvents();
    setInterval(function() {
      chrome.serial.getDevices(function(ports) {
        ports = extractPaths(ports);
        if (serialPort && serialPort.isConnected() && ports.indexOf(serialPort.path) < 0) {
          serialPort.disconnect();
        }
        if (!areArraysEqual(previousPorts, ports)) {
          listPorts(ports);
          previousPorts = ports;
        }
      });
    }, 1000);
  }
}, false);
