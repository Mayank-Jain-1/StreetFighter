import { STAGE_FLOOR } from "../constants/Stage.js";
import { drawFrame } from "../utils/context.js";

export class Stage {
	constructor() {
		this.image = document.getElementById("KenStage");
		this.frames = new Map([
			["stage-background", [72, 208, 768, 176]],
			["stage-boat", [8, 16, 521, 180]],
			["stage-floor", [8, 392, 896, 72]],
		]);
	}

	drawFrame = (context, frameKey, x, y, direction = 1) => {
		drawFrame(context, this.image, this.frames.get(frameKey), x, y, direction);
	};

	update = (time, context, camera) => {};

	draw = (context, camera) => {
		this.drawFrame(
			context,
			"stage-background",
			Math.floor(16 - camera.position.x / 2.157303),
			-camera.position.y
		);
		this.drawFrame(
			context,
			"stage-boat",
			Math.floor(150 - camera.position.x / 1.613445),
			-1 - camera.position.y
		);
		this.drawFrame(
			context,
			"stage-floor",
			Math.floor(192 - camera.position.x),
			176 - camera.position.y
		);
	};
}
