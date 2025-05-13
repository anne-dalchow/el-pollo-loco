import { Level } from "../modules/Level.class.js";
import Chicken from "../modules/Chicken.class.js";
import BrownChicken from "../modules/BrownChicken.class.js";
import BackgroundObject from "../modules/BackgroundObject.class.js";
import { layers } from "./backgroundLevel1.js";
import Clouds from "../modules/Clouds.class.js";
import Coins from "../modules/Coins.class.js";
import ThrowableObject from "../modules/ThrowableObject.class.js";

/**
 * @fileoverview Defines and initializes the configuration of "level1" in the game.
 * This includes spawning enemies, collectible coins, throwable bottles, clouds, and background layers.
 * The level is dynamically populated with randomized positions for better replayability.
 */

// --- Configuration Constants ---
const levelWidthTotal = 799 * 6;
const levelWidthSingle = 799;
const numberOfChickens = 6;
const numberOfCoins = 15;
const numberOfBottles = 10;

// --- Spawn Distribution Distances ---
const distancePerChicken = levelWidthTotal / numberOfChickens;
const distancePerCoin = (levelWidthTotal - levelWidthSingle) / numberOfCoins;
const distancePerBottle =
  (levelWidthTotal - levelWidthSingle) / numberOfBottles;

/**
 * Initializes and returns a fully populated Level instance.
 * The level includes a mix of enemies, collectible coins, throwable bottles,decorative background layers, and cloud animations.
 * @param {SoundManager} soundManager - Instance of the sound manager used to play effects for interactable objects.
 * @returns {Level} A complete Level object with all configured game elements.
 */
export const level1 = (soundManager) => {
  const chickens = [];
  const coins = [];
  const bottles = [];

  // Spawn chickens and brown chickens at randomized horizontal positions
  for (let i = 1; i <= numberOfChickens; i++) {
    const basePos = i * distancePerChicken;
    const randomOffset1 = (Math.random() - 0.5) * 300;
    const randomOffset2 = (Math.random() - 1) * 300;
    const chicken = new Chicken(soundManager);
    const brownChicken = new BrownChicken(soundManager);
    chicken.posX = basePos + randomOffset1;
    brownChicken.posX = basePos + randomOffset2;
    chickens.push(chicken);
    chickens.push(brownChicken);
  }

  // Spawn coins at randomized positions along the level
  for (let i = 1; i <= numberOfCoins; i++) {
    const basePos = i * distancePerCoin;
    const randomOffset = (Math.random() - 0.5) * 300;
    const coin = new Coins();
    coin.posX = basePos + randomOffset;
    coins.push(coin);
  }

  // Spawn throwable bottles
  for (let i = 1; i <= numberOfBottles; i++) {
    const basePos = i * distancePerBottle;
    const randomOffset = (Math.random() - 0.5) * 300;
    const bottle = new ThrowableObject(
      soundManager,
      basePos + randomOffset,
      370
    );
    bottles.push(bottle);
  }

  /**
   * Return the constructed level with all its objects.
   * - Enemies: Chickens and brown chickens
   * - Background: Cloud instances and image layers
   * - Collectibles: Coins and throwable bottles
   */
  return new Level(
    [...chickens],
    [
      new Clouds(),
      new Clouds(),
      new Clouds(),
      new Clouds(),
      new Clouds(),
      new Clouds(),
    ],
    layers.map((layer) => new BackgroundObject(layer.path, layer.offsetX, 0)),
    coins,
    bottles
  );
};
