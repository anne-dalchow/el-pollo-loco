import { Level } from "../modules/Level.class.js";
import Chicken from "../modules/Chicken.class.js";
import BackgroundObject from "../modules/BackgroundObject.class.js";
import { layers } from "./backgroundLevel1.js";
import Clouds from "../modules/Clouds.class.js";
import Endboss from "../modules/Endboss.class.js";
import Coins from "../modules/Coins.class.js";
import ThrowableObject from "../modules/ThrowableObject.class.js";

const levelWidth = 799 * 6;
const numberOfChickens = 7;
const numberOfCoins = 15;
const numberOfBottles = 10;

const distancePerChicken = levelWidth / numberOfChickens;
const distancePerCoin = levelWidth / numberOfCoins;
const distancePerBottle = levelWidth / numberOfBottles;

const chickens = [];
const coins = [];
const bottles = [];

//TODO create function with paramethers

for (let i = 1; i <= numberOfChickens; i++) {
  const basePos = i * distancePerChicken;
  const randomOffset = (Math.random() - 0.5) * 300;
  const chicken = new Chicken();
  chicken.posX = basePos + randomOffset;
  chickens.push(chicken);
}

for (let i = 1; i <= numberOfCoins; i++) {
  const basePos = i * distancePerCoin;
  const randomOffset = (Math.random() - 0.5) * 300;
  const coin = new Coins();
  coin.posX = basePos + randomOffset;
  coins.push(coin);
}

for (let i = 1; i <= numberOfBottles; i++) {
  const basePos = i * distancePerBottle;
  const randomOffset = (Math.random() - 0.5) * 300;
  const bottle = new ThrowableObject(basePos + randomOffset, 360); // Bodenhöhe z.B. 380
  bottles.push(bottle);
}

export const level1 = new Level(
  [...chickens, new Endboss()],
  [new Clouds(), new Clouds()],
  layers.map((layer) => new BackgroundObject(layer.path, layer.offsetX, 0)),
  coins,
  bottles
);
