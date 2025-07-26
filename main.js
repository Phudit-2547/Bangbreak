document.getElementById("action").addEventListener("change", function () {
  const customUrl = document.getElementById("customUrl");
  customUrl.style.display = this.value === "custom" ? "block" : "none";
});

document.getElementById("startBtn").addEventListener("click", async () => {
  const timer = parseInt(document.getElementById("timer").value, 10);
  const action = document.getElementById("action").value;
  const customUrl = document.getElementById("customUrl").value;

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const color = document.getElementById("colorPicker").value;

  chrome.runtime.sendMessage({
    tabId: tab.id,
    timer,
    action,
    customUrl,
    color
  });
});

document.querySelectorAll(".preset").forEach((btn) => {
  btn.addEventListener("click", () => {
    const selectedColor = btn.getAttribute("data-color");
    const colorPicker = document.getElementById("colorPicker");
    colorPicker.value = selectedColor;

    // Force color picker UI update
    colorPicker.dispatchEvent(new Event("input", { bubbles: true }));
  });
});
