import MoveableObject from "./MoveableObject.class.js";

export default class Endboss extends MoveableObject {
  posY = 40;
  width = 300;
  height = 400;
  IMAGES_WALKING = [
    "assets/img/4_enemie_boss_chicken/2_alert/G5.png",
    "assets/img/4_enemie_boss_chicken/2_alert/G6.png",
    "assets/img/4_enemie_boss_chicken/2_alert/G7.png",
    "assets/img/4_enemie_boss_chicken/2_alert/G8.png",
    "assets/img/4_enemie_boss_chicken/2_alert/G9.png",
    "assets/img/4_enemie_boss_chicken/2_alert/G10.png",
    "assets/img/4_enemie_boss_chicken/2_alert/G11.png",
    "assets/img/4_enemie_boss_chicken/2_alert/G12.png",
  ];

  constructor() {
    super();
    this.loadImg("assets/img/4_enemie_boss_chicken/2_alert/G5.png");
    this.loadImages(this.IMAGES_WALKING);
    this.posX = 700;

    this.endbossWalkAnimation();
    // this.moveLeft(randomSpeed, -60);
  }

  endbossWalkAnimation() {
    const animate = () => {
      this.playAnimation(this.IMAGES_WALKING);
      setTimeout(() => {
        requestAnimationFrame(animate);
      }, 100);
    };
    requestAnimationFrame(animate);
  }
}
