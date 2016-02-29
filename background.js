chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('index.html', {
    bounds: {
      width: 1220,
      height: 800,
      left: 100,
      top: 100
    },
    minWidth: 1220,
    minHeight: 800,
    maxWidth: 1220,
    maxHeight: 800
  });
});

chrome.runtime.onSuspend.addListener(function() { 
});

chrome.runtime.onInstalled.addListener(function() { 
});
