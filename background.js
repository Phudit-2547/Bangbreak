chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  const { tabId, timer, action, customUrl } = msg;

  setTimeout(() => {
    if (action === "blank") {
        const whiteUrl = chrome.runtime.getURL("white.html") + `?color=${encodeURIComponent(msg.color || "#ffffff")}`;
        chrome.tabs.update(tabId, { url: whiteUrl });
    } else if (action === "custom" && customUrl) {
        chrome.tabs.update(tabId, { url: customUrl });
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
    }, timer * 1000);
});
