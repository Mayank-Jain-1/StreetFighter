export class Fighter {
  constructor(name, x, y, velocity){
    this.name = name;
    this.position = {x,y}
    this.velocity = velocity;
    this.image = new Image();
  }

  

  update = (secondsElapsed,context) =>{
    this.position.x += this.velocity * secondsElapsed;
    if(this.position.x + this.image.width >= context.canvas.width || this.position.x <= 0){
      this.velocity *= -1;
    }
  }

  draw = (context) => {
    context.drawImage(this.image, this.position.x, this.position.y);
  }

}