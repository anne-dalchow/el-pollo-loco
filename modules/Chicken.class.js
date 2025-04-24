import MoveableObject from "./MoveableObject.class.js";

export default class Chicken extends MoveableObject{
 constructor() {
  super();
  this.loadImg('assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
  this.posX = 200 + Math.random()*500;
 }

 eat(){
  console.log("chicken eat")
 }
}