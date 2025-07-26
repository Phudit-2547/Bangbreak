let timeoutId = null;

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.command === "start") {
    const { timer, action, customUrl, color } = msg;

    if (timeoutId) clearTimeout(timeoutId);

    // Save state
    chrome.storage.local.set({
      isRunning: true,
      action,
      customUrl,
      color
    });

    timeoutId = setTimeout(() => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];
        if (!tab || !tab.id) return;

        if (action === "blank") {
          const whiteUrl = chrome.runtime.getURL("white.html") + `?color=${encodeURIComponent(color || "#ffffff")}`;
          chrome.tabs.update(tab.id, { url: whiteUrl });
        } else if (action === "custom" && customUrl) {
          chrome.tabs.update(tab.id, { url: customUrl });
        }
        chrome.windows.getAll({}, function(windows){
            windows.forEach(function(window){
                if(window.state == "fullscreen"){
                    chrome.windows.update(window.id, {state: oldwindowstatus});
                }else{
                    oldwindowstatus = window.state;
                    chrome.windows.update(window.id, {state: "fullscreen"});
                }
            });
        });
      });

      timeoutId = null;
      chrome.storage.local.set({ isRunning: false });
    }, timer * 1000);
  }

  if (msg.command === "cancel") {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    chrome.storage.local.set({ isRunning: false });
  }
});
