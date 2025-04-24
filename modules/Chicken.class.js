import MoveableObject from "./MoveableObject.class.js";

export default class Chicken extends MoveableObject {
  constructor() {
    super();
    this.loadImg("assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
    this.posX = 250 + Math.random() * 500;
    this.posY = 350;
    this.width = 80;
    this.height = 80;
  }

  eat() {
    console.log("chicken eat");
  }
}
