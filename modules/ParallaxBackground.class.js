export default class ParallaxBackground {
  constructor(path, offsetX, speed) {
    this.path = path;
    this.offsetX = offsetX;
    this.speed = speed; // Geschwindigkeit für diese Schicht
    this.image = new Image();
    this.image.src = path;
  }
}
