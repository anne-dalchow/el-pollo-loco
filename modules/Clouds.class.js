import MoveableObject from "./MoveableObject.class.js";

/**
 * @class Clouds - Represents clouds that move in the background.
 * @extends MoveableObject - Inherits from the MoveableObject class.
 */
export default class Clouds extends MoveableObject {
  posY = 50;
  width = 400;
  height = 300;

  /**
   * @constructor - Initializes the Cloud object and loads the cloud image.
   */
  constructor() {
    super();
    this.loadImg("assets/img/5_background/layers/4_clouds/1.png");
    this.posX = Math.random() * 5593;
  }

  /**
   * @method startMoving - Starts the movement with random speed.

   */
  startMoving() {
    let randomSpeed = 0.15 + Math.random() * 0.15;
    this.moveLeft(randomSpeed, -799);
  }

  /**
   * @method moveLeft - Moves the object to the left until it reaches a specified point.
   * @param {number} speed - The speed of the movement.
   * @param {number} end - The endpoint where the movement stops.
   */
  moveLeft(speed, end) {
    this.moveInterval = setInterval(() => {
      if (this.posX > end) {
        this.posX -= speed;
      } else {
        this.posX = 800;
      }
    }, 1000 / 60);
  }
}
