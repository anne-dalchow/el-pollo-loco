export class Level{
   enemies;
   clouds;
   backgroundObjects;
   levelEndPosX = 4800;
   constructor(enemies,clouds,backgroundObjects){
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
   }
}