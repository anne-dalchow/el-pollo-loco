import MoveableObject from "./MoveableObject.class.js";

export default class Chicken extends MoveableObject {
  posY = 350;
  width = 80;
  height = 80;
  IMAGES_WALKING = [
    "assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "assets/img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "assets/img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
  ];

  constructor() {
    super();
    this.loadImg("assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png");
    this.posX = 250 + Math.random() * 500;
    const randomSpeed = 0.5 + Math.random()* 0.5;
    this.loadImages(this.IMAGES_WALKING);
    this.chickenWalkAnimation();
    this.moveLeft(randomSpeed, -60);
  }

  chickenWalkAnimation() {
    const animate = () => {
      let i = this.currentImage % this.IMAGES_WALKING.length;       // let i = 0,1,2,3,4,5,0,1,2,3,4,5,....
      let path = this.IMAGES_WALKING[i];
      this.img = this.imageCache[path]; // Bild aus dem Cache holen
      this.currentImage++;

      /**
       * Walking Animation: gezielte Verzögerung (600ms), um jedes Bild für eine bestimmte Zeit anzuzeigen -> deshalb setTimeout zusammen mit requestAnimationFrame, um Bildwechsel nach der gewünschten Zeit zu steuern.
       */
      setTimeout(() => {
        requestAnimationFrame(animate);
      }, 100);
    };

    requestAnimationFrame(animate);
  }
}
