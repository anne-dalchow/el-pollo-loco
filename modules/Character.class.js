import MoveableObject from "./MoveableObject.class.js";

export default class Character extends MoveableObject {
  height = 280;
  width = 150;
  posX = 80;
  posY = 160;
  IMAGES_WALKING = [
    "assets/img/2_character_pepe/2_walk/W-21.png",
    "assets/img/2_character_pepe/2_walk/W-22.png",
    "assets/img/2_character_pepe/2_walk/W-23.png",
    "assets/img/2_character_pepe/2_walk/W-24.png",
    "assets/img/2_character_pepe/2_walk/W-25.png",
    "assets/img/2_character_pepe/2_walk/W-26.png",
  ];

  constructor(world, keyboard) {
    super();
    this.loadImg("assets/img/2_character_pepe/2_walk/W-21.png");
    this.loadImages(this.IMAGES_WALKING);
    this.keyboard = keyboard;
    this.world = world
    this.isWalking = false;
  }

  startWalkingAnimation() {
    this.walkingAnimation();
    this.isWalking = true;
  }

  move() {
    let movingHorizontally = false;
  
    switch (true) {
      case this.keyboard.shift && this.keyboard.right && this.posX < this.world.level.levelEndPosX:
        this.posX += 10;
        movingHorizontally = true;
        this.otherDirection = false;
        break;
      case this.keyboard.shift && this.keyboard.left && this.posX > 0:
        this.posX -= 10;
        movingHorizontally = true;
        this.otherDirection = true;
        break;
      case this.keyboard.right && this.posX < this.world.level.levelEndPosX:
        this.posX += 5;
        movingHorizontally = true;
        this.otherDirection = false;
        break;
      case this.keyboard.left && this.posX > 0:
        this.posX -= 5;
        movingHorizontally = true;
        this.otherDirection = true;
        break;
    }

    this.world.camera_x = -this.posX + 100;
  
    if (movingHorizontally) {
      if (!this.isWalking) {
        this.startWalkingAnimation();
      }
    } else if (this.isWalking) {
      this.isWalking = false;
    }
  }


  

  walkingAnimation() {
    const animate = () => {
      let i = this.currentImage % this.IMAGES_WALKING.length;
      let path = this.IMAGES_WALKING[i];
      this.img = this.imageCache[path]; // Bild aus dem Cache holen
      this.currentImage++;

      setTimeout(() => {
        if (this.isWalking) {
          // Animation nur fortsetzen, wenn der Charakter läuft
          requestAnimationFrame(animate);
        }
      }, 100);
    };

    requestAnimationFrame(animate);
  }
}
