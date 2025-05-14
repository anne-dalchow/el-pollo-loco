import Character from "./Character.class.js";
import { level1 } from "../levels/level1.js";
import StatusBar from "./StatusBar.class.js";
import CoinBar from "./CoinBar.class.js";
import EndbossBar from "./EndbossBar.class.js";
import BottleBar from "./BottleBar.class.js";
import ThrowableObject from "./ThrowableObject.class.js";
import Endboss from "./Endboss.class.js";
import SoundManager from "./SoundManager.class.js";

/**
 * @class World - A class representing the game world, handling all the game objects, sounds, and level management.
 */
export default class World {
  canvas;
  ctx;
  camera_x = 0;
  throwableObjects = [];
  maxBottles = 10;
  currentBottles = 0;
  groundObjects = [];
  maxCoins = 15;
  currentCoins = 0;
  currentScore = 0;
  coins = [];
  gameRunning = false;

  /**
   * @constructor - Initializes the game world, including setting up the canvas, controls, level, bars, and sounds.
   * @param {HTMLCanvasElement} canvas - The canvas element where the game will be rendered.
   * @param {object} controls - The control bindings for the game (e.g., for player movement).
   */
  constructor(canvas, controls, soundManager) {
    this.soundManager = soundManager;
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.controls = controls;
    this.initLevel();
    this.initBars();
    this.initSounds();
  }

  /**
   * @method initLevel - Initializes the level by setting up the game objects, including character and ground objects.
   */
  initLevel() {
    this.level = level1(this.soundManager);
    this.character = new Character(this, this.controls, this.soundManager);
    this.endboss = new Endboss(this, this.character, this.soundManager);
    this.groundObjects = this.level.bottles;
    this.levelGround = 410;
    this.canThrow = true;
  }

  /**
   * @method initBars - Initializes the status bars for health, coins, bottles, and endboss health.
   */
  initBars() {
    this.healthBar = new StatusBar();
    this.coinBar = new CoinBar();
    this.bottleBar = new BottleBar();
    this.endbossBar = new EndbossBar();
  }

  /**
   * @method initSounds - Initializes the sounds for the game, including background music and effect sounds.
   */
  initSounds() {
    this.backgroundSoundPath = "assets/audio/background.wav";
    this.backgroundSound = this.soundManager.prepare(
      this.backgroundSoundPath,
      0.2,
      true
    );
    this.coinSoundPath = "assets/audio/coin.wav";
    this.coinSound = this.soundManager.prepare(this.coinSoundPath, 0.2);

    this.collectingSoundPath = "assets/audio/collect.wav";
    this.collectingSound = this.soundManager.prepare(
      this.collectingSoundPath,
      0.1
    );
    this.loseSoundPath = "assets/audio/lose_endscreen.wav";
    this.loseSound = this.soundManager.prepare(this.loseSoundPath, 0.5);

    this.winSoundPath = "assets/audio/win_endscreen.wav";
    this.winSound = this.soundManager.prepare(this.winSoundPath, 0.5);
  }

  /**
   * @method startGame - Starts the game, plays the background sound, and initiates the game loop.
   */
  startGame() {
    this.gameRunning = true;
    this.soundManager.play(this.backgroundSoundPath);
    this.runGameLoop();
    this.draw();

    this.level.enemies.forEach((enemy) => {
      if (typeof enemy.startMoving === "function") {
        enemy.startMoving();
      }
    });
    this.level.clouds.forEach((cloud) => {
      if (typeof cloud.startMoving === "function") {
        cloud.startMoving();
      }
    });
  }

  /**
   * @method runGameLoop - Runs the main game loop, updating game logic at regular intervals.
   */
  runGameLoop() {
    if (this.runInterval) {
      clearInterval(this.runInterval);
      this.runInterval = null;
    }
    this.runInterval = setInterval(() => {
      if (!this.gameRunning) return;
      if (!this.characterFrozen) {
        this.checkCaracterCollision();
        this.checkEndbossCollision();
        this.checkThrowObjects();
        this.checkBottleHitsEnemy();
        this.checkBottleHitsEndboss();
        this.checkBottleHitsGround();
        this.handleBottleCollection();
        this.handleCoinCollection();
      }
      this.endboss.triggerEndboss();
      this.removeObjects();
      this.checkGameOver();
    }, 50);
  }

