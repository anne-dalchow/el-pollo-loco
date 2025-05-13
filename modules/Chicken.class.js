import Enemies from "./Enemies.class.js";

/**
 * @class Chicken - Represents a small chicken enemy in the game.
 * @extends Enemies - Inherits from the Enemies class.
 */
export default class Chicken extends Enemies {
  /**
   * @constructor - Initializes the Chicken with its images and sound manager.
   * @param {Object} soundManager - The sound manager for playing sounds associated with the enemy.
   */
  constructor(soundManager) {
    super(
      [
        "assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
        "assets/img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
        "assets/img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
      ],
      "assets/img/3_enemies_chicken/chicken_small/2_dead/dead.png",
      370,
      50,
      50,
      soundManager
    );
  }
}
