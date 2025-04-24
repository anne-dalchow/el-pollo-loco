import MoveableObject from "./MoveableObject.class.js";

export default class Character extends MoveableObject{
 constructor() {
  super();
  this.loadImg('assets/img/2_character_pepe/2_walk/W-21.png');
  this.height = 280;
  this.width = 150;
  this.posX = 80;
  this.posY = 160;
}

 jump(){
  console.log("pepe jumps")
 };
}