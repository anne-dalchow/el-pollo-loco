import MoveableObject from "./MoveableObject.class.js";

/**
 * @class BackgroundObject - Represents a background object in the game world.
 * @extends MoveableObject
 */
export default class BackgroundObject extends MoveableObject {
  width = 800;
  height = 480;

  /**
   * @constructor
   * @param {string} imagePath - The path to the background image.
   * @param {number} posX - The horizontal position of the background object.
   * @param {number} [posY=480 - height] - The vertical position of the background object (defaults to the bottom).
   */
  constructor(imagePath, posX, posY) {
    super().loadImg(imagePath);
    this.posX = posX;
    this.posY = posY !== undefined ? posY : 480 - this.height;
  }
}
