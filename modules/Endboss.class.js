import {
  IMAGES_WALKING,
  IMAGES_ALERT,
  IMAGES_ATTACK,
  IMAGES_HURT,
  IMAGES_DEAD,
} from "../levels/endbossImages.js";
import MoveableObject from "./MoveableObject.class.js";

/**
 * @class Endboss - Represents the end boss enemy in the game.
 * @extends MoveableObject - Inherits from the MoveableObject class.
 */
export default class Endboss extends MoveableObject {
  posY = 50;
  width = 300;
  height = 400;

  /**
   * @constructor - Initializes the Endboss with images, sounds, and necessary settings.
   * @param {Object} world - The game world to interact with.
   * @param {Object} character - The player character that the endboss interacts with.
   * @param {Object} soundManager - The sound manager to handle audio for the endboss.
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
    this.soundManager = soundManager;
    this.isEndbossTriggered = false;
    this.posX = 5200;
    this.soundManager.prepareEndbossSounds();
    this.initStatusFlags();
    this.startAnimationLoop();
  }

  /**
   * @method initStatusFlags - Initializes the flags related to the endboss's status (e.g., whether it's dead, hurt, attacking, etc.).
   */
  initStatusFlags() {
    this.inFightSequence = false;
    this.isDead = false;
    this.isHurt = false;
    this.isAttacking = false;
    this.isWalking = false;
    this.isCharacterFrozen = false;
    this.inputLocked = false;
    this.visible = false;
    this.endbossTriggerd = false;
  }

  /**
   * @method startAnimationLoop - Starts the animation loop for the endboss and checks current status (e.g., dead, hurt, attacking, etc.) and updates the animation.
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
   * @method triggerEndboss - Triggers the endboss when the character crosses a specific X-position. Makes the endboss visible and starts its animation.
   */
  triggerEndboss() {
    if (!this.endbossTriggerd && this.character.posX > 4350) {
      this.visible = true;
      this.endbossTriggerd = true;
    }
    if (this.visible && !this.triggered) {
      this.startAnimationEndboss(this.world, this.character);
    }
  }

  /**
   * @method startAnimationEndboss - Starts the endboss's animation and movement to its starting position. Ensures the endboss is triggered and visible before starting the movement.
   * @param {Object} world - The game world instance.
   * @param {Object} character - The player character.
   */
  startAnimationEndboss(world, character) {
    if (this.shouldSkipEndboss()) return;

    this.visible = true;
    this.isEndbossTriggered = true;
    this.startMovingToStartPosition(world, character);
  }

  /**
   * @method shouldSkipEndboss - Checks if the endboss's animation should be skipped. Returns true if the endboss is already triggered or not visible.
   */
  shouldSkipEndboss() {
    return this.isEndbossTriggered || !this.visible;
  }

  /**
   * @method startMovingToStartPosition - Moves the endboss towards its target position. Starts the movement at regular intervals and checks the character's status.
   * @param {Object} world - The game world.
   * @param {Object} character - The player character.
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
   * @method moveTowardsTarget - Moves the endboss left until it reaches the target X-position and stops walking afterwards.
   * @param {number} targetX - The X-position to move toward.
   */
  moveTowardsTarget(targetX) {
    if (this.posX > targetX) {
      this.posX -= 10;
      this.isWalking = true;
    } else {
      clearInterval(this.walkInterval);
      this.isWalking = false;
    }
  }

  /**
   * @method checkCharacterFreeze - Freezes character interaction when the character reaches a certain X-position.
   * @param {Object} world - The game world.
   * @param {Object} character - The player character.
   */
  checkCharacterFreeze(world, character) {
    if (character.posX >= 4350 && !this.isCharacterFrozen) {
      this.freezeCharacterInteraction(world, character);
    }
  }

  /**
   * @method freezeCharacterInteraction - Freezes the character, stops background sounds and starts the endboss sound before initiating the fight.
   * @param {Object} world - The game world.
   * @param {Object} character - The player character.
   */
  freezeCharacterInteraction(world, character) {
    character.freezeCharacter();
    this.isCharacterFrozen = true;
    world.soundManager.pauseByKey("background");
    this.soundManager.playByKey("endfight");
    character.stopAllAnimationsAndSounds();

    setTimeout(() => {
      this.startFight();
    }, 5000);
  }

