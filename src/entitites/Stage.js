import { STAGE_FLOOR } from "../constants/Stage.js";
import { FRAME_TIME } from "../constants/game.js";
import { drawFrame } from "../utils/context.js";

export class Stage {
	constructor() {
		this.image = document.getElementById("KenStage");
		this.frames = new Map([
			["stage-background", [72, 208, 768, 176]],
			["stage-boat", [8, 16, 521, 180]],
			["stage-floor", [8, 392, 896, 72]],
		]);

		this.boat = {
			position: {
				x: 0,
				y: 0,
			},
			animationFrame: 0,
			animationDelay: 22,
			animationTimer: 0,
			animation: [0, -1, -2, -3, -4, -3, -2, -1],
		};
	}

	drawFrame = (context, frameKey, x, y, direction = 1) => {
		drawFrame(context, this.image, this.frames.get(frameKey), x, y, direction);
	};

	drawBoat = (context, camera) => {
		this.boat.position = {
			x: Math.floor(150 - camera.position.x / 1.613445),
			y: -camera.position.y - this.boat.animation[this.boat.animationFrame],
		};
		this.drawFrame(
			context,
			"stage-boat",
			this.boat.position.x,
			this.boat.position.y
		);
	};

	updateBoat = (time, context) => {
		if (
			time.previous >
			this.boat.animationTimer + this.boat.animationDelay * FRAME_TIME
		) {
			this.boat.animationTimer = time.previous;
			this.boat.animationFrame++;
			this.boat.animationDelay = 22 + (Math.random() * 16 - 8);

			if (this.boat.animationFrame >= this.boat.animation.length) {
				this.boat.animationFrame = 0;
			}
		}
	};

	update = (time, context, camera) => {
		this.updateBoat(time, context);
	};

	draw = (context, camera) => {
		this.drawFrame(
			context,
			"stage-background",
			Math.floor(16 - camera.position.x / 2.157303),
			-camera.position.y
		);

		this.drawBoat(context, camera);

		this.drawFrame(
			context,
			"stage-floor",
			Math.floor(192 - camera.position.x),
			176 - camera.position.y
		);
	};
}
