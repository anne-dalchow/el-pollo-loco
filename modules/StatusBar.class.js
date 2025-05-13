import DrawableObject from "./DrawableObject.class.js";

/**
 * @class StatusBar - A class that represents the health status bar in the game.
 * It displays the player's health as an image based on the percentage.
 * Inherits from the DrawableObject class and manages the display and update of the health bar.
 */
export default class StatusBar extends DrawableObject {
  /**
   * @constant IMAGES_HEALTH - An array of image paths representing different levels of health.
   * Each image corresponds to a specific percentage of health.
   * @type {string[]}
   */
  IMAGES_HEALTH = [
    "assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png", // 0
    "assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/20.png",
    "assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png",
    "assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png",
    "assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png",
    "assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png", //5
  ];

  percentage = 100;
  width = 165;
  height = 45;

  /**
   * @constructor - Initializes the status bar with the health images, position, and sets the health to 100%.
   * @memberof StatusBar
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES_HEALTH);
    this.posX = 10;
    this.posY = 10;
    this.setPercentage(100);
  }

  /**
   * @method setPercentage - Updates the health percentage and sets the corresponding image for the health bar.
   * @param {number} percentage - The new health percentage, where 0 is empty and 100 is full health.
   */
  setPercentage(percentage) {
    this.percentage = percentage; // => 0 ... 5
    let path = this.IMAGES_HEALTH[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  /**
   * @method resolveImageIndex - Determines the image index based on the current health percentage.
   * @returns {number} - The index of the image in the IMAGES_HEALTH array corresponding to the health percentage.
   */
  resolveImageIndex() {
    if (this.percentage == 100) {
      return 5;
    } else if (this.percentage > 80) {
      return 4;
    } else if (this.percentage > 60) {
      return 3;
    } else if (this.percentage > 40) {
      return 2;
    } else if (this.percentage > 20) {
      return 1;
    } else {
      return 0;
    }
  }
}
