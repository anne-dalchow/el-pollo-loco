

export default class MoveableObject {
 constructor(posX,posY,img){
  this.posX = posX;
  this.posY = posY;
  this.img = img;
 }
 moveRight(){
  console.log("moving right")
 }
 moveLeft(){}
}