  /**
   * @method startFight - Displays the endboss health bar and starts the fight sequence after a short delay.
   */
  startFight() {
    this.world.endbossBar.isVisible = true;
    this.showFightBanner();

    setTimeout(() => {
      this.startFightSequence();
    }, 1000);
  }

  /**
   * @method showFightBanner - Animates and briefly displays the fight banner on screen.
   */
  showFightBanner() {
    const fightBanner = document.getElementById("fight-banner");
    fightBanner.style.animation = "fight-blink 1s ease-in-out";

    setTimeout(() => {
      fightBanner.style.animation = "none";
    }, 3000);
  }

  /**
   * @method handleReachedTarget - Stops movement and switches to alert animation when target is reached.
   * @param {NodeJS.Timeout} interval - The interval to clear.
   */
  handleReachedTarget(interval) {
    clearInterval(interval);
    this.isWalking = false;
    this.playAnimation(this.IMAGES_ALERT);
  }

  /**
   * @method startFightSequence - Initializes the fight sequence by setting start position and walking toward the player.
   */
  startFightSequence() {
    const walkSpeed = 25;
    const startX = 4750;
    const targetX = 4450;
    this.inFightSequence = true;
    this.posX = startX;
    this.walkToTarget(startX, targetX, walkSpeed);
  }

  /**
   * @method walkToTarget - Moves the endboss from the start to the target position and triggers an attack after arrival.
   * @param {number} startX - Starting X-position.
   * @param {number} targetX - Target X-position.
   * @param {number} walkSpeed - Speed of movement.
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
   * @method startAttack - Plays attack animation and triggers walk back after delay.
   * @param {number} startX - Starting X-position.
   * @param {number} targetX - Target X-position.
   * @param {number} walkSpeed - Speed for returning after attack.
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
   * @method walkBack - Moves the endboss back to the starting position and restarts the fight loop if alive.
   * @param {number} startX - Original X-position to return to.
   * @param {number} targetX - Target X-position before return.
   * @param {number} walkSpeed - Walking speed.
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
   * @method hit - Triggers hurt animation and plays sound when the endboss takes damage.
   * @param {number} [damage=20] - Damage taken by the endboss.
   */
  hit(damage = 20) {
    super.hit(damage);
    this.isAttacking = false;
    this.isHurtAnimation = true;
    this.soundManager.playByKey("endboss_hurting");

    setTimeout(() => {
      this.isHurtAnimation = false;
      this.isAttacking = true;
    }, 600);
  }

  /**
   * @method handleIfDead - Handles the endboss's death sequence and game win logic.
   * @param {NodeJS.Timeout} interval - The interval to clear.
   */
  handleIfDead(interval) {
    if (!this.isDead || !this.endbossTriggerd) return false;
    clearInterval(interval);
    this.die();
    this.world.currentScore += 500;
    this.world.handleGameOver();

    setTimeout(() => {
      this.world.soundManager.playByKey("win");
      this.world.showEndscreen("win");
    }, 1500);

    return true;
  }

  /**
   * @method die - Stops all actions and sounds and starts death animation.
   */
  die() {
    this.isDead = true;
    this.isWalking = false;
    this.isAttacking = false;
    this.isHurt = false;
    this.stopAllSounds();
    this.character.stopAllAnimationsAndSounds();
    this.playDeathAnimationOnce();
  }

  /**
   * @method stopAllAnimations - Clears all movement and animation intervals.
   */
  stopAllAnimations() {
    clearInterval(this.walkInterval);
    clearInterval(this.animationInterval);
    clearInterval(this.deadInterval);
    this.walkInterval = null;
    this.animationInterval = null;
    this.deadInterval = null;
  }

  /**
   * @method stopAllSounds - Pauses the endboss's background sound.
   */
  stopAllSounds() {
    this.soundManager.pauseByKey("endfight");
  }
}
