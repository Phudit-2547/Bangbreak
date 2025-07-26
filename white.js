window.onload = function () {
  const params = new URLSearchParams(window.location.search);
  const color = params.get("color") || "#ffffff";
  const enableAnimation = params.get("animation") === "true";

  if (enableAnimation) {
    const style = document.createElement('style');
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

    document.body.style.animation = 'colorSwitchAnimation 0.05s infinite alternate';
  } else {
    // Just set the static color without animation
    document.body.style.backgroundColor = color;
  }
};