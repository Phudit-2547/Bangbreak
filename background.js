function start(msg) {
  const { timer, action, customUrl, color, enableAnimation, isAuto } = msg;

  if (timeoutId) clearTimeout(timeoutId);

  // Save state
  chrome.storage.local.set({
    isRunning: true,
    action,
    customUrl,
    color,
  });

  let timeoutId = setTimeout(() => {
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
          if (window.state == "fullscreen") {
            chrome.windows.update(window.id, { state: oldwindowstatus });
          } else {
            oldwindowstatus = window.state;
            chrome.windows.update(window.id, { state: "fullscreen" });
          }
        });
      });
    });

    timeoutId = null;
    chrome.storage.local.set({ isRunning: false });
    if (isAuto == true) start(msg)
  }, timer * 1000);
}

function cancel() {
  if (timeoutId) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }
  chrome.storage.local.set({ isRunning: false });
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  switch (msg.command) {
    case "start":
      start(msg);
      break;
    case "cancel":
      cancel();
      break;
  }
});

chrome.runtime.onStartup.addListener(() => {
  let msg = {
    command: "start",
    timer: 10,
    action: "blank",
    customUrl: "https://example.com",
    color: "#ff0000",
    enableAnimation: true,
    isAuto: true
  }
  start(msg);
})


chrome.runtime.onInstalled.addListener(() => {
  let msg = {
    command: "start",
    timer: 10,
    action: "blank",
    customUrl: "https://example.com",
    color: "#ff0000",
    enableAnimation: true,
    isAuto: true
  }
  start(msg)
})
