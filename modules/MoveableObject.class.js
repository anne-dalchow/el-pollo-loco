import DrawableObject from "./DrawableObject.class.js";

export default class MoveableObject extends DrawableObject {
  otherDirection = false;
  speedY = 0;
  acceleration = 2.5;
  energy = 100;
  lastHit = 0;

  playAnimation(images) {
    let i = this.currentImage % images.length; // let i = 0,1,2,3,4,5,0,1,2,3,4,5,....
    let path = images[i];
    this.img = this.imageCache[path]; // Bild aus dem Cache holen
    this.currentImage++;
  }

  isColliding(mo) {
    return (
      this.posX + this.width > mo.posX &&
      this.posY + this.height > mo.posY &&
      this.posX < mo.posX &&
      this.posY < mo.posY + mo.height
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
    timepassed = timepassed / 1000; // difference in sec
    return timepassed < 1;
  }

  isDead() {
    return this.energy == 0;
  }

  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.posY -= this.speedY;
        this.speedY -= this.acceleration;
      } else {
        this.speedY = 0; // Stoppe die Geschwindigkeit, wenn am Boden
        this.posY = 145; // Setze auf Bodenhöhe zurück, falls leicht darunter
      }
    }, 1000 / 25);
  }

  isAboveGround() {
    return this.posY < 145;
  }
}
