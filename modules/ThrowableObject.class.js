import MoveableObject from "./MoveableObject.class.js";

export default class ThrowableObject extends MoveableObject {
  height = 50;
  width = 50;

  constructor(x, y) {
    super();
    this.loadImg(
      "assets/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png"
    );
    this.throwBottle(x, y);
  }

  throwBottle() {
    this.speedY = 30;
    this.applyGravity();
    setInterval(() => {
      this.posX += 10;
    }, 25);
  }
}
