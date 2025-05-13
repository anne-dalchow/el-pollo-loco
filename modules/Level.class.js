/**
 * @class Level - Represents a level in the game.
 * Contains all elements like enemies, clouds, background objects, coins, and bottles.
 */
export class Level {
  /**
   * @property {Array} enemies - An array of enemy objects in the level.
   * @property {Array} clouds - An array of cloud objects in the level.
   * @property {Array} backgroundObjects - An array of background objects like scenery or obstacles.
   * @property {Array} coins - An array of coin objects in the level.
   * @property {Array} bottles - An array of bottle objects in the level.
   * @property {number} levelEndPosX - The x-position of the level's end. Defaults to 7 * 799.
   */
  enemies;
  clouds;
  backgroundObjects;
  coins;
  bottles;
  levelEndPosX = 7 * 799;

  /**
   * @constructor - Initializes a new level with enemies, clouds, background objects, coins, and bottles.
   * @param {Array} enemies - The list of enemies in the level.
   * @param {Array} clouds - The list of clouds in the level.
   * @param {Array} backgroundObjects - The list of background objects in the level.
   * @param {Array} [coins=[]] - The list of coins in the level (defaults to an empty array).
   * @param {Array} [bottles=[]] - The list of bottles in the level (defaults to an empty array).
   */
  constructor(enemies, clouds, backgroundObjects, coins = [], bottles = []) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.coins = coins;
    this.bottles = bottles;
  }
}
