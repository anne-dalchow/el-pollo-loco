const fullscreenIcons = document.querySelectorAll(".fullscreen-toggle i");
const fullscreen = document.getElementById("fullscreen");

/**
 * Listen to click event on fullscreen icon
 * @listens fullscreenIcon#click - toggles between fullscreen and normal mode
 */
fullscreenIcons.forEach((icon) => {
  icon.addEventListener("click", () => {
    const isEntering = icon.classList.contains("fa-expand");
    fullscreenIcons.forEach((i) => i.classList.add("display-none"));

    if (isEntering) {
      document.querySelector(".fa-compress").classList.remove("display-none");
      enterFullscreen(fullscreen);
    } else {
      document.querySelector(".fa-expand").classList.remove("display-none");
      exitFullscreen();
    }
  });
});

/**
 * @function enterFullscreen - Puts the given element into fullscreen mode.
 * @param {HTMLElement} el - The HTML element to display in fullscreen.
 */
function enterFullscreen(el) {
  if (el.requestFullscreen) {
    el.requestFullscreen();
  } else if (el.msRequestFullscreen) {
    el.msRequestFullscreen();
  } else if (el.webkitRequestFullscreen) {
    el.webkitRequestFullscreen();
  }
}

/**
 * @function exitFullscreen - Exits fullscreen mode.
 */
function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}
