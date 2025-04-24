
import World from "../modules/World.class.js";

let canvas;
window.addEventListener("load", init);

function init() {
 canvas = document.getElementById("canvas");
 window.world = new World(canvas); 
}
