export default class MoveableObject {
  posX;
  posY;
  img;
  height;
  width;

  loadImg(path) {
    this.img = new Image();
    this.img.src = path;
  }

  moveRight() {
    console.log("moving right");
  }

  moveLeft() {}
}
