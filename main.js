document.addEventListener("DOMContentLoaded", () => {
  const actionSelect = document.getElementById("action");
  const colorPreset = document.getElementById("colorPreset");
  const colorPicker = document.getElementById("colorPicker");
  const customUrlInput = document.getElementById("customUrl");

  // Update input visibility on dropdown change
  actionSelect.addEventListener("change", () => {
    const action = actionSelect.value;
    if (action === "blank") {
      colorPreset.style.display = "block";
      colorPicker.style.display = "block";
      customUrlInput.style.display = "none";
    } else if (action === "custom") {
      colorPreset.style.display = "none";
      colorPicker.style.display = "none";
      customUrlInput.style.display = "block";
    }
  });

  // Set correct visibility on popup load (if default isn't blank)
  actionSelect.dispatchEvent(new Event("change"));

  // Also check storage for timer status to update buttons
  chrome.storage.local.get("isRunning", (data) => {
    const running = data.isRunning === true;
    toggleButtons(running);
  });
});

let startBtn = document.getElementById("startBtn");
let cancelBtn = document.getElementById("cancelBtn");

startBtn.addEventListener("click", () => {
  const timer = parseInt(document.getElementById("timer").value, 10);
  const action = document.getElementById("action").value;
  const customUrl = document.getElementById("customUrl").value;
  const color = document.getElementById("colorPicker").value;
  const enableAnimation = document.getElementById("enableAnimation").checked;

  chrome.runtime.sendMessage({
    command: "start",
    timer,
    action,
    customUrl,
    color,
    enableAnimation
  });

  toggleButtons(true);
});

cancelBtn.addEventListener("click", () => {
  chrome.runtime.sendMessage({ command: "cancel" });
  toggleButtons(false);
});

function toggleButtons(isRunning) {
  startBtn.style.display = isRunning ? "none" : "inline-block";
  cancelBtn.style.display = isRunning ? "inline-block" : "none";
}

document.querySelectorAll(".preset").forEach((btn) => {
  btn.addEventListener("click", () => {
    const selectedColor = btn.getAttribute("data-color");
    const colorPicker = document.getElementById("colorPicker");
    colorPicker.value = selectedColor;

    // Force color picker UI update
    colorPicker.dispatchEvent(new Event("input", { bubbles: true }));
  });
});
