export default class DrawableObject {
  posX;
  posY;
  height;
  width;
  img;
  imageCache = {};
  currentImage = 0;

  draw(ctx) {
    ctx.drawImage(this.img, this.posX, this.posY, this.width, this.height);
  }

  drawFrame(ctx) {
    if (
      this.constructor.name === "Character" ||
      this.constructor.name === "Chicken"
    ) {
      ctx.beginPath();
      ctx.lineWidth = "5";
      ctx.strokeStyle = "blue";
      ctx.rect(this.posX, this.posY, this.width, this.height);
      ctx.stroke();
    }
  }

  loadImg(path) {
    this.img = new Image();
    this.img.src = path;
  }

  /**
   * @param {Array} arr - ['img/image1.png','img/image1.png',....] Load the image array, create a new Image object, assign the image path to its src property, and add it to the imageCache. Each image is loaded by creating a new Image object, setting its src to the corresponding path, and storing it in the imageCache for later use.
   */

  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }
}
