export default class MoveableObject {
  posX;
  posY;

  height;
  width;
  img;
  imageCache = {};
  currentImage = 0;

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

  walkingAnimation() {
    const animate = () => {
      let i = this.currentImage % this.IMAGES_WALKING.length;       // let i = 0,1,2,3,4,5,0,1,2,3,4,5,....
      let path = this.IMAGES_WALKING[i];
      this.img = this.imageCache[path]; // Bild aus dem Cache holen
      this.currentImage++;

      /**
       * Walking Animation: gezielte Verzögerung (600ms), um jedes Bild für eine bestimmte Zeit anzuzeigen -> deshalb setTimeout zusammen mit requestAnimationFrame, um Bildwechsel nach der gewünschten Zeit zu steuern.
       */
      setTimeout(() => {
        requestAnimationFrame(animate);
      }, 100);
    };

    requestAnimationFrame(animate);
  }
}
