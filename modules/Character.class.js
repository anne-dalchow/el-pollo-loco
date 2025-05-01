import {
  IMAGES_IDLE,
  IMAGES_LONG_IDLE,
  IMAGES_WALKING,
  IMAGES_JUMP,
  IMAGES_DEAD,
  IMAGES_HURT,
} from "../levels/characterImages.js";
import MoveableObject from "./MoveableObject.class.js";

const JUMP_SPEED = 30;
const MOVE_SPEED = 5;
const RUN_SPEED = 10;

export default class Character extends MoveableObject {
  height = 230;
  width = 150;
  posX = 80;
  posY = 210;

  constructor(world, keyboard) {
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

    this.walkingSound = new Audio("assets/audio/walking.mp3");
    this.jumpingSound = new Audio("assets/audio/jump.wav");
    this.hurtSound = new Audio("assets/audio/hurt.ogg");
    this.snoringSound = new Audio("assets/audio/snoring.wav");
    this.walkingSound.loop = true;
    this.snoringSound.loop = true;
  }

  move() {
    this.handleMovementInput();
    this.handleAnimation();
  }

  handleMovementInput() {
    this.movingHorizontally = false;

    this.handleJumpInput();
    this.handleHorizontalMovement();
    this.playStepSounds();
    this.world.camera_x = -this.posX + 100;
  }

  handleJumpInput() {
    if (this.canJump()) {
      this.speedY = JUMP_SPEED;
      this.jumpingSound.currentTime = 0;
      this.jumpingSound.play();
      this.jumpKeyPressed = true;
    }

    if (!this.keyboard.up) {
      this.jumpKeyPressed = false;
    }
  }
  canJump() {
    return this.keyboard.up && !this.isAboveGround() && !this.jumpKeyPressed;
  }

  handleHorizontalMovement() {
    const speed = this.keyboard.shift ? RUN_SPEED : MOVE_SPEED;

    if (this.canMoveRight()) {
      this.moveRight(speed);
      this.movingHorizontally = true;
    } else if (this.canMoveLeft()) {
      this.moveLeft(speed);
      this.movingHorizontally = true;
    }
  }

  canMoveRight() {
    return this.keyboard.right && this.posX < this.world.level.levelEndPosX;
  }

  canMoveLeft() {
    return this.keyboard.left && this.posX > 0;
  }

  playStepSounds() {
    this.walkingSound.volume = 1;
    this.walkingSound.playbackRate = 2;

    if (this.movingHorizontally && !this.isAboveGround()) {
      if (this.walkingSound.paused) {
        this.walkingSound.play();
      }
    } else {
      if (!this.walkingSound.paused) {
        this.walkingSound.pause();
      }
    }
  }

  isInactive() {
    return (
      !this.isAboveGround() &&
      !this.isWalking &&
      !this.isJumping &&
      !this.isHurt() &&
      !this.isDead()
    );
  }

  playSnoringSounds() {
    this.snoringSound.volume = 0.8;
    this.snoringSound.playbackRate = 1.5;

    if (this.isInactive()) {
      if (this.snoringSound.paused) {
        this.snoringSound.play();
      }
    } else {
      if (!this.snoringSound.paused) {
        this.snoringSound.pause();
        this.snoringSound.currentTime = 0; // wichtig!
      }
    }
  }

  startBackgroundSound() {
    if (!this.backgroundSound) {
      this.backgroundSound = new Audio("assets/audio/background.wav");
      this.backgroundSound.loop = true;
      this.backgroundSound.volume = 0.2;
    }
    this.backgroundSound.play().catch((e) => {
      console.warn("Hintergrundsound konnte nicht gestartet werden:", e);
    });
  }

  hurtSoundHandler() {
    if (!this.hurtSoundPlayed) {
      this.hurtSound.play();
      this.hurtSoundPlayed = true;
    }
  }

  triggerJumpingState() {
    if (!this.isJumping) {
      this.jumpingAnimation();
      this.isJumping = true;
      this.isWalking = false;
      this.isIdle = false;
    }
  }

  triggerWalkingState() {
    if (!this.isWalking) {
      this.walkingAnimation();
      this.isWalking = true;
      this.isIdle = false;
    }
  }

  triggerIdleState() {
    if (!this.isIdle) {
      this.idleAnimation();
      this.isIdle = true;
      this.isWalking = false;
    }
  }

  handleAnimation() {
    if (this.isDead()) {
      this.playAnimation(this.IMAGES_DEAD);
      return;
    }
    if (this.isHurt()) {
      this.playAnimation(this.IMAGES_HURT);
      this.hurtSoundHandler();
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

  moveRight(speed) {
    this.posX += speed;
    this.otherDirection = false;
  }

  moveLeft(speed) {
    this.posX -= speed;
    this.otherDirection = true;
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

  idleAnimation() {
    if (this.idleInterval || this.longIdleInterval) return;

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
    if (this.longIdleInterval) return;

    this.clearIdleAnimation();
    this.playAnimation(this.IMAGES_LONG_IDLE);
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
    if (!this.snoringSound.paused) {
      this.snoringSound.pause();
      this.snoringSound.currentTime = 0;
    }

    this.isIdle = false;
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
}