  /**
   * @method checkThrowObjects - Checks if the character can throw a bottle, creates a new throwable object, and updates the bottle bar.
   */
  checkThrowObjects() {
    if (this.canThrowBottle()) {
      this.canThrow = false;
      this.character.clearIdleAnimation();

      let bottle = new ThrowableObject(
        this.soundManager,
        this.character.posX + 80,
        this.character.posY + 100,
        true,
        this.character.otherDirection
      );
      this.throwableObjects.push(bottle);
      this.currentBottles--;
      this.bottleBar.setPercentage(
        (this.currentBottles / this.maxBottles) * 100
      );
    }
    if (!this.controls.d) {
      this.canThrow = true;
    }
  }

  /**
   * @method canThrowBottle() checks if the player can throw a bottle based on certain conditions.
   * @returns {boolean} - return `true` if the `d` key is pressed, `canThrow` is true, and `currentBottles` is greater than 0. Otherwise, it will return `false`
   */
  canThrowBottle() {
    return this.controls.d && this.canThrow && this.currentBottles > 0;
  }

  /**
   * @method isTopHit checks if an object has impacted the top of a target object.
   * @param {object} impactObject - this object has speedY, posY and height properties related to impact.
   * @param {object} target - this target object has also posY and height properties.
   * @returns {boolean}
   */
  isTopHit(impactObject, target) {
    return (
      impactObject.speedY < 0 &&
      impactObject.posY + impactObject.height >= target.posY &&
      impactObject.posY < target.posY
    );
  }

  /**
   * @method checkCharacterCollision - Checks if the character collides with any enemies and handles the outcome based on the collision type.
   */
  checkCaracterCollision() {
    this.level.enemies.forEach((enemy) => {
      if (this.character.isColliding(enemy, 40, 60) && !enemy.isDead) {
        if (this.isTopHit(this.character, enemy)) {
          this.currentScore += 100;
          enemy.die();
          this.markForRemovalLater(enemy, 2000);
          this.character.speedY = -10;
        } else {
          this.character.hit(20);
          this.healthBar.setPercentage(this.character.energy);
        }
      }
    });
  }

  /**
   * @method checkEndbossCollision - Checks if the character collides with the endboss and applies damage if not already hurt.
   */
  checkEndbossCollision() {
    if (this.character.isColliding(this.endboss, 40, 60)) {
      if (!this.character.isHurt()) {
        this.character.hit(10);
        this.healthBar.setPercentage(this.character.energy);
      }
    }
  }

  /**
   * @method checkBottleHitsEnemy - Checks if any thrown bottles collide with enemies, and handles the outcome.
   */
  checkBottleHitsEnemy() {
    this.throwableObjects.forEach((bottle) => {
      this.level.enemies.forEach((enemy) => {
        if (
          bottle.isColliding(enemy) &&
          !enemy.isDead &&
          !bottle.isBroken &&
          this.isTopHit(bottle, enemy)
        ) {
          this.currentScore += 100;
          this.handleBrokenBottle(bottle);
          enemy.die();
          this.markForRemovalLater(enemy, 2000);
        }
      });
    });
  }

  /**
   * @method checkBottleHitsGround - Checks if any thrown bottles hit the ground and handles their breaking.
   */
  checkBottleHitsGround() {
    this.throwableObjects.forEach((bottle) => {
      if (bottle.posY >= this.levelGround && !bottle.isBroken) {
        bottle.posY = this.levelGround;
        bottle.speedY = 0;
        this.handleBrokenBottle(bottle);
      }
    });
  }

