import Character from "./Character.class.js";
import { level1 } from "../levels/level1.js";
import StatusBar from "./StatusBar.class.js";
import CoinBar from "./CoinBar.class.js";
import EndbossBar from "./EndbossBar.class.js";
import BottleBar from "./BottleBar.class.js";
import ThrowableObject from "./ThrowableObject.class.js";
import Endboss from "./Endboss.class.js";
import SoundManager from "./SoundManager.class.js";

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

  constructor(canvas, controls) {
    this.soundManager = new SoundManager();
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.controls = controls;
    this.initLevel();
    this.initBars();
    this.initSounds();
  }

  initLevel() {
    this.level = level1(this.soundManager);
    this.character = new Character(this, this.controls, this.soundManager);
    this.endboss = new Endboss(this, this.character, this.soundManager);
    this.groundObjects = this.level.bottles;
    this.levelGround = 410;
    this.endboss.visible = false;
    this.endbossTriggerd = false;
    this.canThrow = true;
  }

  initBars() {
    this.healthBar = new StatusBar();
    this.coinBar = new CoinBar();
    this.bottleBar = new BottleBar();
    this.endbossBar = new EndbossBar();
  }

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

  startGame() {
    this.gameRunning = true;
    this.backgroundSound.play();
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
      this.triggerEndboss();
      this.removeObjects();
      this.checkGameOver();
    }, 50);
  }

  triggerEndboss() {
    if (!this.endbossTriggerd && this.character.posX > 3000) {
      this.endboss.visible = true;
      this.endbossTriggerd = true;
    }
    if (this.endboss.visible && !this.endboss.triggered) {
      this.endboss.startAnimationEndboss(this, this.character);
    }
  }

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

  canThrowBottle() {
    return this.controls.d && this.canThrow && this.currentBottles > 0;
  }

  isTopHit(impactObject, target) {
    return (
      impactObject.speedY < 0 &&
      impactObject.posY + impactObject.height >= target.posY &&
      impactObject.posY < target.posY
    );
  }

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

  checkEndbossCollision() {
    if (this.character.isColliding(this.endboss, 40, 60)) {
      if (!this.character.isHurt()) {
        this.character.hit(10);
        this.healthBar.setPercentage(this.character.energy);
      }
    }
  }

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

  checkBottleHitsGround() {
    this.throwableObjects.forEach((bottle) => {
      if (bottle.posY >= this.levelGround && !bottle.isBroken) {
        bottle.posY = this.levelGround;
        bottle.speedY = 0;
        this.handleBrokenBottle(bottle);
      }
    });
  }

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

  handleBrokenBottle(bottle) {
    bottle.brokenBottleAnimation();
    bottle.isBroken = true;
    this.markForRemovalLater(bottle);
  }

  handleCoinCollection() {
    this.level.coins.forEach((coin, index) => {
      if (this.character.isColliding(coin, 40, 60)) {
        this.level.coins.splice(index, 1);
        this.currentCoins++;
        this.currentScore += 100;
        this.coinBar.setPercentage((this.currentCoins / this.maxCoins) * 100);
        this.coinSound.play();
      }
    });
  }

  handleBottleCollection() {
    this.groundObjects.forEach((bottle, index) => {
      if (this.character.isColliding(bottle, 40, 60)) {
        this.groundObjects.splice(index, 1);
        this.currentBottles++;
        this.bottleBar.setPercentage(
          (this.currentBottles / this.maxBottles) * 100
        );
        this.collectingSound.play();
      }
    });
  }

  markForRemovalLater(obj, delay = 500) {
    setTimeout(() => (obj.markForRemoval = true), delay);
  }

  removeObjects() {
    this.level.enemies = this.level.enemies.filter(
      (enemy) => !enemy.markForRemoval
    );
    this.throwableObjects = this.throwableObjects.filter(
      (bottle) => !bottle.markForRemoval
    );
  }

  checkGameOver() {
    if (this.gameOver) return;
    this.isCharacterDead();
    this.isEndbossDead();
  }

  isCharacterDead() {
    if (this.character.isDead()) {
      this.handleGameOver();
      this.backgroundSound.pause();
      setTimeout(() => {
        this.loseSound.play();
        this.showEndscreen("lose");
      }, 1500);
    }
  }

  isEndbossDead() {
    if (this.endboss.isDead && this.endbossTriggerd) {
      this.currentScore += 500;
      this.handleGameOver();
      setTimeout(() => {
        this.winSound.play();
        this.showEndscreen("win");
      }, 1500);
    }
  }

  handleGameOver() {
    this.gameOver = true;
    this.character.stopAllAnimationsAndSounds();
    this.endboss.stopAllAnimationsAndSounds();
  }

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
    setTimeout(() => {
      this.showElement(btnContainer);
      document.getElementById("score").innerText = this.currentScore;
      this.saveNewScore(this.currentScore);
      const allScores = this.getSavedScores();
      document.getElementById("latestScore").innerText = allScores.join(", ");

      this.character.stopAllAnimationsAndSounds();
      this.endboss.stopAllAnimationsAndSounds();
    }, 9000);
    setTimeout(() => {
      this.soundManager.stopAndResetAllSounds();
    }, 10000);
  }

  getSavedScores() {
    const saved = localStorage.getItem("allScores");
    return saved ? JSON.parse(saved) : [];
  }

  saveNewScore(score) {
    const scores = this.getSavedScores();
    scores.push(score);
    localStorage.setItem("allScores", JSON.stringify(scores));
  }

  showElement(el) {
    el.classList.remove("hidden");
    el.classList.add("visible");
  }

  draw() {
    if (!this.gameRunning) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.character.move();

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

  addObjectsToMap(objects) {
    objects.forEach((obj) => {
      this.addToMap(obj);
    });
  }

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

  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.posX = mo.posX * -1;
  }

  flipImageBack(mo) {
    mo.posX = mo.posX * -1;
    this.ctx.restore();
  }
}
