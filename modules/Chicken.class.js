import MoveableObject from "./MoveableObject.class.js";

export default class Chicken extends MoveableObject {
  posY = 350;
  width = 80;
  height = 80;

  constructor() {
    super();
    this.loadImg("assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
    this.posX = 250 + Math.random() * 500;
    this.animate(1);
  }


}
