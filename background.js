chrome.app.runtime.onLaunched.addListener(function () {
    chrome.app.window.create('index.html', {
        bounds: {
            width: 820,
            height: 600,
            left: 100,
            top: 100
        },
        minWidth: 800,
        minHeight: 600
    });
});

chrome.runtime.onSuspend.addListener(function () {
});

chrome.runtime.onInstalled.addListener(function () {
});
