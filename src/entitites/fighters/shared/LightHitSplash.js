import { HitSplash } from './HitSplash.js';

export class LightHitSplash extends HitSplash {
	constructor(x, y, playerId, removeSplash) {
		super(x, y, playerId, removeSplash);

		this.frames = [
			//Plauer id =  1
			[
				[
					[14, 16, 9, 10],
					[6, 7],
				],
				[
					[34, 15, 13, 11],
					[7, 7],
				],
				[
					[55, 15, 13, 11],
					[7, 7],
				],
				[
					[75, 10, 20, 19],
					[11, 11],
				],
			],
			// Player id = 2
			[
				[
					[160, 16, 9, 10],
					[6, 7],
				],
				[
					[178, 15, 13, 11],
					[7, 7],
				],
				[
					[199, 15, 13, 11],
					[7, 7],
				],
				[
					[219, 10, 20, 19],
					[11, 11],
				],
			],
		];
	}

	update() {
		super.update();
	}

	draw() {
		super.draw();
	}
}
