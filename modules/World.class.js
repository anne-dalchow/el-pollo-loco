import Character from "./Character.class.js";
import Chicken from "./Chicken.class.js";
import Clouds from "./Clouds.class.js";

export default class World {
  character = new Character();
  enemies = [new Chicken(), new Chicken(), new Chicken()];
  clouds = new Clouds();
  canvas;

  ctx;

  constructor(canvas) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.draw(); // startet Loop
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(
      this.character.img,
      this.character.posX,
      this.character.posY,
      this.character.width,
      this.character.height
    );

    this.enemies.forEach((enemy) => {
     this.ctx.drawImage(
       enemy.img,
       enemy.posX,
       enemy.posY,
       enemy.width,
       enemy.height
     );

     this.ctx.drawImage(
      this.clouds.img,
      this.clouds.posX,
      this.clouds.posY,
      this.clouds.width,
      this.clouds.height
     )
   });

    requestAnimationFrame(() => this.draw());
  }
}
