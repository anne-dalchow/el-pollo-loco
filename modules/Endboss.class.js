import {
  IMAGES_WALKING,
  IMAGES_ALERT,
  IMAGES_ATTACK,
  IMAGES_HURT,
  IMAGES_DEAD,
} from "../levels/endbossImages.js";
import MoveableObject from "./MoveableObject.class.js";

export default class Endboss extends MoveableObject {
  posY = 50;
  width = 300;
  height = 400;

  constructor() {
    super();
    this.IMAGES_WALKING = IMAGES_WALKING;
    this.IMAGES_ALERT = IMAGES_ALERT;
    this.IMAGES_ATTACK = IMAGES_ATTACK;
    this.IMAGES_HURT = IMAGES_HURT;
    this.IMAGES_DEAD = IMAGES_DEAD;

    this.loadImg("assets/img/4_enemie_boss_chicken/2_alert/G5.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.isDead = false;

    this.posX = 7 * 799;
    this.endbossTriggered = false;
    this.inputLocked = false;
    this.endbossSound = new Audio("assets/audio/endboss.wav");
  }

  startAnimationEndboss(character, cameraX, canvas, world) {
    this.visible = true;

    if (this.triggered || !this.visible) return;
    this.triggered = true;

    const endbossTargetX = 4700;

    this.walkInterval = setInterval(() => {
      if (this.posX > endbossTargetX) {
        this.posX -= 5;
        this.playAnimation(this.IMAGES_WALKING);
      } else {
        clearInterval(this.walkInterval);
        this.endbossAlertAnimation();
      }

      // Einfrieren des Charakters, wenn der Endboss die Position erreicht hat
      if (character.posX >= 4400 && !this.characterWasFrozen) {
        world.characterFrozen = true;
        this.characterWasFrozen = true;
        console.log("Charakter ist eingefroren!");

        // Hintergrundsound stoppen
        if (character.backgroundSound && !character.backgroundSound.paused) {
          character.backgroundSound.pause();
          character.backgroundSound.currentTime = 0;
        }

        // Endboss-Sound starten
        this.endbossSound.volume = 0.2;
        this.endbossSound.loop = true;

        this.endbossSound.play().catch((e) => {
          console.warn("Endboss-Sound konnte nicht gestartet werden:", e);
        });

        this.freezeCharacter(world);
      }
    }, 90);
  }

  freezeCharacter(world) {
    setTimeout(() => {
      world.characterFrozen = false;
      this.startFight();
    }, 1000);
  }
  startFight() {
    console.log("Der Kampf beginnt!");
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
    }, 1000 / 5);
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

  endbossDeadAnimation() {
    this.deadInterval = setInterval(() => {
      if (this.isDead) {
        this.playAnimation(this.IMAGES_DEAD);
      } else {
        clearInterval(this.deadInterval);
      }
    }, 100);
  }

  die() {
    this.isDead = true;
    this.endbossDeadAnimation();
    clearInterval(this.walkInterval); // sicherstellen, dass alle relevanten Intervalle gestoppt werden
    clearInterval(this.alertInterval);
    clearInterval(this.attackInterval);
    clearInterval(this.hurtInterval);
    clearInterval(this.deadInterval);
  }
}
