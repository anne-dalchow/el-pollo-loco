import MoveableObject from "./MoveableObject.class.js";

export default class Clouds extends MoveableObject{
 constructor() {
  super();
  this.loadImg('assets/img/5_background/layers/4_clouds/1.png');
  this.posX = 200 + Math.random()*500;
 }

}