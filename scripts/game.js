import World from "../modules/World.class.js";
import Keyboard from "../modules/Keyboard.class.js";

let canvas;
let gameStarted = false;
window.keyboard = new Keyboard();

window.addEventListener("load", () => {
  canvas = document.getElementById("canvas");
  window.world = new World(canvas, window.keyboard);
});

window.addEventListener("keydown", (e) => {
  if (!gameStarted) {
    gameStarted = true;
    document.getElementById("startscreen").style.display = "none";
    window.world.startGame();
    window.world.startGameSounds();
  }

  if (e.key === "ArrowLeft") {
    window.keyboard.left = true;
  }
  if (e.key === "ArrowRight") {
    window.keyboard.right = true;
  }
  if (e.key === " ") {
    window.keyboard.up = true;
  }
  if (e.key === "Shift") {
    window.keyboard.shift = true;
  }
  if (e.key === "d") {
    window.keyboard.d = true;
  }
});

window.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft") {
    window.keyboard.left = false;
  }
  if (e.key === "ArrowRight") {
    window.keyboard.right = false;
  }
  if (e.key === " ") {
    window.keyboard.up = false;
  }
  if (e.key === "Shift") {
    window.keyboard.shift = false;
  }
  if (e.key === "d") {
    window.keyboard.d = false;
  }
});
