import DrawableObject from "./DrawableObject.class.js";

/**
 * @class BottleBar - Represents a bottle status bar in the game.
 * @extends DrawableObject
 */
export default class BottleBar extends DrawableObject {
  IMAGES_BOTTLE = [
    "assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png",
    "assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png",
    "assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png",
    "assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png",
    "assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png",
    "assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png",
  ];

  percentage = 100;
  width = 165;
  height = 45;

  /**
   * @constructor - Initializes the BottleBar with the default position and percentage.
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES_BOTTLE);
    this.posX = 10;
    this.posY = 90;
    this.setPercentage(0);
  }

  /**
   * @method setPercentage - Sets the percentage of the bottle and updates the displayed image.
   * @param {number} percentage - The percentage value (0 to 100).
   */
  setPercentage(percentage) {
    this.percentage = percentage; // => 0 ... 5
    let path = this.IMAGES_BOTTLE[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  /**
   * @method resolveImageIndex - Resolves the image index based on the percentage value.
   * @returns {number} - The index of the image corresponding to the current percentage.
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
