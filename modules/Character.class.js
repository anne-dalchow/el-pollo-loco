import MoveableObject from "./MoveableObject.class.js";

const JUMP_SPEED = 30;
const MOVE_SPEED = 5;
const RUN_SPEED = 10;

export default class Character extends MoveableObject {
  height = 280;
  width = 150;
  posX = 80;
  posY = 145;

  IMAGES_WALKING = [
    "assets/img/2_character_pepe/2_walk/W-21.png",
    "assets/img/2_character_pepe/2_walk/W-22.png",
    "assets/img/2_character_pepe/2_walk/W-23.png",
    "assets/img/2_character_pepe/2_walk/W-24.png",
    "assets/img/2_character_pepe/2_walk/W-25.png",
    "assets/img/2_character_pepe/2_walk/W-26.png",
  ];

  IMAGES_JUMP = [
    "assets/img/2_character_pepe/3_jump/J-31.png",
    "assets/img/2_character_pepe/3_jump/J-32.png",
    "assets/img/2_character_pepe/3_jump/J-33.png",
    "assets/img/2_character_pepe/3_jump/J-34.png",
    "assets/img/2_character_pepe/3_jump/J-35.png",
    "assets/img/2_character_pepe/3_jump/J-36.png",
    "assets/img/2_character_pepe/3_jump/J-37.png",
    "assets/img/2_character_pepe/3_jump/J-38.png",
    "assets/img/2_character_pepe/3_jump/J-39.png",
  ];

  IMAGES_DEAD = [
    "assets/img/2_character_pepe/5_dead/D-51.png",
    "assets/img/2_character_pepe/5_dead/D-52.png",
    "assets/img/2_character_pepe/5_dead/D-53.png",
    "assets/img/2_character_pepe/5_dead/D-54.png",
    "assets/img/2_character_pepe/5_dead/D-55.png",
    "assets/img/2_character_pepe/5_dead/D-56.png",
    "assets/img/2_character_pepe/5_dead/D-57.png",
  ];

  IMAGES_HURT = [
    "assets/img/2_character_pepe/4_hurt/H-41.png",
    "assets/img/2_character_pepe/4_hurt/H-42.png",
    "assets/img/2_character_pepe/4_hurt/H-43.png",
  ];

  constructor(world, keyboard) {
    super();
    this.loadImg("assets/img/2_character_pepe/2_walk/W-21.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMP);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.applyGravity();
    this.keyboard = keyboard;
    this.world = world;
    this.isWalking = false;
    this.isJumping = false;
    this.hurtSoundPlayed = false;
    this.walkingSound = new Audio("assets/audio/walking.mp3");
    this.jumpingSound = new Audio("assets/audio/jump.wav");
    this.hurtSound = new Audio("assets/audio/hurt.ogg");
    this.walkingSound.loop = true;
  }
  move() {
    this.handleMovementInput();
    this.handleAnimation();
  }

  handleMovementInput() {
    this.movingHorizontally = false;

    if (this.keyboard.up && !this.isAboveGround()) {
      this.speedY = JUMP_SPEED;
      this.jumpingSound.currentTime = 0; // springt immer von vorn an
      this.jumpingSound.play();
    } else {
      const speed = this.keyboard.shift ? RUN_SPEED : MOVE_SPEED;

      if (this.keyboard.right && this.posX < this.world.level.levelEndPosX) {
        this.moveRight(speed);
        this.movingHorizontally = true;
      } else if (this.keyboard.left && this.posX > 0) {
        this.moveLeft(speed);
        this.movingHorizontally = true;
      }
    }

    this.playStepSounds();
    this.world.camera_x = -this.posX + 100;
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

  handleAnimation() {
    if (this.isDead()) {
      this.playAnimation(this.IMAGES_DEAD);
    } else if (this.isHurt()) {
      this.playAnimation(this.IMAGES_HURT);

      if (!this.hurtSoundPlayed) {
        this.hurtSound.play();
        this.hurtSoundPlayed = true;
      }
    } else if (this.isAboveGround()) {
      if (!this.isJumping) {
        this.jumpingAnimation();
      }
    } else if (this.movingHorizontally) {
      if (!this.isWalking) {
        this.startAnimation();
      }
    } else {
      if (this.isWalking || this.isJumping) {
        this.isWalking = false;
        this.isJumping = false;
      }
    }

    // Reset der Flag, wenn Charakter nicht mehr verletzt ist
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
    if (this.isAboveGround()) {
      this.jumpingAnimation();
    } else {
      this.walkingAnimation();
    }
    this.isWalking = true;
  }

  walkingAnimation() {
    const animate = () => {
      if (this.isAboveGround()) {
        return;
      }
      this.playAnimation(this.IMAGES_WALKING);

      setTimeout(() => {
        if (this.isWalking) {
          requestAnimationFrame(animate);
        }
      }, 1000 / 15);
    };

    requestAnimationFrame(animate);
  }

  jumpingAnimation() {
    this.isJumping = true;
    const animate = () => {
      this.playAnimation(this.IMAGES_JUMP);

      setTimeout(() => {
        if (this.isAboveGround()) {
          requestAnimationFrame(animate);
        } else {
          this.isJumping = false;
        }
      }, 1000 / 15);
    };

    requestAnimationFrame(animate);
  }
}
