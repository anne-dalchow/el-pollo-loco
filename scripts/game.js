import Character from "../modules/Character.class.js";
import Chicken from "../modules/Chicken.class.js";

let canvas;
let ctx;
let character = new Character();

window.addEventListener("load",init);

function init(){
 canvas = document.getElementById("canvas");
 ctx = canvas.getContext('2d');

 console.log("My Character is",character)


}

