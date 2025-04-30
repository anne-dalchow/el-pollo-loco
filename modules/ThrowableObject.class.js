import MoveableObject from "./MoveableObject.class.js";

export default class ThrowableObject extends MoveableObject {
  IMAGES_BOTTLE = [
    "assets/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "assets/img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "assets/img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "assets/img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
  ];

  constructor(x, y) {
    super();
    this.posX = x;
    this.posY = y;
    this.height = 50;
    this.width = 50;
    this.loadImg(
      "assets/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png"
    );
    this.loadImages(this.IMAGES_BOTTLE);
    this.throwBottle();
    this.throwBottleAnimation();
  }
  throwBottleAnimation() {
    this.bottleInterval = setInterval(() => {
      this.playAnimation(this.IMAGES_BOTTLE);
    }, 100);
  }

  throwBottle() {
    this.speedY = 30;
    this.applyGravity();

    setInterval(() => {
      this.posX += 10;

      if (!this.isAboveGround()) {
        clearInterval(this.bottleInterval);
        this.speedY = 0;
      }
    }, 25);
  }
}
