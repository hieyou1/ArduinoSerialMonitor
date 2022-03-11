var EventNotifier = function () {
    this.listeners = {};
};

EventNotifier.prototype.clear = function () {
    this.listeners = {};
};

EventNotifier.prototype.addEventListener = function (event, listener) {
    if (!this.listeners[event]) {
        this.listeners[event] = [];
    }
    this.listeners[event].push(listener);
};

EventNotifier.prototype.notifyEvent = function (event, notification) {
    var listeners = this.listeners[event];
    console.log("this.listeners: ", this.listeners)
    if (listeners != null) {
        listeners.map(function (listener) {
            listener.notify(notification);
        });
    }
};

