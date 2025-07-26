window.onload = function () {
  const params = new URLSearchParams(window.location.search);
  const color = params.get("color") || "#ffffff";
  document.body.style.backgroundColor = color;
};