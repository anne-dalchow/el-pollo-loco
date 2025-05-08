import {
  IMAGES_WALKING,
  IMAGES_ALERT,
  IMAGES_ATTACK,
  IMAGES_HURT,
  IMAGES_DEAD,
} from "../levels/endbossImages.js";
import MoveableObject from "./MoveableObject.class.js";

export default class Endboss extends MoveableObject {
  constructor(world, character, soundManager) {
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

    this.inFightSequence = false;
    this.isDead = false;
    this.isHurt = false;
    this.isAttacking = false;
    this.isWalking = false;

    this.isEndbossTriggered = false;
    this.isCharacterFrozen = false;
    this.inputLocked = false;

    this.endbossBackgroundSoundPath = "assets/audio/endboss.wav";
    this.endbossBackgroundSound = soundManager.prepare(
      this.endbossBackgroundSoundPath,
      0.2,
      true
    );

    this.startAnimationLoop();
  }

  posY = 50;
  width = 300;
  height = 400;

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
      if (character.posX >= 4350 && !this.isCharacterFrozen) {
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
  }

  playEndbossSound() {
    this.endbossBackgroundSound.play();
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
    setTimeout(() => {
      this.startFightSequence();
    }, 1000);
  }

  showFightBanner() {
    const fightBanner = document.getElementById("fight-banner");
    fightBanner.style.animation = "fight-blink 1s ease-in-out";

    setTimeout(() => {
      fightBanner.style.animation = "none";
    }, 3000);
  }

  startFightSequence() {
    this.inFightSequence = true;
    const walkSpeed = 25;
    const startX = 4750;
    const targetX = 4450;

    this.posX = startX;

    const walkToTarget = () => {
      if (this.isDead) {
        this.die();
        return;
      }

      this.isWalking = true;
      const interval = setInterval(() => {
        if (this.isDead) {
          clearInterval(interval);
          this.die();
          return;
        }
        if (this.posX > targetX) {
          this.posX -= walkSpeed;
        } else {
          clearInterval(interval);
          this.isWalking = false;
          this.playAnimation(this.IMAGES_ALERT);
          setTimeout(startAttack, 1000);
        }
      }, 1000 / 25);
    };

    const startAttack = () => {
      if (this.isDead) {
        this.die();
        return;
      }

      this.isAttacking = true;
      this.playAnimation(this.IMAGES_ATTACK);
      setTimeout(() => {
        if (this.isDead) {
          this.die();
          return;
        } else {
          this.isAttacking = false;
          walkBack();
        }
      }, 1000);
    };

    const walkBack = () => {
      if (this.isDead) {
        this.die();
        return;
      }

      this.isWalking = true;
      const interval = setInterval(() => {
        if (this.isDead) {
          clearInterval(interval);
          this.die();
          return;
        }

        if (this.posX < startX) {
          this.posX += walkSpeed;
        } else {
          clearInterval(interval);
          this.isWalking = false;
          this.playAnimation(this.IMAGES_ALERT);
          setTimeout(() => {
            if (this.isDead) {
              this.die();
              return;
            } else {
              walkToTarget();
            }
          }, 1000);
        }
      }, 1000 / 25);
    };

    walkToTarget();
  }

  hit(damage = 20) {
    super.hit(damage);

    this.isAttacking = false;
    this.isHurtAnimation = true;

    setTimeout(() => {
      this.isHurtAnimation = false;
      this.isAttacking = true;
    }, 600);
  }

  die() {
    this.isDead = true;
    this.isWalking = false;
    this.isAttacking = false;
    this.isHurt = false;

    setInterval(() => {
      this.playAnimation(this.IMAGES_DEAD);
    }, 200);
  }

  stopAllAnimationsAndSounds() {
    // Alle Animationen stoppen

    if (this.walkInterval) clearInterval(this.walkInterval);
    if (this.animationInterval) clearInterval(this.animationInterval);
    if (this.deadInterval) clearInterval(this.deadInterval);

    this.walkInterval = null;
    this.animationInterval = null;
    this.deadInterval = null;

    // Sounds stoppen
    this.endbossBackgroundSound.pause();
  }
}
