import { Level } from "../modules/Level.class.js";
import Chicken from "../modules/Chicken.class.js";
import BackgroundObject from "../modules/BackgroundObject.class.js";
import { layers } from "./backgroundLevel1.js";
import Clouds from "../modules/Clouds.class.js";
import Endboss from "../modules/Endboss.class.js";

const levelWidth = 799 * 6;
const numberOfChickens = 7;
const distancePerChicken = levelWidth / numberOfChickens;
const chickens = [];

for (let i = 1; i <= numberOfChickens; i++) {
  let basePos = i * distancePerChicken;
  let randomOffset = (Math.random() - 0.5) * 300; // leichte Abweichung (+/- 100px)
  let finalPos = basePos + randomOffset;

  let chicken = new Chicken();
  chicken.posX = finalPos;
  chickens.push(chicken);
}

export const level1 = new Level(
  [...chickens, new Endboss()],
  [new Clouds(), new Clouds()],
  layers.map((layer) => new BackgroundObject(layer.path, layer.offsetX, 0))
);
