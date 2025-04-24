import MoveableObject from "./MoveableObject.class.js";

export default class Chicken extends MoveableObject{
 constructor(posX, posY, img){}
 eat(){
  console.log("chicken eat")
 }
}