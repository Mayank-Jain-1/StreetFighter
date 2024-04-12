import { STAGE_FLOOR } from '../../../constants/Stage.js';

export class Shadow {
	constructor(fighter) {
		this.fighter = fighter;
		this.image = document.getElementById('ShadowImage');
		this.frame = [
			[0, 0, 43, 9],
			[21, 7],
		];
	}

	getScale = () => {
		if (this.fighter.position.y < STAGE_FLOOR) {
			const scale = 1.2 - (200 - this.fighter.position.y) / 300;
			return [scale, scale, 0, 0];
		} else if (this.fighter.states[this.fighter.currentState].shadow) {
			const [scaleX, scaleY, offsetX, offsetY] =
				this.fighter.states[this.fighter.currentState].shadow;
			return [scaleX, scaleY, offsetX * this.fighter.direction * -1, offsetY];
		}
		return [1.2, 1.2, 0, 0];
	};

	update = () => {};

	draw = (context, camera) => {
		const [[x, y, width, height], [originX, originY]] = this.frame;

		const [scaleX, scaleY, offsetX, offsetY] = this.getScale() || [
			1.2, 1.2, 0, 0,
		];

		context.globalAlpha = 0.5;
		context.drawImage(
			this.image,
			x,
			y,
			width,
			height,
			Math.floor(
				this.fighter.position.x - camera.position.x - originX * scaleX - offsetX
			),
			Math.floor(STAGE_FLOOR - camera.position.y - originY * scaleY - offsetY),
			Math.floor(width * scaleX),
			Math.floor(height * scaleY)
		);
		context.globalAlpha = 1;
		context.setTransform(1, 0, 0, 1, 0, 0);
	};
}
