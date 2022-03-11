var autoScrollInput;
var statusText;
var port;
var connectButton;
var portsSelect;
var baudrateSelect;
var sendButton;
var outputTextArea;
var inputText;
var monitor;
var previousPaths;
var lineEndingSelect;

function initComponents() {
    autoScrollInput = document.getElementById("auto-scroll");
    statusText = document.getElementById("status");
    sendButton = document.getElementById("send");
    outputTextArea = document.getElementById("output");
    inputText = document.getElementById("input");
    portsSelect = document.getElementById("ports");
    baudrateSelect = document.getElementById("baudrate");
    connectButton = document.getElementById("connect");
    lineEndingSelect = document.getElementById("line-ending");
    monitor = new Monitor();
}

function listPorts(ports) {
    portsSelect.innerHTML = "";
    var options = portsSelect.options;
    ports.map(function (p) {
        options[options.length] = new Option(p.path, p.path, false, (port && port.isConnected() && port.getPath() === p));
    });
}

function connect(path, baudrate) {
    if (port && port.isConnected()) {
        port.disconnect();
    } else {
        outputTextArea.innerHTML = "";
        port = new SerialPort(path, {
            bitrate: parseInt(baudrate), ctsFlowControl: true, persistent: true,
        });
        port.addEventListener(SerialPort.EVENT.STATE_CHANGE, {notify: notify});
        port.addEventListener(SerialPort.EVENT.DATA_AVAILABLE, monitor);
        port.connect();
    }
}

function notify(newState) {
    statusText.innerHTML = port.stateMessage();
    if (newState === SerialPort.STATE.CONNECTED) {
        connectButton.innerHTML = "Disconnect";
    } else {
        connectButton.innerHTML = "Connect";
    }
}

function getEndingLine() {
    const option = lineEndingSelect.options[lineEndingSelect.selectedIndex].value;
    return {
        "NONE": "", "NL": "\n", "CR": "\r", "BOTH": "\n\r"
    }[option];
}

function send() {
    if (port && port.isConnected()) {
        port.writeString(inputText.value + getEndingLine());
        inputText.value = "";
    }
}

function attachEvents() {
    connectButton.addEventListener("click", function () {
        try {
            var port = portsSelect.options[portsSelect.selectedIndex].value;
            var baudrate = baudrateSelect.options[baudrateSelect.selectedIndex].value;
            connect(port, baudrate);
        } catch (e) {
            statusText.innerHTML = "No port to connect. " + e;
        }
    });
    sendButton.addEventListener("click", function () {
        send();
    });
    inputText.addEventListener("keypress", function (e) {
        if (e.which === 13) {
            send();
        }
    });
    autoScrollInput.addEventListener("click", function () {
        if (monitor) {
            monitor.invertAutoScroll();
        }
    });
}

function extractPaths(ports) {
    var paths = [];
    ports.map(function (port) {
        paths.push(port.path);
    });
    return paths;
}

window.addEventListener("load", function () {
    if (typeof chrome != "undefined" && chrome.serial) {
        initComponents();
        attachEvents();
        setInterval(function () {
            chrome.serial.getDevices(function (ports) {
                var paths = extractPaths(ports);
                if (port && port.isConnected() && paths.indexOf(port.getPath()) < 0) {
                    port.disconnect();
                }
                if (!areArraysEqual(previousPaths, paths)) {
                    listPorts(ports);
                    previousPaths = paths;
                }
            });
        }, 1000);
    }
}, false);
