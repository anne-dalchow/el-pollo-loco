import World from "../modules/World.class.js";
import Keyboard from "../modules/Keyboard.class.js";
import SoundManager from "../modules/SoundManager.class.js";

let canvas;
let gameStarted = false;
window.keyboard = new Keyboard();

window.addEventListener("load", () => {
  // === DOM-Zugriffe ===
  canvas = document.getElementById("canvas");
  const soundCheckbox = document.getElementById("sound");
  const soundManager = new SoundManager();
  window.soundManager = soundManager;

  const startscreenMenu = document.getElementById("startscreen-menu");
  const blinkText = document.getElementById("blink");
  const settingMenu = document.getElementById("setting-menu-container");
  const creditMenu = document.getElementById("credit-menu");
  const backToMenuBtns = document.querySelectorAll(".back-to-menu");
  const startGameBtn = document.getElementById("start-game");
  const settingBtn = document.getElementById("settings");
  const creditsBtn = document.getElementById("credits");
  const creditLinks = document.querySelectorAll("#credit-menu a");

  const fullscreenCheckbox = document.getElementById("fullscreen-checkbox");

  creditLinks.forEach((link) => {
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
  });

  soundCheckbox.addEventListener("change", () => {
    if (soundCheckbox.checked) {
      soundManager.unmuteAll();
    } else {
      soundManager.muteAll();
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
  // === Welt initialisieren ===
  window.world = new World(canvas, window.keyboard, soundManager);

  // === Spielstartfunktion ===
  function gameStart() {
    if (!gameStarted) {
      gameStarted = true;
      document.getElementById("startscreen").style.display = "none";
      window.world.startGame();

      window.world.startGameSounds();
    }
  }

  // backToMenuBtn.addEventListener("click", location.reload());

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

    blinkText.style.animation = "none";
    blinkText.classList.add("hidden");
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
      blinkText.style.animation = "none";
      blinkText.classList.add("hidden");
    });
  });

  const endscreen = document.getElementById("endscreen");
  const img1 = document.getElementById("image1");
  const img2 = document.getElementById("image2");
  const restartBtn = document.getElementById("restart-btn");
  const backToMenuBtn = document.getElementById("back-to-menu-endscreen-btn");

  restartBtn.addEventListener("click", () => {
    hideElement(img1);
    hideElement(img2);
    hideElement(endscreen);

    window.world = new World(canvas, window.keyboard, soundManager);
  });

  // === Tastatursteuerung ===
  window.addEventListener("keydown", (e) => {
    startscreen(); // Startmenü zeigen
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
});
