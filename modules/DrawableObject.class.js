/**
 * @class DrawableObject - Represents a drawable object that can be rendered on a canvas.
 */
export default class DrawableObject {
  posX;
  posY;
  height;
  width;
  img;
  imageCache = {};
  currentImage = 0;

  /**
   * @method draw - Draws the object on the canvas at its current position.
   * @param {CanvasRenderingContext2D} ctx - The 2D rendering context for drawing on the canvas.
   */
  draw(ctx) {
    try {
      ctx.drawImage(this.img, this.posX, this.posY, this.width, this.height);
    } catch (error) {
      console.warn("Error loading image", error);
      console.log("could not load image", this.img.src);
    }
  }

  /**
   * @method drawFrame - Draws a blue frame around the object to visually check for collisions.
   * This method is used for collision detection purposes and can be uncommented when needed.
   * Note: If uncommented, ensure that the corresponding call in the World class is also uncommented.
   * @param {CanvasRenderingContext2D} ctx - The 2D rendering context for drawing on the canvas.
   */
  // drawFrame(ctx) {
  //   if (
  //     this.constructor.name === "Character" ||
  //     this.constructor.name === "Chicken" ||
  //     this.constructor.name === "ThrowableObject" ||
  //     this.constructor.name === "BrownChicken" ||
  //     this.constructor.name === "Endboss"
  //   ) {
  //     ctx.beginPath();
  //     ctx.lineWidth = "5";
  //     ctx.strokeStyle = "blue";
  //     ctx.rect(this.posX, this.posY, this.width, this.height);
  //     ctx.stroke();
  //   }
  // }

  /**
   * @method loadImg - Loads a single image from the given path.
   * @param {string} path - The path to the image.
   */
  loadImg(path) {
    this.img = new Image();
    this.img.src = path;
  }

  /**
   * @method loadImages - Loads an array of images into the image cache.
   * @param {string[]} arr - An array of paths to the images.
   */
  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }
}
