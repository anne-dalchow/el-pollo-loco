import World from "../modules/World.class.js";
import Keyboard from "../modules/Keyboard.class.js";

let canvas;
let world;
let gameStarted = false;

window.addEventListener("load", () => {
  setTimeout(() => {
    startscreen(); // Startmenü zeigen
  }, 1000);

  // === DOM-Zugriffe ===
  canvas = document.getElementById("canvas");
  const soundCheckbox = document.getElementById("sound");

  const startscreenMenu = document.getElementById("startscreen-menu");
  const settingMenu = document.getElementById("setting-menu-container");
  const creditMenu = document.getElementById("credit-menu");
  const backToMenuBtns = document.querySelectorAll(".back-to-menu");
  const startGameBtn = document.getElementById("start-game");
  const settingBtn = document.getElementById("settings");
  const creditsBtn = document.getElementById("credits");
  const creditLinks = document.querySelectorAll("#credit-menu a");
  const fullscreenCheckbox = document.getElementById("fullscreen-checkbox");
  const endscreen = document.getElementById("endscreen");
  const restartLevelBtn = document.getElementById("restart-btn");
  const reloadBtn = document.getElementById("back-to-menu-endscreen-btn");

  creditLinks.forEach((link) => {
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
  });

  window.keyboard = new Keyboard();
  window.world = new World(canvas, window.keyboard);
  // === Spielstartfunktion ===
  function gameStart() {
    if (!gameStarted) {
      gameStarted = true;
      document.getElementById("startscreen").style.display = "none";
      window.world.startGame();
    }
  }

  soundCheckbox.addEventListener("change", () => {
    if (soundCheckbox.checked) {
      world.unmuteAllSounds();
    } else {
      world.muteAllSounds();
    }
  });

  fullscreenCheckbox.addEventListener("change", () => {
    const fullscreen = document.getElementById("fullscreen");
    if (fullscreenCheckbox.checked) {
      enterFullscreen(fullscreen);
    } else {
      exitFullscreen();
    }
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
    const buttons = startscreenMenu.querySelectorAll("button");

    buttons.forEach((btn, i) => {
      btn.style.animation = "slide-out-right 0.4s ease-in forwards";
      btn.style.animationDelay = `${i * 0.1}s`;
    });

    setTimeout(() => {
      hideElement(startscreenMenu);
      gameStart();
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
    window.world = new World(canvas, window.keyboard);

    hideElement(endscreen);
    hideElement(img2);
    hideElement(btnContainer);
    gameStarted = true;

    window.world.startGame();
  });

  reloadBtn.addEventListener("click", () => {
    location.reload();
  });

  // === Tastatursteuerung ===
  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") window.keyboard.left = true;
    if (e.key === "ArrowRight") window.keyboard.right = true;
    if (e.key === " ") window.keyboard.up = true;
    if (e.key === "d") window.keyboard.d = true;
  });

  window.addEventListener("keyup", (e) => {
    if (e.key === "ArrowLeft") window.keyboard.left = false;
    if (e.key === "ArrowRight") window.keyboard.right = false;
    if (e.key === " ") window.keyboard.up = false;
    if (e.key === "d") window.keyboard.d = false;
  });

  // === Mobilsteuerung ===
  const leftBtn = document.querySelector(".fa-circle-left");
  const rightBtn = document.querySelector(".fa-circle-right");
  const upBtn = document.querySelector(".fa-circle-up");
  const throwBtn = document.querySelector(".fa-wine-bottle");

  if (leftBtn) {
    leftBtn.addEventListener(
      "touchstart",
      () => (window.keyboard.left = true),
      { passive: true }
    );
    leftBtn.addEventListener("touchend", () => (window.keyboard.left = false));
  }

  if (rightBtn) {
    rightBtn.addEventListener(
      "touchstart",
      () => (window.keyboard.right = true),
      { passive: true }
    );
    rightBtn.addEventListener(
      "touchend",
      () => (window.keyboard.right = false)
    );
  }

  if (upBtn) {
    upBtn.addEventListener("touchstart", () => (window.keyboard.up = true), {
      passive: true,
    });
    upBtn.addEventListener("touchend", () => (window.keyboard.up = false));
  }

  if (throwBtn) {
    throwBtn.addEventListener("touchstart", () => (window.keyboard.d = true), {
      passive: true,
    });
    throwBtn.addEventListener("touchend", () => (window.keyboard.d = false));
  }
});
