import DrawableObject from "./DrawableObject.class.js";

/**
 * @class CoinBar - Represents a coin bar that visually displays the amount of coins.
 * @extends DrawableObject - Inherits from the DrawableObject class.
 */
export default class CoinBar extends DrawableObject {
  IMAGES_COINS = [
    "assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png",
    "assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png",
    "assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png",
    "assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png",
    "assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png",
    "assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png",
  ];

  percentage = 100;
  width = 165;
  height = 45;

  /**
   * @constructor - Initializes the CoinBar with its images and default position.
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES_COINS);
    this.posX = 10;
    this.posY = 50;
    this.setPercentage(0);
  }

  /**
   * @method setPercentage - Sets the percentage of the coin bar and updates the displayed image.
   * @param {number} percentage - The percentage to display (0 to 100).
   */
  setPercentage(percentage) {
    this.percentage = percentage; // => 0 ... 5
    let path = this.IMAGES_COINS[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  /**
   * @method resolveImageIndex - Determines the appropriate image index based on the percentage.
   * @returns {number} The index of the image to display.
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
