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

	update = () => {};

	draw = (context, camera) => {
		const [[x, y, width, height], [originX, originY]] = this.frame;

		context.globalAlpha = 0.6;
		const scale = 1.2 - (200 - this.fighter.position.y) / 300;

		context.scale(scale, scale);
		context.drawImage(
			this.image,
			x,
			y,
			width,
			height,
			Math.floor(
				(this.fighter.position.x - camera.position.x - originX) / scale
			),
			Math.floor((STAGE_FLOOR - originY - camera.position.y) / scale),
			width,
			height
		);
		context.globalAlpha = 1;
		context.setTransform(1, 0, 0, 1, 0, 0);
	};
}
