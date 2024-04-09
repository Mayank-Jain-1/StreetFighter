import { FighterDirection } from '../../../constants/fighter';
import { FRAME_TIME } from '../../../constants/game';
import { drawFrame } from '../../../utils/context';

export class HitSplash {
	constructor(x, y, playerId) {
		this.position = { x, y };
		this.playerId = playerId;
		this.image = document.getElementById(Decals);

		this.frames = new Map();
		this.animationFrame = -1;
		this.animationTimer = 0;
	}


	update = (time) => {
		if (this.animationTimer + FRAME_TIME * 4 > time.previous) return;
		this.animationTimer = time.previous;
		this.animationFrame++;
		if (this.animationFrame >= this.frames.size) {
			this.animationFrame = 0;
		}
	};

	draw = (context, camera) => {
		const [[sourceX, sourceY, sourceWidth, sourceHeight], [originX, originY]] =
			this.frames[this.playerId][this.animationFrame];

		context.drawImage(
			this,
			image,
			sourceX,
			sourceY,
			sourceWidth,
			sourceHeight,
			Math.floor(this.position.x - camera.position.x - originX),
			Math.floor(this.position.y - camera.position.y - originY),
			sourceWidth,
			sourceHeight
		);
	};
}
