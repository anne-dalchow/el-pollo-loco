import {
  IMAGES_WALKING,
  IMAGES_ALERT,
  IMAGES_ATTACK,
  IMAGES_HURT,
  IMAGES_DEAD,
} from "../levels/endbossImages.js";
import MoveableObject from "./MoveableObject.class.js";

export default class Endboss extends MoveableObject {
  posY = 40;
  width = 300;
  height = 400;

  constructor() {
    super();
    this.IMAGES_WALKING = IMAGES_WALKING;
    this.IMAGES_ALERT = IMAGES_ALERT;
    this.IMAGES_ATTACK = IMAGES_ATTACK;
    this.IMAGES_HURT = IMAGES_HURT;
    this.IMAGES_DEAD = IMAGES_DEAD;

    this.posX = 799 * 6;
    this.loadImg("assets/img/4_enemie_boss_chicken/2_alert/G5.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.isDead = false;

    this.endbossWalkAnimation();
  }

  endbossWalkAnimation() {
    this.walkInterval = setInterval(() => {
      if (!this.isDead) {
        this.playAnimation(this.IMAGES_WALKING);
      } else {
        clearInterval(this.walkInterval);
      }
    }, 100);
  }

  endbossAlertAnimation() {
    this.alertInterval = setInterval(() => {
      if (!this.isDead) {
        this.playAnimation(this.IMAGES_ALERT);
      } else {
        clearInterval(this.alertInterval);
      }
    }, 100);
  }

  endbossAttackAnimation() {
    this.attackInterval = setInterval(() => {
      if (!this.isDead) {
        this.playAnimation(this.IMAGES_ATTACK);
      } else {
        clearInterval(this.attackInterval);
      }
    }, 100);
  }

  endbossHurtAnimation() {
    this.hurtInterval = setInterval(() => {
      if (!this.isDead) {
        this.playAnimation(this.IMAGES_HURT);
      } else {
        clearInterval(this.hurtInterval);
      }
    }, 100);
  }

  // TODO World.class.js:108 Uncaught TypeError: enemy.die is not a function
  endbossDeadAnimation() {
    this.deadInterval = setInterval(() => {
      if (this.isDead) {
        this.playAnimation(this.IMAGES_DEAD);
      } else {
        clearInterval(this.deadInterval);
      }
    }, 100);
  }
}
