// BaseChicken.class.js
import MoveableObject from "./MoveableObject.class.js";

export default class Enemies extends MoveableObject {
  constructor(imagesWalking, imageDead, posY, width, height, soundManager) {
    super();
    this.posY = posY;
    this.width = width;
    this.height = height;
    this.IMAGES_WALKING = imagesWalking;
    this.IMAGE_DEAD = imageDead;
    this.isDead = false;

    this.dieingSoundPath = "assets/audio/damage.mp3";
    this.dieingSound = soundManager.prepare(this.dieingSoundPath, 0.4);

    this.loadImg(imagesWalking[0]);
    this.loadImages(imagesWalking);
  }

  startMoving() {
    let randomSpeed = 0.5 + Math.random() * 0.5;
    this.chickenWalkAnimation();
    this.moveLeft(randomSpeed, -60);
  }

  chickenWalkAnimation() {
    this.walkInterval = setInterval(() => {
      !this.isDead
        ? this.playAnimation(this.IMAGES_WALKING)
        : clearInterval(this.walkInterval);
    }, 100);
  }

  moveLeft(speed, end) {
    this.moveInterval = setInterval(() => {
      !this.isDead
        ? this.posX > end
          ? (this.posX -= speed)
          : (this.posX = 800)
        : clearInterval(this.moveInterval);
    }, 1000 / 60);
  }

  die() {
    this.isDead = true;
    this.loadImg(this.IMAGE_DEAD);
    this.dieingSound.play();
    this.speed = 0;
  }
}
