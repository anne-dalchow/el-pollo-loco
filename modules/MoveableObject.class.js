import DrawableObject from "./DrawableObject.class.js";

/**
 * @class MoveableObject - A class that represents movable objects in the game.
 * Inherits from the DrawableObject class and adds movement and collision functionality.
 */
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

  /**
   * @method isColliding - Checks if the object is colliding with another object.
   * @param {MoveableObject} mo - The object to check for collision with.
   * @param {number} [offsetX=0] - The offset to apply on the X-axis for collision detection.
   * @param {number} [offsetY=0] - The offset to apply on the Y-axis for collision detection.
   * @returns {boolean} - True if the object is colliding with the other object, false otherwise.
   */
  isColliding(mo, offsetX = 0, offsetY = 0) {
    return (
      this.posX + offsetX < mo.posX + mo.width &&
      this.posX + this.width - offsetX > mo.posX &&
      this.posY + offsetY < mo.posY + mo.height &&
      this.posY + this.height > mo.posY
    );
  }

  /**
   * @method canMoveRight - Checks if the object can move right based on control input and position.
   * @returns {boolean} - True if the object can move right, false otherwise.
   */
  canMoveRight() {
    return this.controls.right && this.posX < 5500;
  }

  /**
   * @method canMoveLeft - Checks if the object can move left based on control input and position.
   * @returns {boolean} - True if the object can move left, false otherwise.
   */
  canMoveLeft() {
    return this.controls.left && this.posX > 0;
  }

  /**
   * @method canJump - Checks if the object can jump based on control input and its ground status.
   * @returns {boolean} - True if the object can jump, false otherwise.
   */
  canJump() {
    return this.controls.up && !this.isAboveGround() && !this.jumpKeyPressed;
  }

  /**
   * @method moveRight - Moves the object to the right by the specified speed.
   * @param {number} speed - The speed at which the object moves to the right.
   */
  moveRight(speed) {
    this.posX += speed;
    this.otherDirection = false;
  }

  /**
   * @method moveLeft - Moves the object to the left by the specified speed.
   * @param {number} speed - The speed at which the object moves to the left.
   */
  moveLeft(speed) {
    this.posX -= speed;
    this.otherDirection = true;
  }

  /**
   * @method playAnimation - Plays the animation by cycling through a series of images.
   * @param {Array<string>} images - An array of image paths used for the animation.
   */
  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  /**
   * @method hit - Applies damage to the object and updates its energy. It ensures damage is only applied once every 1500ms.
   * @param {number} damage - The amount of damage to be subtracted from the object's energy.
   */
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

  /**
   * @method isHurt - Checks if the object is currently hurt, based on time since the last hit.
   * @returns {boolean} - True if the object is hurt, false if enough time has passed since the last hit.
   */
  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit;
    timepassed = timepassed / 1500;
    return timepassed < 1;
  }

  /**
   * @method isDead - Checks if the object is dead by comparing its energy to zero.
   * @returns {boolean} - True if the object is dead (energy is 0), false otherwise.
   */
  isDead() {
    return this.energy == 0;
  }

  /**
   * @method playDeathAnimationOnce - Plays the death animation once.
   * This animation is only played once per object to avoid repeating it.
   * It iterates over the `IMAGES_DEAD` array and updates the object's image at intervals.
   */
  async playDeathAnimationOnce() {
    if (this.deathAnimationPlayed) return;
    this.deathAnimationPlayed = true;

    for (let i = 0; i < this.IMAGES_DEAD.length; i++) {
      this.loadImg(this.IMAGES_DEAD[i]);
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  }

  /**
   * @method applyGravity - Applies gravity to the object by updating its position and speed.
   * It decreases the speed on every interval and moves the object downward until it reaches the ground.
   */
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

  /**
   * @method stopGravity - Stops the gravity effect by clearing the gravity interval.
   */
  stopGravity() {
    if (this.gravityInterval) {
      clearInterval(this.gravityInterval);
      this.gravityInterval = null;
    }
  }

  /**
   * @method isAboveGround - Checks if the object is above the ground.
   * For objects of type `ThrowableObject`, it always returns true. For other objects, it checks if the Y-position is above a certain threshold (210).
   * @returns {boolean} - True if the object is above the ground, false otherwise.
   */
  isAboveGround() {
    if (this.constructor.name === "ThrowableObject") {
      return true;
    } else {
      return this.posY < 210;
    }
  }

  /**
   * @method isInactive - Checks if the object is inactive (not moving, not jumping, not hurt, and energy is 0).
   * @returns {boolean} - Returns true if the object is inactive, false otherwise.
   */
  isInactive() {
    return (
      !this.isAboveGround() &&
      !this.isWalking &&
      !this.isJumping &&
      !this.isHurt() &&
      !this.energy == 0
    );
  }

  /**
   * @method stopAllAnimationsAndSounds - Stops all animations and sounds for the object.
   * This method serves as a common interface, delegating the actual functionality to the subclasses.
   */
  stopAllAnimationsAndSounds() {
    this.stopAllAnimations();
    this.stopAllSounds();
  }

  /**
   * @method stopAllAnimations - Stops all animations associated with the object.
   * This method is a placeholder and is intended to be implemented in subclasses.
   */
  stopAllAnimations() {}

  /**
   * @method stopAllSounds - Stops all sounds associated with the object.
   * This method is a placeholder and is intended to be implemented in subclasses.
   */
  stopAllSounds() {}
}
