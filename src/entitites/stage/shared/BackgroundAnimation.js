import { drawFrame } from "../../../utils/context.js";

export class BackgroundAnimation {
	constructor(name, image, frames, animation, startFrame = 0) {
		this.name = name;
		this.image = image;
		this.frames = new Map(frames);
		this.animation = animation;
		this.animationTimer = 0;
		this.animationFrame = startFrame;
		this.frameDelay = animation[this.animationFrame][1];
	}

	update = (time) => {
		if (time.previous > this.animationTimer + this.frameDelay) {
			this.animationFrame++;
			if (this.animationFrame >= this.animation.length) {
				this.animationFrame = 0;
			}
			this.frameDelay = this.animation[this.animationFrame][1];
			this.animationTimer = time.previous;
		}
	};

	draw = (context, camera, x = 0, y = 0) => {
		const dimensions = this.frames.get(this.animation[this.animationFrame][0]);
		const height = dimensions[3];
		drawFrame(
			context,
			this.image,
			dimensions,
			x,
			-height + y - camera.position.y
		);
	};
}
