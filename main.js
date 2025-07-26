document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get("isRunning", (data) => {
    const running = data.isRunning === true;
    toggleButtons(running);
  });

  const timerInput = document.getElementById("timer");

  timerInput.addEventListener("input", (e) => {
    let value = e.target.value.replace(/[^0-9]/g, "");

    // Don't do anything if empty
    if (value.length === 0) {
      e.target.value = "";
      return;
    }

    if (value.length > 6) {
      value = value.substring(0, 6);
    }

    // Format based on length
    let formatted = "";
    if (value.length <= 2) {
      // Just show the digits for hours
      formatted = value;
    } else if (value.length <= 4) {
      // Show HH:MM
      formatted = value.substring(0, 2) + ":" + value.substring(2);
    } else {
      // Show HH:MM:SS
      formatted = value.substring(0, 2) + ":" + value.substring(2, 4) + ":" + value.substring(4);
    }

    e.target.value = formatted;
  });

  // Validate and auto-complete on blur
  timerInput.addEventListener("blur", (e) => {
    let value = e.target.value.replace(/[^0-9]/g, "");

    // If empty, set default
    if (value.length === 0) {
      e.target.value = "00:00:05";
      return;
    }

    // Pad with zeros to make 6 digits
    value = value.padEnd(6, "0");
    if (value.length > 6) {
      value = value.substring(0, 6);
    }

    // Format as HH:MM:SS
    const formatted = value.substring(0, 2) + ":" + value.substring(2, 4) + ":" + value.substring(4, 6);
    e.target.value = formatted;
  });
});

// Function to convert HH:MM:SS to total seconds
function timeToSeconds(timeString) {
  const parts = timeString.split(":");
  const hours = parseInt(parts[0], 10) || 0;
  const minutes = parseInt(parts[1], 10) || 0;
  const seconds = parseInt(parts[2], 10) || 0;

  return (hours * 3600) + (minutes * 60) + seconds;
}

let startBtn = document.getElementById("startBtn");
let cancelBtn = document.getElementById("cancelBtn");

startBtn.addEventListener("click", () => {
  const timerString = document.getElementById("timer").value;
  const timer = timeToSeconds(timerString);
  console.log(timer)

  // Validate timer is greater than 0
  if (timer <= 0) {
    alert("Please enter a valid time greater than 00:00:00");
    return;
  }

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
