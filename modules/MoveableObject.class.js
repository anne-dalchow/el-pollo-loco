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

  startWalkAnimation(images) {
    this.walkInterval = setInterval(() => {
      if (this.isDead()) {
        this.stopWalkAnimation(); // direkt hier abbrechen
      } else {
        this.playAnimation(images);
      }
    }, 100);
  }

  stopWalkAnimation() {
    if (this.walkInterval) {
      clearInterval(this.walkInterval);
      this.walkInterval = null;
    }
  }

  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path]; // Bild aus dem Cache holen
    this.currentImage++;
  }

  isColliding(mo) {
    return (
      this.posX < mo.posX + mo.width &&
      this.posX + this.width > mo.posX &&
      this.posY < mo.posY + mo.height &&
      this.posY + this.height > mo.posY
    );
  }

  hit() {
    this.energy -= 5;
    if (this.energy < 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit;
    timepassed = timepassed / 1000;
    return timepassed < 1;
  }

  isDead() {
    return this.energy == 0;
  }

  applyGravity() {
    this.gravityInterval = setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.posY -= this.speedY;
        this.speedY -= this.acceleration;
      } else {
        this.speedY = 0;
        this.posY = 145;
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
      return this.posY < 145;
    }
  }
}
