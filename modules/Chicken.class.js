import MoveableObject from "./MoveableObject.class.js";

export default class Chicken extends MoveableObject {
  posY = 350;
  width = 80;
  height = 80;
  IMAGES_WALKING = [
    "assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "assets/img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "assets/img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
  ];

  IMAGE_DEAD = "assets/img/3_enemies_chicken/chicken_small/2_dead/dead.png";
  chickenDeadSound = new Audio("assets/audio/damage.mp3");

  constructor() {
    super();
    this.isDead = false;
    let randomSpeed = 0.5 + Math.random() * 0.5;

    this.loadImg("assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png");
    this.loadImages(this.IMAGES_WALKING);
    this.posX = 250 + Math.random() * 3600;
  }

  startMoving() {
    let randomSpeed = 0.5 + Math.random() * 0.5;
    this.chickenWalkAnimation();
    this.moveLeft(randomSpeed, -60);
  }

  chickenWalkAnimation() {
    this.walkInterval = setInterval(() => {
      if (!this.isDead) {
        this.playAnimation(this.IMAGES_WALKING);
      } else {
        clearInterval(this.walkInterval);
      }
    }, 100);
  }

  moveLeft(speed, end) {
    this.moveInterval = setInterval(() => {
      if (!this.isDead) {
        if (this.posX > end) {
          this.posX -= speed;
        } else {
          this.posX = 800;
        }
      } else {
        clearInterval(this.moveInterval);
      }
    }, 1000 / 60);
  }

  die() {
    this.isDead = true;
    this.loadImg(this.IMAGE_DEAD);
    this.chickenDeadSound.volume = 0.4;
    this.chickenDeadSound.play().catch((e) => {
      console.warn("Chicken-Dead-Sound konnte nicht abgespielt werden:", e);
    });
    this.speed = 0;

    // Huhn nach 2 Sekunden entfernen
    setTimeout(() => {
      this.markForRemoval = true;
    }, 2000);
  }
}
