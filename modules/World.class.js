import Character from "./Character.class.js";
import { level1 } from "../levels/level1.js";
import StatusBar from "./StatusBar.class.js";
import CoinBar from "./CoinBar.class.js";
import EndbossBar from "./EndbossBar.class.js";
import BottleBar from "./BottleBar.class.js";
import ThrowableObject from "./ThrowableObject.class.js";
import Endboss from "./Endboss.class.js";

export default class World {
  level = level1;
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
  //TODO Score for endscreen - show score
  currentScore = 0;
  coins = [];

  characterFrozen = false;
  gameRunning = false;

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.character = new Character(this, this.keyboard);
    this.endboss = new Endboss(this, this.character);
    this.groundObjects = this.level.bottles;
    this.levelGround = 420;
    this.canThrow = true;

    this.endboss.visible = false;

    this.endbossTriggerd = false;
    this.backgroundSound = null;

    this.draw();
    this.run();
  }

  startGame() {
    this.gameRunning = true;
    this.run();

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

  startGameSounds() {
    if (!this.backgroundSound) {
      this.backgroundSound = new Audio("assets/audio/background.wav");
      this.backgroundSound.loop = true;
      this.backgroundSound.volume = 0.2;
    }
    this.backgroundSound.play().catch((e) => {
      console.warn("Hintergrundsound konnte nicht gestartet werden:", e);
    });
  }

  run() {
    setInterval(() => {
      if (!this.gameRunning) return;
      if (!this.characterFrozen) {
        this.checkCaracterCollision();
        this.checkEndbossCollision();
        this.checkThrowObjects();
        this.checkBottleHitsEnemy();
        this.checkBottleHitsEndboss();
        // this.checkBottleHitsGround();
        this.handleBottleCollection();
        this.handleCoinCollection();
      }
      this.triggerEndboss();
      this.removeObjects();
      this.checkGameOver();
    }, 100);
    clearInterval(this.runInterval);
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

  isLeftHit(impactObject, target) {
    return (
      impactObject.posX + impactObject.width >= target.posX &&
      impactObject.posX < target.posX &&
      impactObject.posY + impactObject.height > target.posY
    );
  }

  isRightHit(impactObject, target) {
    return (
      impactObject.posX <= target.posX + target.width &&
      impactObject.posX + impactObject.width > target.posX + target.width &&
      impactObject.posY + impactObject.height > target.posY
    );
  }

  checkCaracterCollision() {
    this.level.enemies.forEach((enemy) => {
      if (this.character.isColliding(enemy, 40, 60) && !enemy.isDead) {
        if (this.isTopHit(this.character, enemy)) {
          enemy.die();
          this.character.speedY = -10;
        } else {
          this.character.hit(5);
          this.healthBar.setPercentage(this.character.energy);
        }
      }
    });
  }

  checkEndbossCollision() {
    if (this.character.isColliding(this.endboss, 40, 60)) {
      if (!this.character.isHurt()) {
        this.character.hit(10); // z. B. 10 Schaden
        this.healthBar.setPercentage(this.character.energy);
      }
    }
  }

  checkBottleHitsEnemy() {
    this.throwableObjects.forEach((bottle) => {
      this.level.enemies.forEach((enemy) => {
        if (bottle.isColliding(enemy) && !enemy.isDead) {
          enemy.die();
          bottle.markForRemoval = true;
        }
      });
    });
  }

  checkBottleHitsEndboss() {
    this.throwableObjects.forEach((bottle) => {
      if (bottle.isColliding(this.endboss) && !this.endboss.isDead) {
        if (
          this.isTopHit(bottle, this.endboss) ||
          this.isLeftHit(bottle, this.endboss) ||
          this.isRightHit(bottle, this.endboss)
        ) {
          this.endboss.hit(20);
          this.endbossBar.setPercentage(this.endboss.energy);
          bottle.markForRemoval = true;

          if (this.endboss.energy <= 0) {
            this.endboss.die();
          }
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

        this.collectCoinSound = new Audio("assets/audio/coin.wav");
        this.collectCoinSound.volume = 0.2;
        this.collectCoinSound.play().catch((e) => {
          console.warn("Collect-Coin-Sound konnte nicht abgespielt werden:", e);
        });
      }
    });
  }

  handleBottleCollection() {
    this.groundObjects.forEach((bottle, index) => {
      if (this.character.isColliding(bottle, 40, 60)) {
        // Flasche einsammeln: von groundObjects entfernen
        this.groundObjects.splice(index, 1);

        this.currentBottles++;
        this.bottleBar.setPercentage(
          (this.currentBottles / this.maxBottles) * 100
        );

        this.collectBottleSound = new Audio("assets/audio/collect.wav");
        this.collectBottleSound.volume = 0.1;
        this.collectBottleSound.play().catch((e) => {
          console.warn(
            "Collect-Bottle-Sound konnte nicht abgespielt werden:",
            e
          );
        });
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
    console.log(
      "character alive?",
      !this.character.isDead(),
      "Energy:",
      this.character.energy
    );
    if (this.gameOver) return;

    if (this.character.isDead()) {
      this.gameOver = true;
      this.showEndscreen("lose");
    }

    if (this.endboss.isDead && this.endbossTriggerd) {
      this.gameOver = true;
      this.showEndscreen("win");
    }
  }

  showEndscreen(outcome) {
    // this.stopAllAnimationsAndSounds();

    const endscreen = document.getElementById("endscreen");
    const img1 = document.getElementById("image1");
    const img2 = document.getElementById("image2");

    if (outcome === "win") {
      img1.src = "assets/img/You won, you lost/Game over A.png";
      img2.src = "assets/img/You won, you lost/You won a.png";
    } else {
      img1.src = "assets/img/You won, you lost/Game over A.png";
      img2.src = "assets/img/You won, you lost/You lost b.png";
    }

    endscreen.classList.remove("hidden");
    endscreen.classList.add("visible");

    img1.classList.remove("hidden");
    img1.classList.add("visible");

    setTimeout(() => {
      img1.classList.remove("visible");
      img1.classList.add("hidden");

      img2.classList.remove("hidden");
      img2.classList.add("visible");
    }, 2000);
  }

  draw() {
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
    // ---------- Space for fixed Objects ----------
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
    mo.drawFrame(this.ctx);
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
