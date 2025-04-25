export default class MoveableObject {
  posX;
  posY;

  height;
  width;
  img;
  imageCache = {};

  loadImg(path) {
    this.img = new Image();
    this.img.src = path;
  }

  /**
   * 
   * @param {Array} arr - ['img/image1.png','img/image1.png',....] Load the image array, create a new Image object, assign the image path to its src property, and add it to the imageCache. Each image is loaded by creating a new Image object, setting its src to the corresponding path, and storing it in the imageCache for later use.
   */

  loadImages(arr){
    arr.forEach((path)=>{
      let img = new Image();
      img.src = path;
      this.imageCache[path] = path;
    })

  }

  animate(posX){
    setInterval(() => {   
      if(this.posX > -350){
        this.posX -=posX;
      } else{
        this.posX = 800;
      }
    },1000/ 60);
  }

  moveRight() {
    console.log("moving right");
  }

  moveLeft() {}
}
