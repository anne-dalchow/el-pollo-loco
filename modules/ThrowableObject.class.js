import MoveableObject from "./MoveableObject.class.js";

export default class ThrowableObject extends MoveableObject {
  constructor(x, y) {
    super();
    this.posX = x;
    this.posY = y;
    this.height = 50;
    this.width = 50;
    this.loadImg(
      "assets/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png"
    );
    this.throwBottle();
  }

  throwBottle() {
    this.speedY = 30;
    this.applyGravity();
    setInterval(() => {
      this.posX += 10;
    }, 25);
  }
}
