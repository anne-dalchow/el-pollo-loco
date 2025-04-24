import MoveableObject from "./MoveableObject.class.js";

export default class Character extends MoveableObject{
 constructor(posX,posY,img){
  super(posX,posY,img)
 };

 jump(){
  console.log("pepe jumps")
 };
}