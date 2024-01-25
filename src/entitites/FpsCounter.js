export class FpsCounter {
	constructor() {
		this.fps = 0;
	}
	update(secondsElapsed) {
		this.fps = Math.trunc(1 / secondsElapsed);
	}

  draw(context){
    context.font = "10px Arial";
    context.fillStyle = "yellow";
    context.fillText(`FPS: ${this.fps}`, 10, 10);
  }
}