  /**
   * @method checkBottleHitsEndboss - Checks if any thrown bottles collide with the endboss and applies damage.
   */
  checkBottleHitsEndboss() {
    this.throwableObjects.forEach((bottle) => {
      if (bottle.isColliding(this.endboss, 80, 80) && !this.endboss.isDead) {
        this.handleBrokenBottle(bottle);
        this.endboss.hit(20);
        this.endbossBar.setPercentage(this.endboss.energy);
        if (this.endboss.energy <= 0) {
          this.endboss.die();
        }
      }
    });
  }

  /**
   * @method handleBrokenBottle triggers a broken bottle animation, sets the bottle as broken, and marks it for removal later.
   * @param {object} bottle - The `bottle` parameter represent an object that has a method `brokenBottleAnimation()` and a property `isBroken`.
   */
  handleBrokenBottle(bottle) {
    bottle.brokenBottleAnimation();
    bottle.isBroken = true;
    this.markForRemovalLater(bottle);
  }

  /**
   * @method handleCoinCollection - Checks if the character collides with any coin and collects it, updating the score and coin bar.
   */
  handleCoinCollection() {
    this.level.coins.forEach((coin, index) => {
      if (this.character.isColliding(coin, 40, 60)) {
        this.level.coins.splice(index, 1);
        this.currentCoins++;
        this.currentScore += 100;
        this.coinBar.setPercentage((this.currentCoins / this.maxCoins) * 100);
        this.soundManager.play(this.coinSoundPath);
      }
    });
  }

  /**
   * @method handleBottleCollection - Checks if the character collides with any bottle on the ground and collects it, updating the bottle count and bottle bar.
   */
  handleBottleCollection() {
    this.groundObjects.forEach((bottle, index) => {
      if (this.character.isColliding(bottle, 40, 60)) {
        this.groundObjects.splice(index, 1);
        this.currentBottles++;
        this.bottleBar.setPercentage(
          (this.currentBottles / this.maxBottles) * 100
        );
        this.soundManager.play(this.collectingSoundPath);
      }
    });
  }

  /**
   * @method markForRemovalLater sets a flag on an object to mark it for removal after a specified delay.
   * @param {object} obj - This `obj` parameter represents an object (bottle, enemy).
   * @param {number} delay - The `delay` parameter represents the amount of time, in milliseconds, to wait before marking the object for removal. By default it will wait for 500 milliseconds.
   */
  markForRemovalLater(obj, delay = 500) {
    setTimeout(() => (obj.markForRemoval = true), delay);
  }

  /**
   * @method removeObjects - Removes enemies and throwable objects marked for removal from the level.
   */
  removeObjects() {
    this.level.enemies = this.level.enemies.filter(
      (enemy) => !enemy.markForRemoval
    );
    this.throwableObjects = this.throwableObjects.filter(
      (bottle) => !bottle.markForRemoval
    );
  }

  /**
   * @method checkGameOver checks if the game is over by determining if the character or end boss is dead.
   * @returns {boolean} - If the `gameOver` property is true, then the function will return without executing the `isCharacterDead()` and `isEndbossDead()` functions.
   */
  checkGameOver() {
    if (this.gameOver) return;
    this.character.isCharacterDead();
    this.endboss.handleIfDead();
  }

  /**
   * @method handleGameOver - Stops all animations and sounds for the character and endboss when the game is over.
   */
  handleGameOver() {
    this.gameOver = true;
    this.character.stopAllAnimationsAndSounds();
    this.endboss.stopAllAnimationsAndSounds();
  }

  /**
   * @method showEndscreen displays an end screen with different outcomes based on the input parameter and stops animations and sounds after a certain delay.
   * @param {string} outcome - The `outcome` parameter represents a string. Is used to determine the result of the game, whether it is a win or a loss.
   */
  showEndscreen(outcome) {
    const endscreen = document.getElementById("endscreen");
    const img2 = document.getElementById("image2");
    const btnContainer = document.querySelector(".endscreen-btn-container");
    outcome === "win"
      ? (img2.src = "assets/img/You won, you lost/You won A.png")
      : (img2.src =
          "assets/img/9_intro_outro_screens/game_over/oh no you lost!.png");
    this.showElement(endscreen);
    this.showElement(img2);
    this.character.freezeCharacter();

    setTimeout(() => {
      this.showElement(btnContainer);
      this.showScore();
    }, 9000);
  }

