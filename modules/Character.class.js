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

  constructor(world, keyboard, soundManager) {
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

    this.applyGravity();

    this.keyboard = keyboard;
    this.world = world;
    this.isIdle = false;
    this.isWalking = false;
    this.isJumping = false;
    this.hurtSoundPlayed = false;
    this.jumpKeyPressed = false;

    this.walkingSoundPath = "assets/audio/walking.mp3";
    this.walkingSound = soundManager.prepare(this.walkingSoundPath, 1, true, 2);

    this.jumpingSoundPath = "assets/audio/jump.wav";
    this.jumpingSound = soundManager.prepare(this.jumpingSoundPath);

    this.hurtingPath = "assets/audio/hurt.ogg";
    this.hurtingSound = soundManager.prepare(this.hurtingPath);

    this.isSnoring = false;
    this.snoringPath = "assets/audio/snoring.wav";
    this.snoringSound = soundManager.prepare(this.snoringPath, 0.8, true, 1.5);

    this.deadSoundPlayed = false;
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
      this.keyboard.left = false;
      this.keyboard.right = false;
      this.keyboard.up = false;
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
      if (!this.deadSoundPlayed) {
        this.deadSound.play();
        this.deadSoundPlayed = true;
        this.playDeathAnimationOnce();
      }
      return;
    }

    if (this.isHurt()) {
      this.playAnimation(this.IMAGES_HURT);
      this.playHurtSound();
      return;
    }

    if (this.isAboveGround()) {
      this.triggerJumpingState();
    } else {
      if (this.keyboard.right || this.keyboard.left) {
        this.triggerWalkingState();
      } else {
        this.triggerIdleState();
      }
      this.isJumping = false;
    }

    if (!this.isHurt()) {
      this.hurtSoundPlayed = false;
    }
  }

  startAnimation() {
    this.idleAnimation();
    if (this.isAboveGround()) {
      this.jumpingAnimation();
    } else {
      this.walkingAnimation();
    }
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
    return this.keyboard.right && this.posX < this.world.level.levelEndPosX;
  }

  /**
   * @returns {boolean} true, if moving left is possible
   */
  canMoveLeft() {
    return this.keyboard.left && this.posX > 0;
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
    this.walkInterval = setInterval(() => {
      if (!this.isAboveGround() && this.isWalking) {
        this.playAnimation(this.IMAGES_WALKING);
      } else {
        clearInterval(this.walkInterval);
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

    if (!this.keyboard.up) {
      this.jumpKeyPressed = false;
    }
  }

  canJump() {
    if (this.world.characterFrozen) return false;
    return this.keyboard.up && !this.isAboveGround() && !this.jumpKeyPressed;
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
    this.isJumping = true;
    this.jumpInterval = setInterval(() => {
      this.playAnimation(this.IMAGES_JUMP);
      if (!this.isAboveGround()) {
        clearInterval(this.jumpInterval);
        this.isJumping = false;
      }
    }, 1000 / 15);
  }

  // === Idle, Longidle States ===
  /**
   * @returns {boolean} true, if the character is inactive
   */
  isInactive() {
    return (
      !this.isAboveGround() &&
      !this.isWalking &&
      !this.isJumping &&
      !this.isHurt() &&
      !this.isDead()
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
    this.playAnimation(this.IMAGES_IDLE);

    this.idleInterval = setInterval(() => {
      if (this.isInactive()) {
        this.playAnimation(this.IMAGES_IDLE);
      } else {
        this.clearIdleAnimation();
      }
    }, 1000 / 5);

    this.idleTimeout = setTimeout(() => {
      if (this.isInactive()) {
        this.startLongIdleAnimation();
      }
    }, 5000);
  }

  startLongIdleAnimation() {
    if (this.longIdleInterval || this.world.characterFrozen) return;

    this.clearIdleAnimation();
    this.playAnimation(this.IMAGES_LONG_IDLE);
    this.isSnoring = true;
    this.playSnoringSounds();

    this.longIdleInterval = setInterval(() => {
      if (this.isInactive()) {
        this.playAnimation(this.IMAGES_LONG_IDLE);
      } else {
        this.clearIdleAnimation();
      }
    }, 1000 / 5);
  }

  clearIdleAnimation() {
    if (this.idleInterval) {
      clearInterval(this.idleInterval);
      this.idleInterval = null;
    }
    if (this.idleTimeout) {
      clearTimeout(this.idleTimeout);
      this.idleTimeout = null;
    }
    if (this.longIdleInterval) {
      clearInterval(this.longIdleInterval);
      this.longIdleInterval = null;
    }
    if (this.isSnoring) {
      this.snoringSound.pause();
    }
    this.isSnoring = false;
    this.isIdle = false;
  }

  // === Freeze/Unfreeze Helper Functions ===
  // Freezes the character: disables controls and animations

  freeze() {
    this.stopAllAnimationsAndSounds();
    this.keyboard.left = false;
    this.keyboard.right = false;
    this.keyboard.up = false;
    this.isFrozen = true;
    this.world.characterFrozen = true;
  }

  unfreeze() {
    this.isFrozen = false;
    this.world.characterFrozen = false;
  }

  // === Sounds ===
  playStepSounds() {
    if (this.movingHorizontally && !this.isAboveGround()) {
      this.walkingSound.play();
    } else {
      this.walkingSound.pause();
    }
  }

  playSnoringSounds() {
    if (this.world.characterFrozen) return;

    if (this.isInactive()) {
      this.isSnoring = true;
      this.snoringSound.play();
    } else {
      this.isSnoring = false;
      this.snoringSound.pause();
    }
  }

  playHurtSound() {
    if (!this.hurtSoundPlayed) {
      this.hurtingSound.play();
      this.hurtSoundPlayed = true;
    }
  }

  // === Stop All ===
  stopAllAnimationsAndSounds() {
    // Alle Animationen stoppen
    if (this.idleInterval) clearInterval(this.idleInterval);
    if (this.longIdleInterval) clearInterval(this.longIdleInterval);
    if (this.idleTimeout) clearTimeout(this.idleTimeout);
    if (this.walkInterval) clearInterval(this.walkInterval);
    if (this.jumpInterval) clearInterval(this.jumpInterval);

    this.idleInterval = null;
    this.longIdleInterval = null;
    this.idleTimeout = null;
    this.walkInterval = null;
    this.jumpInterval = null;

    // Sounds stoppen
    this.walkingSound.pause();
    this.jumpingSound.pause();
    this.snoringSound.pause();
    this.hurtingSound.pause();

    this.loadImg("assets/img/2_character_pepe/1_idle/idle/I-1.png");
  }
}
