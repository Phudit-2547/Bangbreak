let timeoutId = null;

const startBtn = document.getElementById("startBtn");
const cancelBtn = document.getElementById("cancelBtn");

startBtn.addEventListener("click", () => {
  const timer = parseInt(document.getElementById("timer").value, 10);
  const action = document.getElementById("action").value;
  const customUrl = document.getElementById("customUrl").value;
  const color = document.getElementById("colorPicker").value;

  // Send config to background but DO NOT set timer there anymore
  timeoutId = setTimeout(() => {
    chrome.runtime.sendMessage({
      action,
      customUrl,
      color
    });
    toggleButtons(false); // reset buttons after triggering
  }, timer * 1000);

  toggleButtons(true); // show cancel, hide start
});

cancelBtn.addEventListener("click", () => {
  if (timeoutId !== null) {
    clearTimeout(timeoutId);
    timeoutId = null;
    toggleButtons(false); // show start again
  }
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
