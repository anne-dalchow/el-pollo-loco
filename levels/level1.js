import { Level } from "../modules/Level.class.js";
import Chicken from "../modules/Chicken.class.js";
import BackgroundObject from "../modules/BackgroundObject.class.js";
import { layers } from "./backgroundLevel1.js";
import Clouds from "../modules/Clouds.class.js";

export const level1 = new Level(
 [new Chicken(), new Chicken(), new Chicken(), new Chicken()],
 [new Clouds(), new Clouds()],
 
 layers.map(layer => 
     new BackgroundObject(layer.path, layer.offsetX, 0)
   )
);