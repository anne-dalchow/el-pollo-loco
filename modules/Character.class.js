import MoveableObject from "./MoveableObject.class.js";

export default class Character extends MoveableObject{
 constructor() {
  super();
  this.loadImg('assets/img/2_character_pepe/2_walk/W-21.png');
}

 jump(){
  console.log("pepe jumps")
 };
}