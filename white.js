const DEFAULT_COLOR = "#ffffff";

window.onload = function () {
  // Load audio on startup
  const audio = new Audio("audio/maiwaileaw.mp3");
  audio.play();
  audio.preload = "auto";
  
  // Optional: You can play the audio immediately or store it for later use
  // audio.play().catch(e => console.log("Audio play failed:", e));
  
  const params = new URLSearchParams(window.location.search);
  const color = params.get("color") || DEFAULT_COLOR;
  const enableAnimation = params.get("animation") === "true";

  if (enableAnimation) {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes colorSwitchAnimation {
        0% {
          background-color: black;
        }
        100% {
          background-color: ${color};
        }
      }  
    `;
    document.head.appendChild(style);

    document.body.style.animation =
      "colorSwitchAnimation 0.05s infinite alternate";
  } else {
    // Just set the static color without animation
    document.body.style.backgroundColor = color;
  }
};
