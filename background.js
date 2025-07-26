chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  switch (msg.command) {
    case "start":
      startManual(msg);
      break;
    case "cancel":
      cancel();
      break;
  }
});

chrome.runtime.onStartup.addListener(() => {
  startAuto()
})


chrome.runtime.onInstalled.addListener(() => {
  startAuto()
})

var timeoutId = null

function startManual(msg) {
  const { timer, action, customUrl, color, enableAnimation } = msg;

  if (timeoutId) clearTimeout(timeoutId);

  // Save state
  chrome.storage.local.set({
    isRunning: true,
    action,
    customUrl,
    color,
  });

  timeoutId = setTimeout(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (!tab || !tab.id) return;

      if (action === "blank") {
        const whiteUrl =
          chrome.runtime.getURL("white.html") +
          `?color=${encodeURIComponent(
            color || "#ffffff"
          )}&animation=${enableAnimation}`;
        chrome.tabs.update(tab.id, { url: whiteUrl });
      } else if (action === "custom" && customUrl) {
        chrome.tabs.update(tab.id, { url: customUrl });
      }
      chrome.windows.getAll({}, function (windows) {
        windows.forEach(function (window) {
          if (window.state != "fullscreen") {
            chrome.windows.update(window.id, { state: "fullscreen" });
          }
        });
      });
    });

    timeoutId = null;
    chrome.storage.local.set({ isRunning: false });
  }, timer * 1000);
}

function startAuto() {
  const { timer, action, customUrl, color, enableAnimation } = {
    timer: 150,
    action: "blank",
    customUrl: "https://example.com",
    color: "#ffffffff",
    enableAnimation: true
  };

  setInterval(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (!tab || !tab.id) return;

      const whiteUrl =
        chrome.runtime.getURL("white.html") +
        `?color=${encodeURIComponent(
          color || "#ffffff"
        )}&animation=${enableAnimation}`;

      chrome.tabs.update(tab.id, { url: whiteUrl });

      chrome.windows.getAll({}, function (windows) {
        windows.forEach(function (window) {
          if (window.state != "fullscreen") {
            chrome.windows.update(window.id, { state: "fullscreen" });
          }
        });
      });
    });
  }, timer * 1000);
}


function cancel() {
  if (timeoutId) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }
  chrome.storage.local.set({ isRunning: false });
}