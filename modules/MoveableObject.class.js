export default class MoveableObject {
  posX;
  posY;

  height;
  width;
  img;
  imageCache = {};
  currentImage = 0;

  otherDirection = false;

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
  moveLeft(speed, end) {
    const animate = () => {
      if (this.posX > end) {
        this.posX -= speed;
      } else {
        this.posX = 800;
      }
      
      /**animate-Funktion: konstante Bewegung ohne zeitliche Verzögerung -> daher ohne Pausen/setTimeout */
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }
}
