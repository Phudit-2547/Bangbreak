chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  switch (msg.command) {
    case "start":
      const { timer, action, customUrl, color, enableAnimation } = msg;

      // Clear any existing alarms and timeouts
      chrome.alarms.clear("bangbreakTimer");
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }

      // Save state
      chrome.storage.local.set({
        isRunning: true,
        action,
        customUrl,
        color,
        enableAnimation
      });

      // Use Chrome alarms API for timers longer than 1 minute (Chrome limitation)
      if (timer >= 60) {
        chrome.alarms.create("bangbreakTimer", {
          delayInMinutes: timer / 60 // Convert seconds to minutes
        });
      } else {
        // Use setTimeout for short timers (under 1 minute)
        timeoutId = setTimeout(() => {
          executeTimer();
        }, timer * 1000);
      }
      break;
    case "cancel":
      cancel();
      break;
  }
});

// Listen for alarm events
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "bangbreakTimer") {
    executeTimer();
  }
});


chrome.runtime.onStartup.addListener(() => {
  chrome.alarms.create("bangbreakTimerAuto", {
    delayInMinutes: 1 // Minutes
  });
});

// chrome.runtime.onInstalled.addListener(() => {
//   chrome.alarms.create("bangbreakTimerAuto", {
//     delayInMinutes: 1 // Minutes
//   });
// });

// Listen for alarm events
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "bangbreakTimerAuto") {
    executeTimerAuto();
  }
});

var timeoutId = null

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
            chrome.windows.update(window.id, { state: "fullscreen" });
          }
        });
      });
    });

    chrome.storage.local.set({ isRunning: false });
  });
}

function executeTimerAuto() {
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
            chrome.windows.update(window.id, { state: "fullscreen" });
          }
        });
      });
    });

    chrome.storage.local.set({ isRunning: false });
  });
}

function cancel() {
  // Clear timeout if exists
  if (timeoutId) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }
  
  // Clear any existing alarms
  chrome.alarms.clear("bangbreakTimer");
  
  // Update storage
  chrome.storage.local.set({ isRunning: false });
}