  /**
   * @method showScore - Displays the current score on the screen, saves the new score, and updates the list of all saved scores.
   */
  showScore() {
    document.getElementById("score").innerText = this.currentScore;
    this.saveNewScore(this.currentScore);
    const allScores = this.getSavedScores();
    document.getElementById("latestScore").innerText = allScores.join(", ");
  }

  /**
   * @method getSavedScores retrieves saved scores from local storage, returning an empty array if no scores are found.
   * @returns {Array} - Returns an array of saved scores. If there are no saved scores in the localStorage, an empty array will be returned.
   */
  getSavedScores() {
    const saved = localStorage.getItem("allScores");
    return saved ? JSON.parse(saved) : [];
  }

  /**
   * @method saveNewScore saves a new score to local storage.
   * @param {number} score - The `score` parameter represents a number that is to save, or add tho the saved scores list.
   */
  saveNewScore(score) {
    const scores = this.getSavedScores();
    scores.push(score);
    if (scores.length > 5) {
      scores.shift();
    }
    localStorage.setItem("allScores", JSON.stringify(scores));
  }

  /**
   * @method showElement removes the "hidden" class and adds the "visible" class to a specified element.
   * @param {Element} el - The `el` parameter is a reference to a specified HTML element.
   */
  showElement(el) {
    el.classList.remove("hidden");
    el.classList.add("visible");
  }

  /**
   * @method draw - Clears the canvas, draws all game objects (background, character, enemies, etc.), and updates the display in each frame.
   */
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.character.startAnimationLoop();
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.groundObjects);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.bottles);
    this.addObjectsToMap(this.level.enemies);
    this.addToMap(this.endboss);
    this.addObjectsToMap(this.throwableObjects);
    this.ctx.translate(-this.camera_x, 0);
    this.addToMap(this.healthBar);
    this.addToMap(this.coinBar);
    this.addToMap(this.bottleBar);
    if (this.endbossBar.isVisible) {
      this.addToMap(this.endbossBar);
    }
    this.ctx.translate(this.camera_x, 0);
    this.addToMap(this.character);
    this.ctx.translate(-this.camera_x, 0);
    requestAnimationFrame(() => this.draw());
  }

  /**
   * @method addObjectsToMap iterates through an array of objects and adds each object to a map.
   * @param {Array} objects - An array of objects that need to be added to a map.
   */
  addObjectsToMap(objects) {
    objects.forEach((obj) => {
      this.addToMap(obj);
    });
  }

  /**
   * @method addToMap flips the image by checken `mo.otherDirection` is true, or false, then draws the image using the `draw` method of the object `mo`.
   * @param {object} mo - The object `mo` have a property `otherDirection` which is used to determine whether to flip the image before drawing it on the canvas using the `draw` method.
   */
  addToMap(mo) {
    if (mo.otherDirection) {
      this.flipImage(mo);
    }
    mo.draw(this.ctx);
    // mo.drawFrame(this.ctx);
    if (mo.otherDirection) {
      this.flipImageBack(mo);
    }
  }

  /**
   * @method flipImage flips the given image horizontally by transforming the canvas context.
   * @param {Object} mo - The image object to flip. Must have `posX` properties.
   */
  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.posX = mo.posX * -1;
  }

  /**
   * @method flipImageBack() restores the canvas context to its previous state and resets the flipped position.
   * @param {Object} mo - The image object to revert flip on. Must have a `posX` property, because it inverts the `posX` value.
   */
  flipImageBack(mo) {
    mo.posX = mo.posX * -1;
    this.ctx.restore();
  }
}
