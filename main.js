document.addEventListener("DOMContentLoaded", () => {
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

  chrome.runtime.sendMessage({
    command: "start",
    timer,
    action,
    customUrl,
    color
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
