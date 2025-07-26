let timeoutId = null;

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.command === "start") {
    const { timer, action, customUrl, color, enableAnimation } = msg;

    // Clear any existing alarms
    chrome.alarms.clear("bangbreakTimer");

    // Save state
    chrome.storage.local.set({
      isRunning: true,
      action,
      customUrl,
      color,
      enableAnimation
    });

    // Use Chrome alarms API for timers longer than 30 seconds
    if (timer > 30) {
      chrome.alarms.create("bangbreakTimer", {
        delayInMinutes: timer / 60 // Convert seconds to minutes
      });
    } else {
      // Use setTimeout for short timers (under 30 seconds)
      setTimeout(() => {
        executeTimer();
      }, timer * 1000);
    }
  }

  if (msg.command === "cancel") {
    chrome.alarms.clear("bangbreakTimer");
    chrome.storage.local.set({ isRunning: false });
  }
});

// Handle alarm events
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "bangbreakTimer") {
    executeTimer();
  }
});

// Common function to execute when timer expires
function executeTimer() {
  chrome.storage.local.get(['action', 'customUrl', 'color', 'enableAnimation'], (data) => {
    const { action, customUrl, color, enableAnimation } = data;

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (!tab || !tab.id) return;

      if (action === "blank") {
        const whiteUrl = chrome.runtime.getURL("white.html") + `?color=${encodeURIComponent(color || "#ffffff")}&animation=${enableAnimation}`;
        chrome.tabs.update(tab.id, { url: whiteUrl });
      } else if (action === "custom" && customUrl) {
        chrome.tabs.update(tab.id, { url: customUrl });
      }

      chrome.windows.getAll({}, function (windows) {
        windows.forEach(function (window) {
          if (window.state == "fullscreen") {
            chrome.windows.update(window.id, { state: "normal" });
          } else {
            chrome.windows.update(window.id, { state: "fullscreen" });
          }
        });
      });
    });

    chrome.storage.local.set({ isRunning: false });
  });
}
