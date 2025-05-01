import MoveableObject from "./MoveableObject.class.js";

export default class Coins extends MoveableObject {
  IMAGES_COINS = [
    "assets/img/8_coin/Gold_21.png",
    "assets/img/8_coin/Gold_22.png",
    "assets/img/8_coin/Gold_23.png",
    "assets/img/8_coin/Gold_24.png",
    "assets/img/8_coin/Gold_25.png",
    "assets/img/8_coin/Gold_26.png",
    "assets/img/8_coin/Gold_27.png",
    "assets/img/8_coin/Gold_28.png",
    "assets/img/8_coin/Gold_29.png",
    "assets/img/8_coin/Gold_30.png",
  ];

  constructor() {
    super();
    this.posY = 50 + Math.random() * 250;
    this.posX = 50 + Math.random() * 3000;
    this.height = 35;
    this.width = 30;
    this.loadImg("assets/img/8_coin/Gold_21.png");
    this.loadImages(this.IMAGES_COINS);
    this.coinAnimation();
  }

  coinAnimation() {
    this.coinIntervall = setInterval(() => {
      this.playAnimation(this.IMAGES_COINS);
    }, 1000 / 15);
  }
}
