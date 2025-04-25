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
    const randomSpeed = 0.75 + Math.random()*1;
    this.loadImages(this.IMAGES_WALKING);
    this.walkingAnimation();
    this.moveLeft(randomSpeed, -60);
  }
}
