export class Stage{
  constructor(){
    this.image = document.getElementById("StageImage");
  }

  update = () => {}

  draw = (context) => {
    context.drawImage(this.image, 0, 0);
  }
}