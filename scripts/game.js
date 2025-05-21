/**
 * @fileoverview Main script to handle the start screen, game controls, sound, and game state.
 * The script sets up event listeners for user interactions and controls the flow of the game.
 * It manages the visibility of the start screen, settings, and credits, as well as handles game start, restart, and sound functionalities.
 */

import World from "../modules/World.class.js";
import Controls from "../modules/Controls.class.js";
import SoundManager from "../modules/SoundManager.class.js";

let canvas;
let gameStarted = false;

window.addEventListener("load", () => {
  // === Show start screen after 1 second ===
  setTimeout(() => {
    getSavedSoundSettings();
    startscreen();
  }, 1000);

  // === DOM References ===
  canvas = document.getElementById("canvas");
  const startscreenMenu = document.getElementById("startscreen-menu");
  const settingMenu = document.getElementById("setting-menu-container");
  const creditMenu = document.getElementById("credit-menu");
  const backToMenuBtns = document.querySelectorAll(".back-to-menu");
  const buttons = startscreenMenu.querySelectorAll("button");
  const startGameBtn = document.getElementById("start-game");
  const toggleControls = document.getElementById("toggle-controls");
  const gamepadIcon = toggleControls.querySelector(".fa-gamepad");
  const hintText = toggleControls.querySelector(".hint-text");
  const settingBtn = document.getElementById("settings");
  const creditsBtn = document.getElementById("credits");
  const creditLinks = document.querySelectorAll("#credit-menu a");
  const soundIcons = document.querySelectorAll(".sound i");
  const endscreen = document.getElementById("endscreen");
  const restartLevelBtn = document.getElementById("restart-btn");
  const reloadBtn = document.getElementById("back-to-menu-endscreen-btn");
  let gameControlsBtns = document.getElementById("game-controls-below");
  const closeMobileControlsBtn = document.getElementById(
    "close-mobile-controls-btn"
  );

  // === Open credit links in new tab ===
  creditLinks.forEach((link) => {
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
  });

  // === Initialize World, Soundmanager, Controls ===
  window.controls = new Controls();
  window.soundManager = new SoundManager();
  window.soundManager.prepareAll();
  window.world = new World(canvas, window.controls, window.soundManager);

  /**
   * Listen to click event on toggle controls button
   * @listens toggleControls#click - toggles visibility of game controls buttons
   */
  gamepadIcon.addEventListener("click", () => {
    gameControlsBtns.classList.remove("display-none");
    toggleControls.classList.add("display-none");
    closeMobileControlsBtn.classList.remove("display-none");
  });

  closeMobileControlsBtn.addEventListener("click", () => {
    gameControlsBtns.classList.add("display-none");
    toggleControls.classList.remove("display-none");
    closeMobileControlsBtn.classList.add("display-none");
  });

  /**
   * Listen to click event on sound icon, and sound settings saved on localStorage for level restart
   * @listens soundIcon#click - toggles sound icon on or off
   */
  soundIcons.forEach((icon) => {
    icon.addEventListener("click", () => {
      soundIcons.forEach((i) => i.classList.toggle("display-none"));
      const soundOnVisible =
        document
          .querySelector(".fa-volume-high")
          .classList.contains("display-none") === false;

      if (soundOnVisible) {
        window.world.soundManager.unmuteAll();
        localStorage.setItem("soundMuted", "false");
      } else {
        window.world.soundManager.muteAll();
        localStorage.setItem("soundMuted", "true");
      }
    });
  });

  function getSavedSoundSettings() {
    const soundMuted = localStorage.getItem("soundMuted") === "true";
    if (soundMuted) {
      window.world.soundManager.muteAll();
      document.querySelector(".fa-volume-high").classList.add("display-none");
      document
        .querySelector(".fa-volume-xmark")
        .classList.remove("display-none");
    } else {
      window.world.soundManager.unmuteAll();
      document
        .querySelector(".fa-volume-high")
        .classList.remove("display-none");
      document.querySelector(".fa-volume-xmark").classList.add("display-none");
    }
  }

  /**
   * @function handleStartGame - Starts the game if it hasn't started yet.
   */
  function handleStartGame() {
    if (!gameStarted) {
      gameStarted = true;
      document.getElementById("startscreen").style.display = "none";
      window.world.startGame();
    }
  }

  // === Toggle helper functions ===
  /**
   * @function showElement - Displays the specified element.
   * @param {HTMLElement} el - The element to be shown.
   */
  function showElement(el) {
    el.classList.remove("hidden");
    el.classList.add("visible");
  }

  /**
   * @function hideElement - Hides the specified element.
   * @param {HTMLElement} el - The element to be hidden.
   */
  function hideElement(el) {
    el.classList.remove("visible");
    el.classList.add("hidden");
  }

  /**
   * @function startscreen - Shows the start screen menu and animates the buttons.
   */
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

  // === Buttons EventListener (startscreen) ===

  /**
   * Listen to click event on start game button
   * @listens startGameBtn#click - starts the game when clicked
   */
  startGameBtn.addEventListener("click", () => {
    buttons.forEach((btn, i) => {
      btn.style.animation = "slide-out-right 0.4s ease-in forwards";
      btn.style.animationDelay = `${i * 0.1}s`;
    });
    setTimeout(() => {
      gamepadIcon.classList.remove("bouncing");
      hideElement(hintText);
      hideElement(startscreenMenu);
      handleStartGame();
    }, 600);
  });

  /**
   * Listen to click event on settings button
   * @listens settingBtn#click - shows the settings menu
   */
  settingBtn.addEventListener("click", () => {
    hideElement(startscreenMenu);
    showElement(settingMenu);
    toggleControls.style.display = "none";
  });

  /**
   * Listen to click event on credits button
   * @listens creditsBtn#click - shows the credits menu
   */
  creditsBtn.addEventListener("click", () => {
    hideElement(startscreenMenu);
    showElement(creditMenu);
    toggleControls.style.display = "none";
  });

  /**
   * Listen to click event on back to menu button
   * @listens backToMenuBtn#click - navigates back to the start screen
   */
  backToMenuBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      showElement(startscreenMenu);
      hideElement(settingMenu);
      hideElement(creditMenu);
      toggleControls.style.display = "block";
    });
  });

  /**
   * Listen to click event on restart level button
   * @listens restartLevelBtn#click - restarts the current level
   * @description restart level on click event. Reset World, Enemies, Endboss, Sounds, Collectable Items
   */
  restartLevelBtn.addEventListener("click", () => {
    const img2 = document.getElementById("image2");
    const btnContainer = document.querySelector(".endscreen-btn-container");
    canvas = document.getElementById("canvas");

    cleanupWorld();
    getSavedSoundSettings();
    hideElement(endscreen);
    hideElement(img2);
    hideElement(btnContainer);
    gameStarted = true;
    window.world.startGame();
  });

  function cleanupWorld() {
    window.world?.cleanup();
    window.world = null;
    window.world = new World(canvas, window.controls, window.soundManager);
  }

  /**
   * Listen to click event on reload button
   * @listens reloadBtn#click - reloads the page to reset the game
   */
  reloadBtn.addEventListener("click", () => {
    location.reload();
  });
});
