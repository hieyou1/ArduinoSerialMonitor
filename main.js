var statusText, serialPort, connectButton, portsSelect, baudrateSelect, sendButton, outputTextArea, inputText;

function initComponents() {
  statusText = document.getElementById("status");
  sendButton = document.getElementById("send");
  outputTextArea = document.getElementById("output");
  inputText = document.getElementById("input");
  portsSelect = document.getElementById("ports");
  baudrateSelect = document.getElementById("baudrate");
  connectButton = document.getElementById("connect");
}

function listPorts(ports) {
  var options = portsSelect.options;
  ports.map(function(port) {
    options[options.length] = new Option(port.path, port.path);
  });
};

function connect(port, baudrate) {
  if (serialPort && serialPort.isConnected()) {
    serialPort.disconnect();
  } else {
    serialPort = new SerialPort(port, {bitrate: parseInt(baudrate), ctsFlowControl: true});
    serialPort.addEventListener(SerialPort.EVENT.STATE_CHANGE, {notify: notify});
    serialPort.addEventListener(SerialPort.EVENT.DATA_AVAILABLE, new Plotter(1200, 400));
    serialPort.addEventListener(SerialPort.EVENT.DATA_AVAILABLE, new Dumpper());
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
  if (serialPort.isConnected()) {
    serialPort.writeString(inputText.value + "\n");
    inputText.value = "";
  }
}

function attachEvents() {
  connectButton.addEventListener('click', function() {
    var port = portsSelect.options[portsSelect.selectedIndex].value;
    var baudrate = baudrateSelect.options[baudrateSelect.selectedIndex].value;
    connect(port, baudrate);
  });
  sendButton.addEventListener('click', function() {
    send();
  });
  input.addEventListener('keypress', function(e) {
    if (e.which == 13) {
      send();
    }
  });
}

if (typeof chrome != "undefined" && chrome.serial) {
  chrome.serial.getDevices(function(ports) {
    initComponents();
    listPorts(ports);
    attachEvents();
  });
}
