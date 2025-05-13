import MoveableObject from "./MoveableObject.class.js";

/**
 * @class Enemies - Represents an enemy character in the game.
 * @extends MoveableObject - Inherits from the MoveableObject class, allowing movement functionality.
 */
export default class Enemies extends MoveableObject {
  /**
   * @constructor - Initializes the enemy object with images, size, and sound manager.
   * @param {string[]} imagesWalking - Array of images representing the walking animation.
   * @param {string} imageDead - Image representing the enemy when dead.
   * @param {number} posY - The vertical position of the enemy.
   * @param {number} width - The width of the enemy.
   * @param {number} height - The height of the enemy.
   * @param {object} soundManager - Sound manager to prepare and play sound effects.
   */
  constructor(imagesWalking, imageDead, posY, width, height, soundManager) {
    super();
    this.posY = posY;
    this.width = width;
    this.height = height;
    this.IMAGES_WALKING = imagesWalking;
    this.IMAGE_DEAD = imageDead;
    this.isDead = false;
    this.soundManager = soundManager;

    this.dieingSoundPath = "assets/audio/damage.mp3";
    this.soundManager.prepare(this.dieingSoundPath, 0.4);

    this.loadImg(imagesWalking[0]);
    this.loadImages(imagesWalking);
  }

  /**
   * @method startMoving - Starts the movement of the enemy by randomly setting the speed and playing the walking animation.
   */
  startMoving() {
    let randomSpeed = 0.5 + Math.random() * 0.5;
    this.chickenWalkAnimation();
    this.moveLeft(randomSpeed, -60);
  }

  /**
   * @method chickenWalkAnimation - Plays the walking animation at regular intervals while the enemy is not dead.

   */
  chickenWalkAnimation() {
    this.walkInterval = setInterval(() => {
      !this.isDead
        ? this.playAnimation(this.IMAGES_WALKING)
        : clearInterval(this.walkInterval);
    }, 100);
  }

  /**
   * @method moveLeft - Moves the enemy to the left at a specified speed until a given endpoint.
   * @param {number} speed - The speed at which the enemy moves.
   * @param {number} end - The x-position at which the enemy should stop.
   */
  moveLeft(speed, end) {
    this.moveInterval = setInterval(() => {
      if (!this.isDead) {
        this.posX > end ? (this.posX -= speed) : (this.posX = 800);
      } else {
        clearInterval(this.moveInterval);
      }
    }, 1000 / 60);
  }

  die() {
    this.isDead = true;
    this.loadImg(this.IMAGE_DEAD);
    this.soundManager.play(this.dieingSoundPath);
    this.speed = 0;
  }
}
