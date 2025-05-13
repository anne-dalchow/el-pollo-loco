import MoveableObject from "./MoveableObject.class.js";

const COIN_FRAME_WIDTHS = {
  "Gold_21.png": 28,
  "Gold_22.png": 26,
  "Gold_23.png": 24,
  "Gold_24.png": 22,
  "Gold_25.png": 20,
  "Gold_26.png": 20,
  "Gold_27.png": 22,
  "Gold_28.png": 24,
  "Gold_29.png": 26,
  "Gold_30.png": 28,
};

/**
 * @class Coins - Represents a coin that moves and animates in the game.
 * @extends MoveableObject - Inherits from the MoveableObject class.
 */
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

  /**
   * @constructor - Initializes the coin with a random position and starts the animation.
   */
  constructor() {
    super();
    this.posY = 80 + Math.random() * 300;
    this.posX = 50 + Math.random() * 3000;
    this.height = 33;
    this.width = 28;
    this.loadImg(this.IMAGES_COINS[0]);
    this.loadImages(this.IMAGES_COINS);
    this.coinAnimation();
  }

  /**
   * @method adjustWidth - Adjusts the width of the coin based on the current image.
   * @param {string} currentImage - The name of the current image file.
   */
  adjustWidth(currentImage) {
    const currentFile = currentImage.split("/").pop();
    this.width = COIN_FRAME_WIDTHS[currentFile] || 28;
  }

  /**
   * @method coinAnimation - Starts the animation for the coin and adjusts its width after each frame.
   */
  coinAnimation() {
    this.coinIntervall = setInterval(() => {
      this.playAnimation(this.IMAGES_COINS);

      const currentImage = this.img.src.split("/").pop();
      this.adjustWidth(currentImage);
    }, 1000 / 15);
  }
}
