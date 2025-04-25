import Character from "./Character.class.js";
import Chicken from "./Chicken.class.js";
import Clouds from "./Clouds.class.js";
import BackgroundObject from "./BackgroundObject.class.js";

export default class World {
  // character = new Character(this.keyboard);
  enemies = [new Chicken(), new Chicken(), new Chicken(), new Chicken()];
  clouds = [new Clouds(), new Clouds()];
  BackgroundObjects = [
    new BackgroundObject("assets/img/5_background/layers/air.png", 0, 0),
    new BackgroundObject(
      "assets/img/5_background/layers/3_third_layer/1.png",
      0
    ),
    new BackgroundObject(
      "assets/img/5_background/layers/2_second_layer/1.png",
      0
    ),
    new BackgroundObject(
      "assets/img/5_background/layers/1_first_layer/1.png",
      0
    ),
  ];

  canvas;
  ctx;

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard; // Steuerung wird gespeichert
    this.character = new Character(this.keyboard);
    this.draw(); // startet Loop
  }



  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  
    this.addObjectsToMap(this.BackgroundObjects);
    this.addObjectsToMap(this.clouds);
    this.addObjectsToMap(this.enemies);
    this.addToMap(this.character);

    this.character.move();

    requestAnimationFrame(() => this.draw());
  }

  addObjectsToMap(objects) {
    objects.forEach((obj) => {
      this.addToMap(obj);
    });
  }

  addToMap(mo) {
    this.ctx.drawImage(mo.img, mo.posX, mo.posY, mo.width, mo.height);
  }
}
