import {
  IMAGES_IDLE,
  IMAGES_LONG_IDLE,
  IMAGES_WALKING,
  IMAGES_JUMP,
  IMAGES_DEAD,
  IMAGES_HURT,
} from "../levels/characterImages.js";
import MoveableObject from "./MoveableObject.class.js";

export default class Character extends MoveableObject {
  height = 230;
  width = 150;
  posX = 80;
  posY = 210;

  constructor(world, controls, soundManager) {
    super();
    this.IMAGES_IDLE = IMAGES_IDLE;
    this.IMAGES_LONG_IDLE = IMAGES_LONG_IDLE;
    this.IMAGES_WALKING = IMAGES_WALKING;
    this.IMAGES_JUMP = IMAGES_JUMP;
    this.IMAGES_DEAD = IMAGES_DEAD;
    this.IMAGES_HURT = IMAGES_HURT;

    this.loadImg("assets/img/2_character_pepe/1_idle/idle/I-1.png");
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_LONG_IDLE);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMP);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);

    this.controls = controls;
    this.world = world;
    this.applyGravity();
    this.initializeState();
    this.preparingSounds(soundManager);
  }

  initializeState() {
    this.isIdle = false;
    this.isWalking = false;
    this.isJumping = false;
    this.isSnoring = false;
    this.isHurting = false;
    this.hurtSoundPlayed = false;
    this.jumpKeyPressed = false;
    this.deadSoundPlayed = false;
  }

  preparingSounds(soundManager) {
    this.walkingSoundPath = "assets/audio/walking.mp3";
    this.walkingSound = soundManager.prepare(this.walkingSoundPath, 1, true, 2);
    this.jumpingSoundPath = "assets/audio/jump.wav";
    this.jumpingSound = soundManager.prepare(this.jumpingSoundPath);
    this.hurtingPath = "assets/audio/hurt.ogg";
    this.hurtingSound = soundManager.prepare(this.hurtingPath);
    this.snoringPath = "assets/audio/snoring.wav";
    this.snoringSound = soundManager.prepare(this.snoringPath, 0.8, true, 1.5);
    this.deadSoundPath = "assets/audio/character_die.mp3";
    this.deadSound = soundManager.prepare(this.deadSoundPath, 0.5);
  }

  // === Functions for Animation, Loop Functions to check Animation States ===
  move() {
    this.handleMovementInput();
    this.handleAnimation();
  }

  handleMovementInput() {
    if (this.world.characterFrozen) {
      this.resetMovementKeys();
      return;
    }
    this.movingHorizontally = false;
    this.handleJumpInput();
    this.handleHorizontalMovement();
    this.playStepSounds();
    this.world.camera_x = -this.posX + 100;
  }

  handleAnimation() {
    if (this.world.characterFrozen) return;
    if (this.isDead()) {
      this.handleDeath();
      return;
    }
    if (this.isHurt()) {
      this.clearIdleAnimation();
      this.playAnimation(this.IMAGES_HURT);
      this.playHurtSound();
      return;
    }
    this.isAboveGround() ? this.triggerJumpingState() : this.handleWalking();
    if (!this.isHurt()) {
      this.hurtSoundPlayed = false;
    }
  }

  handleWalking() {
    this.controls.right || this.controls.left
      ? this.triggerWalkingState()
      : this.triggerIdleState();
    this.isJumping = false;
  }

  handleDeath() {
    if (!this.deadSoundPlayed) {
      this.deadSound.play();
      this.deadSoundPlayed = true;
      this.stopAllAnimations();
      this.playDeathAnimationOnce();
    }
  }

  startAnimation() {
    this.idleAnimation();
    this.isAboveGround() ? this.jumpingAnimation() : this.walkingAnimation();
    this.isWalking = true;
  }

  // === Functions for Walking ===
  handleHorizontalMovement() {
    const speed = 5;

    if (this.canMoveRight()) {
      this.moveRight(speed);
      this.movingHorizontally = true;
    } else if (this.canMoveLeft()) {
      this.moveLeft(speed);
      this.movingHorizontally = true;
    }
  }

  /**
   * @returns {boolean} true, if moving right is possible
   */
  canMoveRight() {
    return this.controls.right && this.posX < this.world.level.levelEndPosX;
  }

  /**
   * @returns {boolean} true, if moving left is possible
   */
  canMoveLeft() {
    return this.controls.left && this.posX > 0;
  }

  /**
   * @param {number} speed - The distance to move right
   */
  moveRight(speed) {
    this.posX += speed;
    this.otherDirection = false;
  }

  /**
   * @param {number} speed - The distance to move left
   */
  moveLeft(speed) {
    this.posX -= speed;
    this.otherDirection = true;
  }

  triggerWalkingState() {
    if (!this.isWalking) {
      this.walkingAnimation();
      this.isWalking = true;
      this.isIdle = false;
    }
  }

  walkingAnimation() {
    clearInterval(this.walkInterval);
    this.walkInterval = setInterval(() => {
      if (!this.isAboveGround() && this.isWalking) {
        this.playAnimation(this.IMAGES_WALKING);
      } else {
        clearInterval(this.walkInterval);
        this.walkInterval = null;
      }
    }, 1000 / 15);
  }

  // === Functions for Jumping ===
  handleJumpInput() {
    if (this.world.characterFrozen) return;

    if (this.canJump()) {
      this.speedY = 30;
      this.jumpingSound.currentTime = 0;
      this.jumpingSound.play();
      this.jumpKeyPressed = true;
    }

    if (!this.controls.up) {
      this.jumpKeyPressed = false;
    }
  }

  canJump() {
    return this.controls.up && !this.isAboveGround() && !this.jumpKeyPressed;
  }

  triggerJumpingState() {
    if (!this.isJumping) {
      this.jumpingAnimation();
      this.isJumping = true;
      this.isWalking = false;
      this.isIdle = false;
    }
  }

  jumpingAnimation() {
    clearInterval(this.jumpInterval);
    this.clearIdleAnimation();
    this.isJumping = true;

    this.jumpInterval = setInterval(() => {
      this.playAnimation(this.IMAGES_JUMP);
      if (!this.isAboveGround()) {
        clearInterval(this.jumpInterval);
        this.jumpInterval = null;
        this.isJumping = false;
      }
    }, 1000 / 15);
  }

  // === Idle, Longidle States ===
  isInactive() {
    return (
      !this.isAboveGround() &&
      !this.isWalking &&
      !this.isJumping &&
      !this.isHurt() &&
      !this.energy == 0
    );
  }

  triggerIdleState() {
    if (!this.isIdle) {
      this.idleAnimation();
      this.isIdle = true;
      this.isWalking = false;
    }
  }

  idleAnimation() {
    if (
      this.idleInterval ||
      this.longIdleInterval ||
      this.world.characterFrozen
    )
      return;
    this.isIdle = true;
    this.idleInterval = setInterval(() => {
      this.isInactive()
        ? this.playAnimation(this.IMAGES_IDLE)
        : this.clearIdleAnimation();
    }, 1000 / 5);

    this.idleTimeout = setTimeout(() => {
      if (this.isInactive()) {
        this.isSnoring = true;
        this.startLongIdleAnimation();
      }
    }, 15000);
  }

  startLongIdleAnimation() {
    if (this.longIdleInterval || this.world.characterFrozen) return;
    this.clearIdleAnimation();
    clearTimeout(this.idleTimeout);

    this.snoringSound.play();
    this.longIdleInterval = setInterval(() => {
      this.isInactive()
        ? this.playAnimation(this.IMAGES_LONG_IDLE)
        : this.clearLongIdleAnimation();
    }, 1000 / 5);
  }

  clearIdleAnimation() {
    clearInterval(this.idleInterval);
    this.idleInterval = null;
    clearTimeout(this.idleTimeout);
    this.idleTimeout = null;
    this.isIdle = false;
  }

  clearLongIdleAnimation() {
    this.isSnoring = false;
    this.snoringSound.pause();
    clearInterval(this.longIdleInterval);
    this.longIdleInterval = null;
  }

  // === Freeze/Unfreeze Helper Functions ===
  freezeCharacter() {
    this.freeze();
    setTimeout(() => {
      this.unfreeze();
    }, 10000);
  }

  freeze() {
    this.stopAllAnimationsAndSounds();
    this.loadImg("assets/img/2_character_pepe/1_idle/idle/I-1.png");
    this.controls.left = false;
    this.controls.right = false;
    this.controls.up = false;
    this.isFrozen = true;
    this.world.characterFrozen = true;
  }

  unfreeze() {
    this.isFrozen = false;
    this.world.characterFrozen = false;
  }

  // === Sounds ===
  playStepSounds() {
    this.movingHorizontally && !this.isAboveGround()
      ? this.walkingSound.play()
      : this.walkingSound.pause();
  }

  playHurtSound() {
    if (!this.hurtSoundPlayed) {
      this.hurtingSound.play();
      this.hurtSoundPlayed = true;
    }
  }

  // === Stop Sounds and Animations ===
  stopAllAnimationsAndSounds() {
    this.stopAllAnimations();
    this.stopAllSounds();
  }

  stopAllAnimations() {
    clearInterval(this.idleInterval);
    clearInterval(this.longIdleInterval);
    clearTimeout(this.idleTimeout);
    clearInterval(this.walkInterval);
    clearInterval(this.jumpInterval);
    this.idleInterval = null;
    this.longIdleInterval = null;
    this.idleTimeout = null;
    this.walkInterval = null;
    this.jumpInterval = null;
  }

  stopAllSounds() {
    this.isIdle = false;
    this.isWalking = false;
    this.isJumping = false;
    this.isSnoring = false;
    this.isHurting = false;
    this.jumpKeyPressed = false;
    this.walkingSound.pause();
    this.jumpingSound.pause();
    this.snoringSound.pause();
    this.hurtingSound.pause();
  }

  resetMovementKeys() {
    this.controls.left = false;
    this.controls.right = false;
    this.controls.up = false;
  }
}
