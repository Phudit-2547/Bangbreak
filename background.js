chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  const { action, customUrl, color } = msg;

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
});
