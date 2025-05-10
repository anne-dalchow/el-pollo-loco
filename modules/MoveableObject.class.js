import DrawableObject from "./DrawableObject.class.js";

export default class MoveableObject extends DrawableObject {
  otherDirection = false;
  speedY = 0;
  acceleration = 2.5;
  energy = 100;
  lastHit = 0;
  imageCache = {};
  currentImage = 0;
  walkInterval = null;
  gravityInterval = null;

  isColliding(mo, offsetX = 0, offsetY = 0) {
    return (
      this.posX + offsetX < mo.posX + mo.width &&
      this.posX + this.width - offsetX > mo.posX &&
      this.posY + offsetY < mo.posY + mo.height &&
      this.posY + this.height > mo.posY
    );
  }

  // startWalkAnimation(images) {
  //   this.walkInterval = setInterval(() => {
  //     if (this.isDead()) {
  //       this.stopWalkAnimation();
  //     } else {
  //       this.playAnimation(images);
  //     }
  //   }, 100);
  // }

  // stopWalkAnimation() {
  //   if (this.walkInterval) {
  //     clearInterval(this.walkInterval);
  //     this.walkInterval = null;
  //   }
  // }

  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  hit(damage) {
    const now = new Date().getTime();
    const timePassed = now - this.lastHit;

    if (timePassed > 1500 || !this.lastHit) {
      this.energy -= damage;
      if (this.energy < 0) {
        this.energy = 0;
      }
      this.lastHit = now;
    }
  }

  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit;
    timepassed = timepassed / 1500;
    return timepassed < 1;
  }

  isDead() {
    return this.energy == 0;
  }

  async playDeathAnimationOnce() {
    if (this.deathAnimationPlayed) return;
    this.deathAnimationPlayed = true;

    for (let i = 0; i < this.IMAGES_DEAD.length; i++) {
      this.loadImg(this.IMAGES_DEAD[i]);
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  }

  applyGravity() {
    this.gravityInterval = setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.posY -= this.speedY;
        this.speedY -= this.acceleration;
      } else {
        this.speedY = 0;
        this.posY = 210;
      }
    }, 1000 / 25);
  }

  stopGravity() {
    if (this.gravityInterval) {
      clearInterval(this.gravityInterval);
      this.gravityInterval = null;
    }
  }

  isAboveGround() {
    if (this.constructor.name === "ThrowableObject") {
      return true;
    } else {
      return this.posY < 210;
    }
  }
}
