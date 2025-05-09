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
  healthBar = new StatusBar();
  coinBar = new CoinBar();
  bottleBar = new BottleBar();
  endbossBar = new EndbossBar();
  throwableObjects = [];
  maxBottles = 10;
  currentBottles = 0;
  groundObjects = [];
  maxCoins = 15;
  currentCoins = 0;
  currentScore = 0;
  coins = [];

  gameRunning = false;

  constructor(canvas, keyboard, soundManager) {
    this.level = level1(soundManager);
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.soundManager = soundManager;
    this.character = new Character(this, this.keyboard, soundManager);
    this.endboss = new Endboss(this, this.character, soundManager);
    this.groundObjects = this.level.bottles;
    this.levelGround = 410;
    this.canThrow = true;
    this.endboss.visible = false;
    this.endbossTriggerd = false;

    this.backgroundSoundPath = "assets/audio/background.wav";
    this.backgroundSound = soundManager.prepare(
      this.backgroundSoundPath,
      0.2,
      true
    );
    this.coinSoundPath = "assets/audio/coin.wav";
    this.coinSound = soundManager.prepare(this.coinSoundPath, 0.2);
    this.collectingSoundPath = "assets/audio/collect.wav";
    this.collectingSound = soundManager.prepare(this.collectingSoundPath, 0.1);

    this.loseSoundPath = "assets/audio/lose_endscreen.wav";
    this.loseSound = soundManager.prepare(this.loseSoundPath, 0.5);

    this.winSoundPath = "assets/audio/win_endscreen.wav";
    this.winSound = soundManager.prepare(this.winSoundPath, 0.5);

    this.chickenSoundPath = "assets/audio/chicken sound.mp3";
    this.chickenSound = soundManager.prepare(
      this.chickenSoundPath,
      1,
      false,
      1.5
    );
  }

  startGame() {
    this.gameRunning = true;

    this.backgroundSound.play();
    this.run();
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

  run() {
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
    if (!this.keyboard.d) {
      this.canThrow = true;
    }
  }

  canThrowBottle() {
    return this.keyboard.d && this.canThrow && this.currentBottles > 0;
  }

  isTopHit(impactObject, target) {
    return (
      impactObject.speedY < 0 &&
      impactObject.posY + impactObject.height >= target.posY &&
      impactObject.posY < target.posY
    );
  }

  // isLeftHit(impactObject, target) {
  //   return (
  //     impactObject.posX + impactObject.width >= target.posX &&
  //     impactObject.posX < target.posX &&
  //     impactObject.posY + impactObject.height > target.posY
  //   );
  // }

  // isRightHit(impactObject, target) {
  //   return (
  //     impactObject.posX <= target.posX + target.width &&
  //     impactObject.posX + impactObject.width > target.posX + target.width &&
  //     impactObject.posY + impactObject.height > target.posY
  //   );
  // }

  checkCaracterCollision() {
    this.level.enemies.forEach((enemy) => {
      if (this.character.isColliding(enemy, 40, 60) && !enemy.isDead) {
        if (this.isTopHit(this.character, enemy)) {
          enemy.die();
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
          bottle.brokenBottleAnimation();
          bottle.isBroken = true;
          enemy.die();
          setTimeout(() => {
            bottle.markForRemoval = true;
          }, 500);
        }
      });
    });
  }

  checkBottleHitsGround() {
    this.throwableObjects.forEach((bottle) => {
      if (bottle.posY >= this.levelGround && !bottle.isBroken) {
        bottle.posY = this.levelGround;
        bottle.speedY = 0;
        bottle.isBroken = true;
        bottle.brokenBottleAnimation();
        setTimeout(() => {
          bottle.markForRemoval = true;
        }, 500);
      }
    });
  }

  checkBottleHitsEndboss() {
    this.throwableObjects.forEach((bottle) => {
      if (bottle.isColliding(this.endboss, 80, 80) && !this.endboss.isDead) {
        bottle.brokenBottleAnimation();
        this.chickenSound.play();
        // if (
        //   this.isTopHit(bottle, this.endboss) ||
        //   this.isLeftHit(bottle, this.endboss) ||
        //   this.isRightHit(bottle, this.endboss)
        // ) {
        this.endboss.hit(20);
        this.endbossBar.setPercentage(this.endboss.energy);
        setTimeout(() => {
          bottle.markForRemoval = true;
        }, 500);
        if (this.endboss.energy <= 0) {
          this.endboss.die();
          // }
        }
      }
    });
  }

  handleCoinCollection() {
    this.level.coins.forEach((coin, index) => {
      if (this.character.isColliding(coin, 40, 60)) {
        this.level.coins.splice(index, 1);
        this.currentCoins++;
        this.currentScore = this.currentCoins * 100;
        this.coinBar.setPercentage((this.currentCoins / this.maxCoins) * 100);
        this.coinSound.play();
      }
    });
  }
  // Flasche einsammeln: von groundObjects entfernen
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

    if (this.character.isDead()) {
      this.gameOver = true;
      this.character.stopAllAnimationsAndSounds();
      this.endboss.stopAllAnimationsAndSounds();
      this.backgroundSound.pause();
      setTimeout(() => {
        this.loseSound.play();
        this.showEndscreen("lose");
      }, 1500);
    }

    if (this.endboss.isDead && this.endbossTriggerd) {
      this.gameOver = true;
      this.character.stopAllAnimationsAndSounds();
      this.endboss.stopAllAnimationsAndSounds();
      setTimeout(() => {
        this.winSound.play();
        this.showEndscreen("win");
      }, 1500);
    }
  }

  showEndscreen(outcome) {
    const endscreen = document.getElementById("endscreen");
    const img2 = document.getElementById("image2");
    const btnContainer = document.querySelector(".endscreen-btn-container");
    this.character.stopAllAnimationsAndSounds();

    if (outcome === "win") {
      img2.src = "assets/img/You won, you lost/You won A.png";
    } else {
      img2.src =
        "assets/img/9_intro_outro_screens/game_over/oh no you lost!.png";
    }
    this.showElement(endscreen);
    this.showElement(img2);
    setTimeout(() => {
      this.showElement(btnContainer);
    }, 9000);
  }

  showElement(el) {
    el.classList.remove("hidden");
    el.classList.add("visible");
  }

  draw() {
    if (!this.gameRunning) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (this.gameRunning) {
      this.character.move();
    }
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
    // ---------- Space for fixed Objects ----------
    this.addToMap(this.healthBar);
    this.addToMap(this.coinBar);
    this.addToMap(this.bottleBar);
    if (this.endbossBar.isVisible) {
      this.addToMap(this.endbossBar);
    }
    this.ctx.translate(this.camera_x, 0);
    this.addToMap(this.character);
    this.ctx.translate(-this.camera_x, 0);

    if (this.gameRunning) {
      requestAnimationFrame(() => this.draw());
    }
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
