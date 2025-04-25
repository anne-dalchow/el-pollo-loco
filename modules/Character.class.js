import MoveableObject from "./MoveableObject.class.js";

export default class Character extends MoveableObject {
  height = 280;
  width = 150;
  posX = 80;
  posY = 160;
  IMAGES_WALKING = [
    "assets/img/2_character_pepe/2_walk/W-21.png",
    "assets/img/2_character_pepe/2_walk/W-22.png",
    "assets/img/2_character_pepe/2_walk/W-23.png",
    "assets/img/2_character_pepe/2_walk/W-24.png",
    "assets/img/2_character_pepe/2_walk/W-25.png",
    "assets/img/2_character_pepe/2_walk/W-26.png",
  ];

  constructor(keyboard) {
    super();
    this.loadImg("assets/img/2_character_pepe/2_walk/W-21.png");
    this.loadImages(this.IMAGES_WALKING);
    // this.walkingAnimation();
    this.keyboard = keyboard;
    this.isWalking = false; // Flagge für laufende Animation
  }

  move() {
    if (this.keyboard.right) {
      this.posX += 5;

      // Animation starten, wenn sie noch nicht läuft
      if (!this.isWalking) {
        this.walkingAnimation(); // Animation starten
        this.isWalking = true;   // Animation als laufend markieren
      }
    } else if (this.keyboard.left) {
      this.posX -= 5;

      // Animation starten, wenn sie noch nicht läuft
      if (!this.isWalking) {
        this.walkingAnimation(); // Animation starten
        this.isWalking = true;   // Animation als laufend markieren
      }
    } else {
      // Stoppen der Animation, wenn keine Pfeiltaste gedrückt wird
      if (this.isWalking) {
        this.isWalking = false; 
      }
    }

    if (this.keyboard.up) {
      this.posY -= 5;
    }
  }

  walkingAnimation() {
    const animate = () => {
      let i = this.currentImage % this.IMAGES_WALKING.length;
      let path = this.IMAGES_WALKING[i];
      this.img = this.imageCache[path]; // Bild aus dem Cache holen
      this.currentImage++;

      setTimeout(() => {
        if (this.isWalking) { // Animation nur fortsetzen, wenn der Charakter läuft
          requestAnimationFrame(animate);
        }
      }, 100);
    };

    requestAnimationFrame(animate);
  }
}
