import {
	SCENE_HEIGHT,
	SCENE_WIDTH,
	SCROLL_BOUNDARY,
	STAGE_HEIGHT,
	STAGE_PADDING,
	STAGE_WIDTH,
} from '../constants/Stage.js';

export class Camera {
	constructor(x, y, fighters) {
		this.position = { x: x, y: y };
		this.fighters = fighters;
		this.speed = 100;
	}

	updateY = () => {
		this.position.y =
			-4 +
			Math.floor(
				Math.min(this.fighters[1].position.y, this.fighters[0].position.y) / 10
			);

		if (this.position.y < 0) this.position.y = 0;
		if (this.position.y > STAGE_HEIGHT - SCENE_HEIGHT)
			this.position.y = STAGE_HEIGHT - SCENE_HEIGHT;
	};

	updateX = (time) => {
		const lowX = Math.min(
			...this.fighters.map((fighter) => fighter.position.x)
		);
		const highX = Math.max(
			...this.fighters.map((fighter) => fighter.position.x)
		);

		if (highX - lowX > SCENE_WIDTH - SCROLL_BOUNDARY * 2) {
			const midPoint = (highX - lowX) / 2;
			this.position.x = lowX + midPoint - SCENE_WIDTH / 2;
		} else {
			for (const fighter of this.fighters) {
				if (fighter.position.x < this.position.x + SCROLL_BOUNDARY) {
					this.position.x = fighter.position.x - SCROLL_BOUNDARY;
				} else if (
					fighter.position.x >
					this.position.x + SCENE_WIDTH - SCROLL_BOUNDARY
				) {
					this.position.x = fighter.position.x + SCROLL_BOUNDARY - SCENE_WIDTH;
				}
			}
		}

		if (this.position.x <= STAGE_PADDING) this.position.x = STAGE_PADDING;

		if (this.position.x > STAGE_WIDTH + STAGE_PADDING - SCENE_WIDTH)
			this.position.x = STAGE_WIDTH + STAGE_PADDING - SCENE_WIDTH;
	};

	update = (time, context) => {
		this.updateY(time);
		this.updateX(time);
	};
}
