
import World from "../modules/World.class.js";
import Keyboard from "../modules/Keyboard.class.js";

let canvas;
window.addEventListener("load", init);

function init() {
 canvas = document.getElementById("canvas");
 window.world = new World(canvas); 
 window.keyboard = new Keyboard();
}

window.addEventListener('keydown', (e) =>{
 console.log(e);
 if(e.key === "ArrowUp"){
  window.keyboard.up = true;
 }
 if(e.key === "ArrowLeft"){
  window.keyboard.left = true;
 }
 if(e.key === "ArrowRight"){
  window.keyboard.right = true;
  console.log( window.keyboard.right);
 }
})