import MoveableObject from "./MoveableObject.class.js";

export default class ThrowableObject extends MoveableObject {
  IMAGES_BOTTLE = [
    "assets/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "assets/img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "assets/img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "assets/img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
  ];

  throwBottleSound = new Audio("assets/audio/throw.wav");
  width = 60;
  height = 60;

  constructor(x, y, shouldThrow = false, otherDirection = false) {
    super();
    this.posX = x;
    this.posY = y;
    this.height = 60;
    this.width = 60;
    this.otherDirection = otherDirection;
    this.loadImg("assets/img/6_salsa_bottle/2_salsa_bottle_on_ground.png");
    this.loadImages(this.IMAGES_BOTTLE);

    if (shouldThrow) {
      this.throwBottle();
      this.throwBottleAnimation();
    }
  }

  throwBottleAnimation() {
    this.throwBottleSound.volume = 0.1;
    this.throwBottleSound.play().catch((e) => {
      console.warn("Throw-Bottle-Sound konnte nicht abgespielt werden:", e);
    });
    this.speed = 0;
    this.bottleInterval = setInterval(() => {
      this.playAnimation(this.IMAGES_BOTTLE);
    }, 100);
  }

  throwBottle() {
    this.speedY = 30;
    this.applyGravity();

    this.throwMoveInterval = setInterval(() => {
      let direction = this.otherDirection ? -1 : 1;
      this.posX += 10 * direction;

      if (this.posY >= 500) {
        clearInterval(this.bottleInterval);
        clearInterval(this.throwMoveInterval);
        this.speedY = 0;
      }
    }, 25);
  }
}
