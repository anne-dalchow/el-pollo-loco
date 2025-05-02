import Character from "./Character.class.js";
import { level1 } from "../levels/level1.js";
import StatusBar from "./StatusBar.class.js";
import CoinBar from "./CoinBar.class.js";
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
  throwableObjects = [];
  maxBottles = 10;
  currentBottles = 0;
  groundObjects = [];
  maxCoins = 15;
  currentCoins = 0;
  //TODO Score for endscreen - show score
  currentScore = 0;
  coins = [];
  collectCoinSound = new Audio("assets/audio/coin.wav");
  collectBottleSound = new Audio("assets/audio/collect.wav");
  characterFrozen = false;
  gameRunning = false;

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.character = new Character(this, this.keyboard);
    this.groundObjects = this.level.bottles;
    this.canThrow = true;

    this.endboss = new Endboss();
    this.endboss.visible = false;
    this.level.enemies.push(this.endboss);
    this.endbossTriggerd = false;

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
  }
  startGameSounds() {
    this.character.startBackgroundSound();
  }
  run() {
    setInterval(() => {
      if (!this.gameRunning) return;

      if (!this.characterFrozen) {
        this.checkCaracterCollision();
        this.checkThrowObjects();
        this.checkBottleHitsEnemy();
        this.checkBottleHitsGround();
        this.checkCollectableItems();
      }

      this.removeObjects();

      if (!this.endbossTriggerd && this.character.posX > 3000) {
        this.endboss.visible = true;
        this.endbossTriggerd = true;
        console.log("Endboss sichtbar gemacht!");
      }
      if (this.endboss.visible && !this.endboss.triggered) {
        this.endboss.startAnimationEndboss(
          this.character,
          this.camera_x,
          this.canvas,
          this
        );
      }
    }, 200);
  }

  checkThrowObjects() {
    if (this.keyboard.d && this.canThrow && this.currentBottles > 0) {
      this.canThrow = false;

      this.character.clearIdleAnimation();

      let bottle = new ThrowableObject(
        this.character.posX + 80,
        this.character.posY + 100,
        true
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
          enemy.die();
          this.character.speedY = -10;
        } else {
          this.character.hit();
          this.healthBar.setPercentage(this.character.energy);
        }
      }
    });
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

  checkCollectableItems() {
    this.level.coins.forEach((coin, index) => {
      if (this.character.isColliding(coin, 40, 60)) {
        this.level.coins.splice(index, 1);
        this.currentCoins++;
        this.currentScore = this.currentCoins * 100;
        this.coinBar.setPercentage((this.currentCoins / this.maxCoins) * 100);

        this.collectCoinSound.volume = 0.2;
        this.collectCoinSound.play().catch((e) => {
          console.warn("Collect-Coin-Sound konnte nicht abgespielt werden:", e);
        });
      }
    });
  }

  checkBottleHitsGround() {
    this.groundObjects.forEach((bottle, index) => {
      if (this.character.isColliding(bottle, 40, 60)) {
        // Flasche einsammeln: von groundObjects entfernen
        this.groundObjects.splice(index, 1);

        this.currentBottles++;
        this.bottleBar.setPercentage(
          (this.currentBottles / this.maxBottles) * 100
        );

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

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (this.gameRunning) {
      this.character.move(); // Nur bewegen, wenn Spiel läuft
    }

    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.groundObjects);

    this.ctx.translate(-this.camera_x, 0);
    // ---------- Space for fixed Objects ----------
    this.addToMap(this.healthBar);
    this.addToMap(this.coinBar);
    this.addToMap(this.bottleBar);
    // ---------- Space for fixed Objects ----------
    this.ctx.translate(this.camera_x, 0);

    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.bottles);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.throwableObjects);

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
