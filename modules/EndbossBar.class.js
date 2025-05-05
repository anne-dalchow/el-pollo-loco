import DrawableObject from "./DrawableObject.class.js";

export default class EndbossBar extends DrawableObject {
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

  constructor() {
    super();
    this.loadImages(this.IMAGES_EndbossBar);
    this.posX = 620;
    this.posY = 10;
    this.setPercentage(100);
  }

  setPercentage(percentage) {
    this.percentage = percentage; // => 0 ... 5
    let path = this.IMAGES_EndbossBar[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

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
