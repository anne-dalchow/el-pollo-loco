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

  /**
   * Constructor for the Endboss.
   * Loads all necessary images and initializes properties.
   *
   * @param {Object} world - The world where the Endboss appears.
   * @param {Object} character - The character fighting against the Endboss.
   * @param {Object} soundManager - A sound manager to play sounds.
   */
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
    this.isEndbossTriggered = false;
    this.posX = 5500;

    this.initStatusFlags();
    this.initSounds(soundManager);
    this.startAnimationLoop();
  }

  initStatusFlags() {
    this.inFightSequence = false;
    this.isDead = false;
    this.isHurt = false;
    this.isAttacking = false;
    this.isWalking = false;
    this.isCharacterFrozen = false;
    this.inputLocked = false;
  }

  initSounds(soundManager) {
    this.endbossBackgroundSoundPath = "assets/audio/endboss.wav";
    this.endbossBackgroundSound = soundManager.prepare(
      this.endbossBackgroundSoundPath,
      0.2,
      true
    );
    this.endbossHurtSoundPath = "assets/audio/chicken sound.mp3";
    this.endbossHurtSound = soundManager.prepare(
      this.endbossHurtSoundPath,
      1,
      false,
      1.5
    );
  }
  /**
   * Starts the animation loop for the Endboss.
   * Chooses the appropriate animation based on the Endboss's state.
   */
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

  /**
   * Starts the animation for the Endboss when triggered.
   * Moves the Endboss to the starting position and freezes the character if in range.
   *
   * @param {Object} world - The world where the Endboss operates.
   * @param {Object} character - The character fighting the Endboss.
   */
  startAnimationEndboss(world, character) {
    if (this.shouldSkipEndboss()) return;

    this.visible = true;
    this.isEndbossTriggered = true;
    this.startMovingToStartPosition(world, character);
  }

  /**
   * Checks whether the Endboss should be skipped.
   *
   * @returns {boolean} - Returns `true` if the Endboss should not be triggered.
   */
  shouldSkipEndboss() {
    return this.isEndbossTriggered || !this.visible;
  }

  /**
   * Moves the Endboss to the starting position.
   *
   * @param {Object} world - The world where the Endboss operates.
   * @param {Object} character - The character fighting the Endboss.
   */
  startMovingToStartPosition(world, character) {
    const END_BOSS_TARGET_X = 4700;

    this.walkInterval = setInterval(() => {
      if (this.handleIfDead()) return;
      this.moveTowardsTarget(END_BOSS_TARGET_X);
      this.checkCharacterFreeze(world, character);
    }, 90);
  }

  /**
   * Moves the Endboss towards a specific target.
   *
   * @param {number} targetX - The target X position the Endboss is moving towards.
   */
  moveTowardsTarget(targetX) {
    if (this.posX > targetX) {
      this.posX -= 5;
      this.isWalking = true;
    } else {
      clearInterval(this.walkInterval);
      this.isWalking = false;
    }
  }

  /**
   * Checks if the character should be frozen.
   *
   * @param {Object} world - The world where the Endboss operates.
   * @param {Object} character - The character that may be frozen.
   */
  checkCharacterFreeze(world, character) {
    if (character.posX >= 4350 && !this.isCharacterFrozen) {
      this.freezeCharacterInteraction(world, character);
    }
  }

  /**
   * Freezes the character and plays the Endboss sound.
   *
   * @param {Object} world - The world where the Endboss operates.
   * @param {Object} character - The character to be frozen.
   */
  freezeCharacterInteraction(world, character) {
    character.freezeCharacter();
    this.isCharacterFrozen = true;
    if (world.backgroundSound && !world.backgroundSound.paused) {
      this.stopBackgroundSound(world);
    }
    this.playEndbossSound();
    character.stopAllAnimationsAndSounds();

    setTimeout(() => {
      this.startFight();
    }, 10000);
  }

  /**
   * Stops the background sound of the world.
   *
   * @param {Object} world - The world where the background sound should be stopped.
   */
  stopBackgroundSound(world) {
    world.backgroundSound.pause();
  }

  playEndbossSound() {
    this.endbossBackgroundSound.play();
  }

  startFight() {
    this.world.endbossBar.isVisible = true;
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

  /**
   * Checks if the Endboss is dead.
   *
   * @param {Object} interval - The interval to be stopped if the Endboss is dead.
   * @returns {boolean} - Returns `true` if the Endboss is dead.
   */
  handleIfDead(interval) {
    if (this.isDead) {
      clearInterval(interval);
      this.die();
      return true;
    }
    return false;
  }

  /**
   * Checks if the Endboss has reached the target.
   *
   * @param {Object} interval - The interval to be stopped when the target is reached.
   */
  handleReachedTarget(interval) {
    clearInterval(interval);
    this.isWalking = false;
    this.playAnimation(this.IMAGES_ALERT);
  }

  startFightSequence() {
    const walkSpeed = 25;
    const startX = 4750;
    const targetX = 4450;
    this.inFightSequence = true;
    this.posX = startX;
    this.walkToTarget(startX, targetX, walkSpeed);
  }

  /**
   * Moves the Endboss towards the target/character during the fight sequence.
   *
   * @param {number} startX - The starting point of the movement.
   * @param {number} targetX - The target point of the movement.
   * @param {number} walkSpeed - The speed at which the Endboss moves.
   */
  walkToTarget(startX, targetX, walkSpeed) {
    if (this.isDead) return this.die();
    this.isWalking = true;

    const interval = setInterval(() => {
      if (this.handleIfDead(interval)) return;

      if (this.posX > targetX) {
        this.posX -= walkSpeed;
      } else {
        this.handleReachedTarget(interval);
        setTimeout(() => this.startAttack(startX, targetX, walkSpeed), 1000);
      }
    }, 1000 / 25);
  }

  /**
   * Starts the Endboss's attack.
   *
   * @param {number} startX - The starting point of the movement.
   * @param {number} targetX - The target point of the movement.
   * @param {number} walkSpeed - The speed at which the Endboss moves.
   */
  startAttack(startX, targetX, walkSpeed) {
    if (this.isDead) return this.die();
    this.isAttacking = true;
    this.playAnimation(this.IMAGES_ATTACK);

    setTimeout(() => {
      if (this.isDead) return this.die();
      this.isAttacking = false;
      this.walkBack(startX, targetX, walkSpeed);
    }, 1000);
  }

  /**
   * Moves the Endboss back to the starting position after an attack.
   *
   * @param {number} startX - The starting point of the movement.
   * @param {number} targetX - The target point of the movement.
   * @param {number} walkSpeed - The speed at which the Endboss moves.
   */
  walkBack(startX, targetX, walkSpeed) {
    if (this.isDead) return this.die();
    this.isWalking = true;

    const interval = setInterval(() => {
      if (this.handleIfDead(interval)) return;

      if (this.posX < startX) {
        this.posX += walkSpeed;
      } else {
        this.handleReachedTarget(interval);
        setTimeout(() => {
          if (!this.isDead) this.walkToTarget(startX, targetX, walkSpeed);
        }, 1000);
      }
    }, 1000 / 25);
  }

  /**
   * Processes a hit on the Endboss.
   * Reduces the Endboss's health points.
   *
   * @param {number} damage - The damage dealt to the Endboss. Default is 20.
   */
  hit(damage = 20) {
    super.hit(damage);
    this.isAttacking = false;
    this.isHurtAnimation = true;
    this.endbossHurtSound.play();
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

    this.stopAllSounds();
    this.character.stopAllAnimationsAndSounds();
    this.playDeathAnimationOnce();
  }

  stopAllAnimationsAndSounds() {
    this.stopAllAnimations();
    this.stopAllSounds();
  }

  stopAllAnimations() {
    clearInterval(this.walkInterval);
    clearInterval(this.animationInterval);
    clearInterval(this.deadInterval);
    this.walkInterval = null;
    this.animationInterval = null;
    this.deadInterval = null;
  }

  stopAllSounds() {
    this.endbossBackgroundSound.pause();
  }
}
