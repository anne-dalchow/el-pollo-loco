import DrawableObject from "./DrawableObject.class.js";

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

  constructor() {
    super();
    this.loadImages(this.IMAGES_COINS);
    this.posX = 10;
    this.posY = 50;
    this.setPercentage(0);
  }

  setPercentage(percentage) {
    this.percentage = percentage; // => 0 ... 5
    let path = this.IMAGES_COINS[this.resolveImageIndex()];
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
