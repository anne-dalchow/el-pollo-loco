import Enemies from "./Enemies.class.js";

export default class Chicken extends Enemies {
  constructor(soundManager) {
    super(
      [
        "assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
        "assets/img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
        "assets/img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
      ],
      "assets/img/3_enemies_chicken/chicken_small/2_dead/dead.png",
      370,
      50,
      50,
      soundManager
    );
  }
}
