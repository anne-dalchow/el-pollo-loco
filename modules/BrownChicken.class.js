import Enemies from "./Enemies.class.js";

export default class BrownChicken extends Enemies {
  constructor(soundManager) {
    super(
      [
        "assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
        "assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
        "assets/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
      ],
      "assets/img/3_enemies_chicken/chicken_normal/2_dead/dead.png",
      350,
      80,
      80,
      soundManager
    );
  }
}
