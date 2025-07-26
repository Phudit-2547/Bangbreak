chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  const { timer, action, customUrl } = msg;

  setTimeout(() => {
    // Query current active tab when timer expires
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (!tab || !tab.id) return;

      if (action === "blank") {
        const whiteUrl = chrome.runtime.getURL("white.html") + `?color=${encodeURIComponent(color || "#ffffff")}`;
        chrome.tabs.update(tab.id, { url: whiteUrl });
      } else if (action === "custom" && customUrl) {
        chrome.tabs.update(tab.id, { url: customUrl });
      }
    });

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
    }, timer * 1000);
});

