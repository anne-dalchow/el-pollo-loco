import Enemies from "./Enemies.class.js";

/**
 * @class BrownChicken - Represents a brown chicken enemy in the game.
 * @extends Enemies - Inherits from the Enemies class.
 */
export default class BrownChicken extends Enemies {
  /**
   * @constructor - Initializes the BrownChicken with its images and sound manager.
   * @param {Object} soundManager - The sound manager for playing sounds associated with the enemy.
   */
  constructor(soundManager) {
    super(
      [
        "assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
        "assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
        "assets/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
      ],
      "assets/img/3_enemies_chicken/chicken_normal/2_dead/dead.png",
      350,
      80,
      80,
      soundManager
    );
  }
}
