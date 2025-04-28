import MoveableObject from "./MoveableObject.class.js";

export default class Chicken extends MoveableObject {
  posY = 340;
  width = 80;
  height = 80;
  IMAGES_WALKING = [
    "assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "assets/img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "assets/img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
  ];

  constructor() {
    super();
    let randomSpeed = 0.5 + Math.random() * 0.5;

    this.loadImg("assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png");
    this.loadImages(this.IMAGES_WALKING);
    this.posX = 250 + Math.random() * 500;

    this.chickenWalkAnimation();
    this.moveLeft(randomSpeed, -60);
  }

  chickenWalkAnimation() {
    const animate = () => {
      this.playAnimation(this.IMAGES_WALKING);
      /**
       * Walking Animation: gezielte Verzögerung (600ms), um jedes Bild für eine bestimmte Zeit anzuzeigen -> deshalb setTimeout zusammen mit requestAnimationFrame, um Bildwechsel nach der gewünschten Zeit zu steuern.
       */
      setTimeout(() => {
        requestAnimationFrame(animate);
      }, 100);
    };

    requestAnimationFrame(animate);
  }

  moveLeft(speed, end) {
    const animate = () => {
      if (this.posX > end) {
        this.posX -= speed;
      } else {
        this.posX = 800;
      }

      /**animate-Funktion: konstante Bewegung ohne zeitliche Verzögerung -> daher ohne Pausen/setTimeout */
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }
}
