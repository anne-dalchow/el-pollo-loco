import Character from "./Character.class.js";
import { level1 } from "../levels/level1.js";
import StatusBar from "./StatusBar.class.js";
import CoinBar from "./CoinBar.class.js";
import BottleBar from "./BottleBar.class.js";
import ThrowableObject from "./ThrowableObject.class.js";

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
  collectBottleSound = new Audio("assets/audio/collect.wav");

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.character = new Character(this, this.keyboard);
    this.groundObjects = this.level.bottles;
    this.draw(); // startet Loop
    this.run();
  }
  startGameSounds() {
    this.character.startBackgroundSound();
  }
  run() {
    setInterval(() => {
      this.checkCaracterCollision();
      this.checkThrowObjects();
      this.checkBottleHitsEnemy();
      this.checkBottleHitsGround();
      this.removeObjects();
    }, 200);
  }

  checkThrowObjects() {
    if (this.keyboard.d && this.currentBottles > 0) {
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
      if (this.character.isColliding(enemy) && !enemy.isDead) {
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

  checkBottleHitsGround() {
    this.groundObjects.forEach((bottle, index) => {
      if (this.character.isColliding(bottle)) {
        // Flasche einsammeln: von groundObjects entfernen
        this.groundObjects.splice(index, 1);

        // Erhöhe den Flaschenbestand nur, wenn Limit nicht überschritten
        if (this.currentBottles < this.maxBottles) {
          this.currentBottles++;
          this.bottleBar.setPercentage(
            (this.currentBottles / this.maxBottles) * 100
          );
        }

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
    this.character.move();

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
