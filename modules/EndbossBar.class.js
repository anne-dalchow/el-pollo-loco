import DrawableObject from "./DrawableObject.class.js";

/**
 * @class EndbossBar - Represents a status bar that visually displays the health of the endboss.
 * @extends DrawableObject - Inherits from the DrawableObject class.
 */
export default class EndbossBar extends DrawableObject {
  /**
   * @property {string[]} IMAGES_EndbossBar - Array of image paths representing different health levels for the endboss.
   */
  IMAGES_EndbossBar = [
    "assets/img/7_statusbars/2_statusbar_endboss/blue/blue0.png",
    "assets/img/7_statusbars/2_statusbar_endboss/blue/blue20.png",
    "assets/img/7_statusbars/2_statusbar_endboss/blue/blue40.png",
    "assets/img/7_statusbars/2_statusbar_endboss/blue/blue60.png",
    "assets/img/7_statusbars/2_statusbar_endboss/blue/blue80.png",
    "assets/img/7_statusbars/2_statusbar_endboss/blue/blue100.png",
  ];

  percentage = 100;
  width = 165;
  height = 45;
  isVisible = false;

  /**
   * @constructor - Initializes the EndbossBar with its images, default position, and full health.
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES_EndbossBar);
    this.posX = 620;
    this.posY = 50;
    this.setPercentage(100);
  }

  /**
   * @method setPercentage - Sets the percentage of the endboss's health and updates the displayed image.
   * @param {number} percentage - The health percentage to display (0 to 100).
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    let path = this.IMAGES_EndbossBar[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  /**
   * @method resolveImageIndex - Determines the appropriate image index based on the percentage.
   * @returns {number} The index of the image to display based on the health percentage.
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
