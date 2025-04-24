
export default class MoveableObject {
 posX = 120;
 posY = 250;
 img;
 height = 150;
 width = 100;

 loadImg(path) {
  this.img = new Image();
  this.img.src = path;
}

 moveRight(){
  console.log("moving right")
 }

 moveLeft(){
  
 }
}