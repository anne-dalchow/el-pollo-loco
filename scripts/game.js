import World from "../modules/World.class.js";
import Keyboard from "../modules/Keyboard.class.js";

let canvas;
window.keyboard = new Keyboard();
window.addEventListener("load", init);

function init() {
  canvas = document.getElementById("canvas");

  window.world = new World(canvas, window.keyboard);
}

window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") {
    window.keyboard.up = true;
  }
  if (e.key === "ArrowLeft") {
    window.keyboard.left = true;
  }
  if (e.key === "ArrowRight") {
    window.keyboard.right = true;
  }
});


window.addEventListener("keyup", (e) => {
 if (e.key === "ArrowUp") {
   window.keyboard.up = false;
 }
 if (e.key === "ArrowLeft") {
   window.keyboard.left = false;
 }
 if (e.key === "ArrowRight") {
   window.keyboard.right = false;
 }
});
