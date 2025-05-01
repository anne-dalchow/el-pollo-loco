import MoveableObject from "./MoveableObject.class.js";

export default class BackgroundObject extends MoveableObject {
  width = 800;
  height = 480;

  constructor(imagePath, posX, posY) {
    super().loadImg(imagePath);
    this.posX = posX;
    this.posY = posY !== undefined ? posY : 480 - this.height;
  }
}
