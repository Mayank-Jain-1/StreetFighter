import { STAGE_FLOOR } from "./constants/Stage.js";
import { Ken } from "./entitites/fighters/Ken.js";
import { Ryu } from "./entitites/fighters/Ryu.js";
import { FpsCounter } from "./entitites/FpsCounter.js";
import { Stage } from "./entitites/Stage.js";



window.onload = () => {
  const canvasEL = document.querySelector('canvas');
  const context = canvasEL.getContext('2d');

  const entities = [
    new Stage(),
    new Ryu(180,STAGE_FLOOR, 150),
    new Ken(80, STAGE_FLOOR, 150 ), 
    new FpsCounter(),
  ]

  let frameTime = {
    secondsPassed: 0,
    previous:0
  }

  const frame = (time) => {
    window.requestAnimationFrame(frame)

    frameTime = {
      secondsPassed: (time - frameTime.previous)/1000,
      previous:time
    }
    for( const entity of entities ) {
      entity.update( frameTime, context);
    }
    for( const entity of entities ) {
      entity.draw(context);
      context.drawImage
    }
  }

  window.requestAnimationFrame(frame)

}