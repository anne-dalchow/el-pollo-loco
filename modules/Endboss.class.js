import {
  IMAGES_WALKING,
  IMAGES_ALERT,
  IMAGES_ATTACK,
  IMAGES_HURT,
  IMAGES_DEAD,
} from "../levels/endbossImages.js";
import MoveableObject from "./MoveableObject.class.js";

export default class Endboss extends MoveableObject {
  constructor(world, character) {
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
    this.world = world;
    this.character = character;
    this.posX = 7 * 799;

    this.isDead = false;
    this.isHurt = false;
    this.isAttacking = false;
    this.isWalking = false;

    this.isEndbossTriggered = false;
    this.isCharacterFrozen = false;
    this.inputLocked = false;

    this.endbossSound = new Audio("assets/audio/endboss.wav");

    this.startAnimationLoop();
  }

  posY = 50;
  width = 300;
  height = 400;

  // startAnimationLoop() {
  //   this.animationInterval = setInterval(() => {
  //     if (this.isDead) {
  //       this.playAnimation(this.IMAGES_DEAD);
  //     } else if (this.isHurtAnimation || this.isHurt) {
  //       this.playAnimation(this.IMAGES_HURT);
  //     } else if (this.isAttacking) {
  //       this.playAnimation(this.IMAGES_ATTACK);
  //     }
  //   }, 150);
  // }
  startAnimationLoop() {
    this.animationInterval = setInterval(() => {
      if (this.isDead) {
        this.playAnimation(this.IMAGES_DEAD);
      } else if (this.isHurtAnimation || this.isHurt) {
        this.playAnimation(this.IMAGES_HURT);
      } else if (this.isAttacking) {
        this.playAnimation(this.IMAGES_ATTACK);
      } else if (this.isWalking) {
        this.playAnimation(this.IMAGES_WALKING);
      } else {
        this.playAnimation(this.IMAGES_ALERT);
      }
    }, 100);
  }

  startAnimationEndboss(world, character) {
    this.visible = true;

    const END_BOSS_TARGET_X = 4700;

    if (this.isEndbossTriggered || !this.visible) return;
    this.isEndbossTriggered = true;

    this.walkInterval = setInterval(() => {
      if (this.posX > END_BOSS_TARGET_X) {
        this.posX -= 5;
        this.isWalking = true;
      } else {
        clearInterval(this.walkInterval);
        this.isWalking = false;
      }

      // Einfrieren des Charakters, wenn der Endboss die Position erreicht hat
      if (character.posX >= 4400 && !this.isCharacterFrozen) {
        character.freeze();
        this.isCharacterFrozen = true;

        if (world.backgroundSound && !world.backgroundSound.paused) {
          this.stopBackgroundSound(world);
        }
        this.playEndbossSound();
        character.stopAllAnimationsAndSounds();
        this.freezeCharacter(character);
      }
    }, 90);
  }

  stopBackgroundSound(world) {
    world.backgroundSound.pause();
    world.backgroundSound.currentTime = 0;
  }

  playEndbossSound() {
    this.endbossSound.volume = 0.2;
    this.endbossSound.loop = true;
    this.endbossSound.play().catch((e) => {
      console.warn("Endboss-Sound konnte nicht gestartet werden:", e);
    });
  }

  freezeCharacter(character) {
    setTimeout(() => {
      character.unfreeze();
      this.startFight();
    }, 10000);
  }

  startFight() {
    world.endbossBar.isVisible = true;
    this.showFightBanner();
    this.isAttacking = true;
  }

  showFightBanner() {
    const fightBanner = document.getElementById("fight-banner");
    fightBanner.style.animation = "fight-blink 1s ease-in-out";

    setTimeout(() => {
      fightBanner.style.animation = "none";
    }, 2000);
  }

  hit(damage = 20) {
    super.hit(damage);

    this.isAttacking = false;
    this.isHurtAnimation = true;

    setTimeout(() => {
      this.isHurtAnimation = false;
      this.isAttacking = true;
    }, 400);
  }

  die() {
    this.isDead = true;
    this.isWalking = false;
    this.isAttacking = false;
    this.isHurt = false;
    clearInterval(this.walkInterval);
    clearInterval(this.animationInterval);
  }
}
