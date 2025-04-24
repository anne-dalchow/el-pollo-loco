import MoveableObject from "./MoveableObject.class.js";

export default class Clouds extends MoveableObject {
  posY = 50;
  width = 400;
  height = 300;

  constructor() {
    super();
    this.loadImg("assets/img/5_background/layers/4_clouds/1.png");
    this.posX = Math.random() * 800;
  }
}
