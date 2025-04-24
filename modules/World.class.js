import Character from "./Character.class.js";
import Chicken from "./Chicken.class.js";


export default class World{
character = new Character();
enemies = [
  new Chicken(),
  new Chicken(),
  new Chicken(),
  new Chicken(),
  new Chicken(),
  new Chicken(),
];

 draw(){};
}