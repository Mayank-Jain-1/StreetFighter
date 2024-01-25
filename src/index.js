import { Ken } from "./entitites/fighters/Ken.js";
import { Ryu } from "./entitites/fighters/Ryu.js";
import { FpsCounter } from "./entitites/FpsCounter.js";
import { Stage } from "./entitites/Stage.js";

const GameViewport = {
  WIDTH: 384,
  HEIGHT: 224,
  SCALE: 1,
};


window.onload = () => {
  const canvasEL = document.querySelector('canvas');
  const context = canvasEL.getContext('2d');
  canvasEL.width = GameViewport.WIDTH ;
  canvasEL.height = GameViewport.HEIGHT;

  const entities = [
    new Stage(),
    new Ryu(180,80, -150),
    new Ken(80, 80,150 ), 
    new FpsCounter(),
  ]

  let secondsElapsed = 0;
  let previousTime = 0;

  const frame = (time) => {
    secondsElapsed = (time - previousTime)/1000;
    previousTime = time;
    window.requestAnimationFrame(frame)
    for( const entity of entities ) {
      entity.update( secondsElapsed, context);
    }
    for( const entity of entities ) {
      entity.draw(context);
    }
  }

  window.requestAnimationFrame(frame)

}