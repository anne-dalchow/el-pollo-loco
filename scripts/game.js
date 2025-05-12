import World from "../modules/World.class.js";
import Controls from "../modules/Controls.class.js";

let canvas;
let world;

let gameStarted = false;

window.addEventListener("load", () => {
  setTimeout(() => {
    startscreen();
  }, 1000);

  // === DOM-Zugriffe ===
  canvas = document.getElementById("canvas");

  const startscreenMenu = document.getElementById("startscreen-menu");
  const settingMenu = document.getElementById("setting-menu-container");
  const creditMenu = document.getElementById("credit-menu");
  const backToMenuBtns = document.querySelectorAll(".back-to-menu");
  const buttons = startscreenMenu.querySelectorAll("button");
  const startGameBtn = document.getElementById("start-game");
  const settingBtn = document.getElementById("settings");
  const creditsBtn = document.getElementById("credits");
  const creditLinks = document.querySelectorAll("#credit-menu a");
  const soundIcons = document.querySelectorAll(".sound i");
  const fullscreen = document.getElementById("fullscreen");
  const fullscreenIcons = document.querySelectorAll(".fullscreen-toggle i");
  const endscreen = document.getElementById("endscreen");
  const restartLevelBtn = document.getElementById("restart-btn");
  const reloadBtn = document.getElementById("back-to-menu-endscreen-btn");

  creditLinks.forEach((link) => {
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
  });

  window.controls = new Controls();
  window.world = new World(canvas, window.controls);

  // === Spielstartfunktion ===
  function handleStartGame() {
    if (!gameStarted) {
      gameStarted = true;
      document.getElementById("startscreen").style.display = "none";
      window.world.startGame();
    }
  }

  // === Sound-Toggle ===
  soundIcons.forEach((icon) => {
    icon.addEventListener("click", () => {
      soundIcons.forEach((i) => i.classList.toggle("display-none"));
      const soundOnVisible =
        document
          .querySelector(".fa-volume-high")
          .classList.contains("display-none") === false;

      soundOnVisible
        ? window.world.unmuteAllSounds()
        : window.world.muteAllSounds();
    });
  });

  // === Fullscreen-Toggle ===
  fullscreenIcons.forEach((icon) => {
    icon.addEventListener("click", () => {
      fullscreenIcons.forEach((i) => i.classList.toggle("display-none"));
      const isFullscreen = document.fullscreenElement === fullscreen;

      isFullscreen ? exitFullscreen() : enterFullscreen(fullscreen);
    });
  });

  function enterFullscreen(el) {
    if (el.requestFullscreen) {
      el.requestFullscreen();
    } else if (el.msRequestFullscreen) {
      el.msRequestFullscreen();
    } else if (el.webkitRequestFullscreen) {
      el.webkitRequestFullscreen();
    }
  }

  function exitFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }

  // === Toggle-Helferfunktionen ===
  function showElement(el) {
    el.classList.remove("hidden");
    el.classList.add("visible");
  }

  function hideElement(el) {
    el.classList.remove("visible");
    el.classList.add("hidden");
  }

  // === Startscreen-Logik ===
  function startscreen() {
    showElement(startscreenMenu);

    const buttons = startscreenMenu.querySelectorAll("button");
    buttons.forEach((btn, i) => {
      btn.style.animation = "none";
      void btn.offsetWidth; // Reflow
      btn.style.animation = `slide-in-left 0.4s ease-out ${i * 0.1}s forwards`;
    });
    settingMenu.classList.add("hidden");
  }

  // === EventListener ===
  startGameBtn.addEventListener("click", () => {
    buttons.forEach((btn, i) => {
      btn.style.animation = "slide-out-right 0.4s ease-in forwards";
      btn.style.animationDelay = `${i * 0.1}s`;
    });
    setTimeout(() => {
      hideElement(startscreenMenu);
      handleStartGame();
    }, 600);
  });
  settingBtn.addEventListener("click", () => {
    hideElement(startscreenMenu);
    showElement(settingMenu);
  });
  creditsBtn.addEventListener("click", () => {
    hideElement(startscreenMenu);
    showElement(creditMenu);
  });
  backToMenuBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      showElement(startscreenMenu);
      hideElement(settingMenu);
      hideElement(creditMenu);
    });
  });

  restartLevelBtn.addEventListener("click", () => {
    const img2 = document.getElementById("image2");
    const btnContainer = document.querySelector(".endscreen-btn-container");

    window.world = null;

    canvas = document.getElementById("canvas");
    window.world = new World(canvas, window.controls);

    hideElement(endscreen);
    hideElement(img2);
    hideElement(btnContainer);
    gameStarted = true;

    window.world.startGame();
  });

  reloadBtn.addEventListener("click", () => {
    location.reload();
  });
});
