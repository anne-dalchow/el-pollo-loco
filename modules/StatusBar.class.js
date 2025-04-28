import DrawableObject from "./DrawableObject.class.js";

export default class StatusBar extends DrawableObject {
  IMAGES_HEALTH = [
    "assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png", // 0
    "assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png",
    "assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png",
    "assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png",
    "assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png",
    "assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png", //5
  ];

  percentage = 100;
  width = 160;
  height = 50;

  constructor() {
    super();
    this.loadImages(this.IMAGES_HEALTH);
    this.posX = 10;
    this.posY = 10;
    this.setPercentage(100);
  }

  setPercentage(percentage) {
    this.percentage = percentage; // => 0 ... 5
    let path = this.IMAGES_HEALTH[this.resolveImageIndex()];
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
