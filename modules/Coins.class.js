import MoveableObject from "./MoveableObject.class.js";

// Mapping der Breiten für jedes Bild
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
    this.height = 33;
    this.width = 28; // Standard-Breite
    this.loadImg(this.IMAGES_COINS[0]); // Startbild laden
    this.loadImages(this.IMAGES_COINS);
    this.coinAnimation();
  }

  // Anpassung der Breite je nach Bild
  adjustWidth(currentImage) {
    const currentFile = currentImage.split("/").pop(); // Bildname extrahieren
    this.width = COIN_FRAME_WIDTHS[currentFile] || 28; // Standardbreite, wenn nicht gefunden
  }

  coinAnimation() {
    this.coinIntervall = setInterval(() => {
      this.playAnimation(this.IMAGES_COINS);

      // Bild nach jedem Frame anpassen
      const currentImage = this.img.src.split("/").pop(); // aktuelles Bild
      this.adjustWidth(currentImage);
    }, 1000 / 15);
  }
}
