import MoveableObject from "./MoveableObject.class.js";

export default class BackgroundObject extends MoveableObject {
  constructor(imagePath, posX, posY) {
    super().loadImg(imagePath);
    this.width = 800;
    this.height = 450;
    this.posX = posX;
    this.posY = posY !== undefined ? posY : 480 - this.height;
  }
}
