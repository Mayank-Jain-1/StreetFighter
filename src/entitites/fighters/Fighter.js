export class Fighter {
  constructor(name, x, y, velocity){
    this.name = name;
    this.position = {x,y}
    this.velocity = velocity;
    this.image = new Image();
    this.frames = new Map();
    this.animationFrame = 0;
    this.animationTime = 0;
    this.state = 'walkForwards';
    this.animations = {}
  }

  

  update = (time,context) =>{

    if(time.previous >= this.animationTime + 60){
      this.animationTime = time.previous;
      this.animationFrame++;
      if(this.animationFrame > 5) this.animationFrame = 0;
    }

    const [[,,width]] = this.frames.get(this.animations[this.state][this.animationFrame]);
    this.position.x +=  Math.round(this.velocity * time.secondsPassed)
    if(this.position.x + width/2 >= context.canvas.width || this.position.x - width/2 <= 0){
      this.velocity *= -1;
      this.state === 'walkForwards' ? this.state = 'walkBackwards' : this.state = 'walkForwards';
      console.log(this.position)
    }
  }

  draw = (context) => {
    const [[x,y,width, height], [originX, originY]] = this.frames.get(this.animations[this.state][this.animationFrame]);
    context.drawImage(this.image,x,y,width,height, this.position.x - originX , this.position.y - originY, width,height);
  }

}