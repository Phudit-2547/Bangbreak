const DEFAULT_COLOR = "#ffffff";

// Array of available audio files
const AUDIO_FILES = [
  "audio/maiwaileaw.mp3",
  "audio/trump_rest.mp3"
];

// Function to get a random audio file
function getRandomAudioFile() {
  const randomIndex = Math.floor(Math.random() * AUDIO_FILES.length);
  return AUDIO_FILES[randomIndex];
}

window.onload = function () {
  // Load audio on startup with random selection
  const randomAudioFile = getRandomAudioFile();
  const audio = new Audio(randomAudioFile);
  audio.preload = "auto";

  // Play the randomly selected audio
  audio.play().catch((e) => console.log("Audio play failed:", e));

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
