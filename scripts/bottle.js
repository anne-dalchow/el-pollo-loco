class ThrowableObject extends MoveableObject {
  rotatingBottles = [
    "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
  ];

  breakingBottles = [
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
  ];

  offset = {
    top: 22,
    left: 10,
    right: 10,
    bottom: 18,
  };

  world;
  throwInterval = null;
  collisionChecked = false;
  isBroken = false;
  otherDirection = false;

  /**
   * @param {number} x - The x-coordinate to spawn the object at
   * @param {number} y - The y-coordinate to spawn the object at
   */
  constructor(x, y, world) {
    super().loadImage(this.rotatingBottles[0]);
    this.loadImages(this.rotatingBottles);
    this.loadImages(this.breakingBottles);
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 68;
    this.world = world;
    this.initiateThrow();
  }

  /**
   * Initializes the throwing sequence of the bottle.
   * This method is called in the constructor and is responsible for triggering the throwing animation
   *  and the throwing logic.
   */
  initiateThrow() {
    this.animate();
    this.throw();
  }

  /**
   * Animates the throwable object by continuously playing its rotating bottle animation.
   * This method sets an interval to update the animation every 50 milliseconds,
   * provided the bottle is not broken.
   * */
  animate() {
    setInterval(() => {
      if (!this.isBroken) {
        this.playAnimation(this.rotatingBottles);
      }
    }, 50);
  }

  /**
   * Throws the bottle by setting the vertical speed of the bottle to 10, applies gravity to the bottle,
   *  checks the direction of the bottle (to see if it should be flipped),
   *  and then starts an interval to update the throwing logic every 25 milliseconds.
   */
  throw() {
    this.speedY = 10;
    this.applyGravity();
    this.checkDirection();
    this.world.bottlesstatusBar.setPercentageFromBottles();
    this.throwInterval = setInterval(() => {
      this.throwToEnemy();
      this.throwToFloor();
      this.throwing();
    }, 25);
  }

  /**
   * Checks the direction of the character and assigns it to the otherDirection property of the ThrowableObject.
   */
  checkDirection() {
    this.otherDirection = world.character.otherDirection;
  }

  /**
   * Moves the bottle to the right or left by 5 units.
   * If the bottle is moving to the right (otherDirection is false), it moves to the right.
   * If the bottle is moving to the left (otherDirection is true), it moves to the left.
   */
  throwing() {
    if (this.otherDirection === false) {
      this.x += 5;
    } else {
      this.x -= 5;
    }
  }

  /**
   * Checks if the bottle has hit an enemy or the endboss. If a collision is detected, it sets the bottle as broken,
   * sets the collision checked flag to true, and triggers the dying animation of the target or the hurt animation
   * of the endboss. If the target was an enemy, it also triggers the onEnemyCollision method of the bottle.
   */
  throwToEnemy() {
    if (this.isBroken || this.collisionChecked) return;

    const targets = [...world.level.enemies, world.endboss];
    targets.forEach((target) => {
      if (this.isColliding(target)) {
        this.isBroken = true;
        this.collisionChecked = true;
        target.dyingAnimation
          ? target.dyingAnimation()
          : target.hurtAnimation(world);
        this.onEnemyCollision();
      }
    });
  }

  /**
   * Checks if the bottle has hit the ground. If a collision is detected, it sets the bottle as broken,
   * sets the collision checked flag to true, and triggers the groundCollision method.
   */
  throwToFloor() {
    if (this.y >= 378 && !this.collisionChecked) {
      this.isBroken = true;
      this.groundCollision();
    }
  }

  /**
   * Removes the bottle from the world after a collision with the ground. After a brief animation,
   * the bottle is removed from the world. The sound effect for a bottle hitting the ground is played.
   */
  groundCollision() {
    clearInterval(this.throwInterval);
    world.sounds.COLLIDE_BOTTLE.play();
    this.playAnimation(this.breakingBottles);
    this.speedY = 0;
    this.acceleration = 0;
    setTimeout(() => {
      const index = world.throwableObjects.indexOf(this);
      if (index !== -1) {
        world.throwableObjects.splice(index, 1);
      }
    }, 500);
  }

  /**
   * Removes the bottle from the world after a collision with an enemy. After a brief animation, the bottle is removed
   * from the world. This method is called by the throwToEnemy method after a collision with an enemy is detected.
   */
  onEnemyCollision() {
    clearInterval(this.throwInterval);
    this.speedY = 0;
    this.acceleration = 0;
    this.playAnimation(this.breakingBottles);
    setTimeout(() => {
      const index = world.throwableObjects.indexOf(this);
      if (index !== -1) {
        world.throwableObjects.splice(index, 1);
      }
    }, 100);
  }
}
