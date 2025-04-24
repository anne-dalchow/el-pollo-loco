import World from "../modules/World.class.js";

let canvas;
let ctx;
let world = new World();


window.addEventListener("load", init);

function init() {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  console.log("my character ist", world.character, world.enemies)
}
