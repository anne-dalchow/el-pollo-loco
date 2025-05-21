import MoveableObject from "./MoveableObject.class.js";

/**
 * @class ThrowableObject - A class that represents a throwable object (e.g., a bottle).
 * It handles throwing, animating, and breaking the object, and manages sound effects associated with the throwing action.
 * Inherits from the MoveableObject class.
 */
export default class ThrowableObject extends MoveableObject {
  /**
   * @constant IMAGES_BOTTLE - An array of image paths representing the rotating bottle animation.
   * @type {string[]}
   */
  IMAGES_BOTTLE = [
    "assets/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "assets/img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "assets/img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "assets/img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
  ];

  /**
   * @constant IMAGES_BROKEN_BOTTLE - An array of image paths representing the broken bottle animation.
   * @type {string[]}
   */
  IMAGES_BROKEN_BOTTLE = [
    "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
  ];

  width = 60;
  height = 60;

  /**
   * @constructor - Initializes the throwable bottle object with its position, sound manager, and animation images.
   * Optionally throws the bottle and starts its throwing animation.
   * @param {object} soundManager - The sound manager responsible for handling sound effects.
   * @param {number} x - The horizontal position of the bottle.
   * @param {number} y - The vertical position of the bottle.
   * @param {boolean} [shouldThrow=false] - Whether to immediately throw the bottle after initialization.
   * @param {boolean} [otherDirection=false] - Whether the bottle should be thrown in the opposite direction.
   */
  constructor(soundManager, x, y, shouldThrow = false, otherDirection = false) {
    super();
    this.posX = x;
    this.posY = y;
    this.height = 60;
    this.width = 60;
    this.otherDirection = otherDirection;
    this.isBroken = false;
    this.loadImg("assets/img/6_salsa_bottle/2_salsa_bottle_on_ground.png");
    this.loadImages(this.IMAGES_BOTTLE);
    this.loadImages(this.IMAGES_BROKEN_BOTTLE);
    this.soundManager = soundManager;
    this.soundManager.prepareBottleSounds();
    if (shouldThrow) {
      this.throwBottle();
      this.throwBottleAnimation();
    }
  }

  /**
   * @method throwBottleAnimation - Plays the animation of the bottle rotating during the throwing action. Starts the sound effect for throwing and stops the animation when the bottle hits the ground.
   */
  throwBottleAnimation() {
    this.soundManager.playByKey("throw_bottle");
    this.speed = 0;
    this.bottleInterval = setInterval(() => {
      this.playAnimation(this.IMAGES_BOTTLE);
    }, 100);
    if (this.posY > 450) {
      this.stopAllSounds();
    }
  }

  /**
   * @method throwBottle - Handles the movement of the bottle when thrown, applying gravity and updating its position. Stops the animation and movement when the bottle hits the ground.
   */
  throwBottle() {
    this.speedY = 30;
    this.applyGravity();

    this.throwMoveInterval = setInterval(() => {
      let direction = this.otherDirection ? -1 : 1;
      this.posX += 10 * direction;

      if (this.posY >= 420) {
        clearInterval(this.bottleInterval);
        clearInterval(this.throwMoveInterval);

        this.speedY = 0;
      }
    }, 25);
  }

  /**
   * @method brokenBottleAnimation - Plays the animation of the broken bottle, showing the bottle's broken state.
   */
  brokenBottleAnimation() {
    this.brokenBottleInterval = setInterval(() => {
      this.playAnimation(this.IMAGES_BROKEN_BOTTLE);
    }, 100);
  }

  /**
   * @method stopAllSounds - Stops all sound effects and clears the intervals for animation and movement.
   */
  stopAllSounds() {
    clearInterval(this.bottleInterval);
    clearInterval(this.brokenBottleInterval);
    this.soundManager.pauseByKey("throw_bottle");
  }
}
