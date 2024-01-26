export class Fighter {
  constructor(name, x, y, velocity){
    this.name = name;
    this.position = {x,y}
    this.velocity = velocity;
    this.image = new Image();
    this.frames = new Map();
    this.animationFrame = 1;
    this.animationTime = 0;
  }

  

  update = (time,context) =>{

    if(time.previous >= this.animationTime + 60){
      this.animationTime = time.previous;
      this.animationFrame++;
      if(this.animationFrame > 6) this.animationFrame = 1;
    }

    const [[,,width]] = this.frames.get(`forwards-${this.animationFrame}`);
    this.position.x +=  this.velocity * time.secondsPassed
    if(this.position.x + width >= context.canvas.width || this.position.x <= 0){
      this.velocity *= -1;
    }
  }

  draw = (context) => {
    const [[x,y,width, height], [originX, originY]] = this.frames.get(`forwards-${this.animationFrame}`);
    context.drawImage(this.image,x,y,width,height, Math.round(this.position.x - originX) , Math.round(this.position.y - originY), width,height);
  }

}