import {
  IMAGES_IDLE,
  IMAGES_LONG_IDLE,
  IMAGES_WALKING,
  IMAGES_JUMP,
  IMAGES_DEAD,
  IMAGES_HURT,
} from "../levels/characterImages.js";
import MoveableObject from "./MoveableObject.class.js";

/**
 * @class Character
 * @classdesc Represents the main controllable character in the game world. Inherits movement and image loading capabilities from MoveableObject.Handles animations, controls, sounds and character-specific behavior.
 * @augments MoveableObject
 * @exports Character
 */
export default class Character extends MoveableObject {
  height = 230;
  width = 150;
  posX = 80;
  posY = 210;

  /**
   * @constructs Character
   * @param {Object} world - The current game world context.
   * @param {Object} controls - The object containing player control states.
   * @param {Object} soundManager - Manages all character-related sounds.
   */
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
    this.soundManager = soundManager;
    this.preparingSounds();
    this.initializeState();

    this.applyGravity();
  }

  /**
   * @method initializeState - Initializes the character's state flags and control-related variables such as jumping, walking, idle, sound states, and animation timers.
   */
  initializeState() {
    this.isIdle = false;
    this.isWalking = false;
    this.isJumping = false;
    this.isSnoring = false;
    this.isHurting = false;
    this.jumpAnimationPlayed = false;
    this.hurtSoundPlayed = false;
    this.jumpKeyPressed = false;
    this.deadSoundPlayed = false;
  }

  /**
   * @method preparingSounds - Prepares and assigns all relevant character sounds using the provided sound manager.
   * @param {Object} soundManager - The sound manager providing sound assets.
   */
  preparingSounds() {
    this.walkingSoundPath = "assets/audio/walking.mp3";
    this.soundManager.prepare(this.walkingSoundPath, 1, true, 2);

    this.jumpingSoundPath = "assets/audio/jump.wav";
    this.soundManager.prepare(this.jumpingSoundPath);

    this.hurtingSoundPath = "assets/audio/hurt.ogg";
    this.soundManager.prepare(this.hurtingSoundPath);

    this.snoringSoundPath = "assets/audio/snoring.wav";
    this.soundManager.prepare(this.snoringSoundPath, 0.8, true, 1.5);

    this.deadSoundPath = "assets/audio/character_die.mp3";
    this.soundManager.prepare(this.deadSoundPath, 0.5);
  }

  /**
   * @method startAnimationLoop - Updates movement and animation states each frame.
   */
  startAnimationLoop() {
    this.updateCharacterMovement();
    this.updateCharacterAnimation();
  }

  /**
   * @method updateCharacterMovement - Handles jumping, walking, step sounds, and updates the camera position.
   */
  updateCharacterMovement() {
    if (this.world.characterFrozen) {
      this.controls.resetControls();
      return;
    }
    this.handleJumpInput();
    this.handleHorizontalMovement();
    this.playStepSounds();
    this.world.camera_x = -this.posX + 100;
  }

  /**
   * @method updateCharacterAnimation - Switches between death, hurt, jumping, and walking animations.
   */
  updateCharacterAnimation() {
    if (this.world.characterFrozen) return;
    if (this.isDead()) {
      this.handleDeath();
      return;
    }
    this.handleIfHurt();
    this.isAboveGround() ? this.triggerJumpingState() : this.handleWalking();
    this.resetJumpAndHurt();
  }

  /**
   * @method handleIfHurt - Plays hurt animation and sound if character is hurt.
   */
  handleIfHurt() {
    if (this.isHurt()) {
      this.clearIdleAnimation();
      this.playAnimation(this.IMAGES_HURT);
      this.playHurtSound();
      return;
    }
  }

  /**
   * @method handleWalking - Switches between walking and idle states based on input.
   */
  handleWalking() {
    this.controls.right || this.controls.left
      ? this.triggerWalkingState()
      : this.triggerIdleState();
    this.isJumping = false;
  }

  /**
   * @method handleDeath - Plays death sound and animation if character is dead.
   */
  handleDeath() {
    if (!this.deadSoundPlayed) {
      this.soundManager.play(this.deadSoundPath);
      this.deadSoundPlayed = true;
      this.stopAllAnimations();
      this.playDeathAnimationOnce();
    }
  }

  /**
   * @method handleHorizontalMovement - Moves character left or right based on input.
   */
  handleHorizontalMovement() {
    const speed = 5;
    if (this.canMoveRight()) {
      this.moveRight(speed);
    } else if (this.canMoveLeft()) {
      this.moveLeft(speed);
    }
  }

  /**
   * @method triggerWalkingState - Starts walking animation if character begins walking.
   */
  triggerWalkingState() {
    if (!this.isWalking) {
      this.walkingAnimation();
      this.isWalking = true;
      this.isIdle = false;
    }
  }

  /**
   * @method walkingAnimation - Plays walking animation in a timed interval.
   */
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

  /**
   * @method handleJumpInput - Handles jump input and plays the jump sound.
   */
  handleJumpInput() {
    if (this.world.characterFrozen) return;

    if (this.canJump()) {
      this.speedY = 30;
      this.soundManager.play(this.jumpingSoundPath);
      this.jumpKeyPressed = true;
    }
    if (!this.controls.up) {
      this.jumpKeyPressed = false;
    }
  }

  /**
   * @method triggerJumpingState - Triggers the jumping state and starts jump animation.
   */
  triggerJumpingState() {
    if (!this.isJumping && !this.jumpAnimationPlayed) {
      this.isJumping = true;
      this.jumpAnimationPlayed = true;
      this.isWalking = false;
      this.isIdle = false;
      this.jumpingAnimation();
    }
  }

  /**
   * @method jumpingAnimation - Plays the jumping animation in intervals.
   */
  jumpingAnimation() {
    this.clearIdleAnimation();
    let frame = 0;
    const totalFrames = this.IMAGES_JUMP.length;
    const fps = 10;
    const frameDuration = 1000 / fps;

    this.jumpInterval = setInterval(() => {
      this.playAnimation([this.IMAGES_JUMP[frame]]);
      frame++;

      if (frame >= totalFrames) {
        clearInterval(this.jumpInterval);
        this.jumpInterval = null;
        this.isJumping = false;
      }
    }, frameDuration);
  }

  /**
   * @method triggerIdleState - Triggers the idle state and starts idle animation.
   */
  triggerIdleState() {
    if (!this.isIdle) {
      this.idleAnimation();
      this.isIdle = true;
      this.isWalking = false;
    }
  }

  /**
   * @method idleAnimation - Plays the idle animation in intervals and checks if the character is inactive.
   */
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
    }, 8000);
  }

  /**
   * @method startLongIdleAnimation - Starts the long idle animation and plays the snoring sound.
   */
  startLongIdleAnimation() {
    if (this.longIdleInterval || this.world.characterFrozen) return;
    this.clearIdleAnimation();
    clearTimeout(this.idleTimeout);

    this.soundManager.play(this.snoringSoundPath);
    this.longIdleInterval = setInterval(() => {
      this.isInactive()
        ? this.playAnimation(this.IMAGES_LONG_IDLE)
        : this.clearLongIdleAnimation();
    }, 1000 / 5);
  }

  /**
   * @method clearIdleAnimation - Clears the idle animation and resets relevant properties.
   */
  clearIdleAnimation() {
    clearInterval(this.idleInterval);
    this.idleInterval = null;
    clearTimeout(this.idleTimeout);
    this.idleTimeout = null;
    this.isIdle = false;
  }

  /**
   * @method clearLongIdleAnimation - Clears the long idle animation and stops the snoring sound.
   */
  clearLongIdleAnimation() {
    this.isSnoring = false;
    this.soundManager.pause(this.snoringSoundPath);
    clearInterval(this.longIdleInterval);
    this.longIdleInterval = null;
  }

  /**
   * @method freezeCharacter - Freezes the character for 10 seconds.
   */
  freezeCharacter() {
    this.freeze();
    setTimeout(() => {
      this.unfreeze();
    }, 10000);
  }

  /**
   * @method freeze - Stops all animations and sounds, and freezes the character.
   */
  freeze() {
    this.stopAllAnimationsAndSounds();
    this.loadImg("assets/img/2_character_pepe/1_idle/idle/I-1.png");
    this.controls.resetControls();
    this.isFrozen = true;
    this.world.characterFrozen = true;
  }

  /**
   * @method unfreeze - Unfreezes the character, allowing movement again.
   */
  unfreeze() {
    this.isFrozen = false;
    this.world.characterFrozen = false;
  }

  /**
   * @method isCharacterDead - Checks if the character is dead and triggers the game over sequence.
   */
  isCharacterDead() {
    if (this.isDead()) {
      this.world.handleGameOver();
      this.world.backgroundSound.pause();
      setTimeout(() => {
        this.world.loseSound.play();
        this.world.showEndscreen("lose");
      }, 1500);
    }
  }

  /**
   * @method playStepSounds - Plays or pauses the walking sound based on the character's movement state.
   */
  playStepSounds() {
    if (!this.soundManager?.sounds?.[this.walkingSoundPath]) return;
    this.isWalking && !this.isAboveGround()
      ? this.soundManager.play(this.walkingSoundPath)
      : this.soundManager.pause(this.walkingSoundPath);
  }

  /**
   * @method playHurtSound - Plays the hurting sound once when the character is hurt.
   */
  playHurtSound() {
    if (!this.hurtSoundPlayed) {
      this.soundManager.play(this.hurtingSoundPath);
      this.hurtSoundPlayed = true;
    }
  }

  /**
   * @method resetJumpAndHurt - Resets jump and hurt states after the character is no longer hurt or in the air.
   */
  resetJumpAndHurt() {
    if (!this.isHurt()) {
      this.hurtSoundPlayed = false;
    }
    if (!this.isAboveGround()) {
      this.jumpAnimationPlayed = false;
    }
  }

  /**
   * @method stopAllAnimations - Stops all currently running animations and resets related intervals and timeouts.
   */
  stopAllAnimations() {
    clearInterval(this.idleInterval);
    clearInterval(this.longIdleInterval);
    clearTimeout(this.idleTimeout);
    clearInterval(this.walkInterval);
    clearInterval(this.jumpInterval);
    clearTimeout(this.idleTimeout);
    this.idleInterval = null;
    this.idleTimeout = null;
    this.longIdleInterval = null;
    this.walkInterval = null;
    this.jumpInterval = null;
  }

  /**
   * @method stopAllSounds - Pauses all active sounds and resets character sound states.
   */
  stopAllSounds() {
    this.isIdle = false;
    this.isWalking = false;
    this.isJumping = false;
    this.isSnoring = false;
    this.isHurting = false;
    this.jumpKeyPressed = false;
    this.soundManager.pause(this.walkingSoundPath);
    this.soundManager.pause(this.jumpingSoundPath);
    this.soundManager.pause(this.snoringSoundPath);
    this.soundManager.pause(this.hurtingSoundPath);
  }
}
