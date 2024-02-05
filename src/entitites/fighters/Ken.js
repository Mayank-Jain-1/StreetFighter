import { Fighter } from "./Fighter.js";

export class Ken extends Fighter {
	constructor(x, y, velocity) {
		super("Ken", x, y, velocity);
		this.image = document.getElementById("KenImage");
		this.frames = new Map([
			// Idle
			[
				"idle-1",
				[
					[346, 688, 60, 89],
					[34, 86],
				],
			],
			[
				"idle-2",
				[
					[2, 687, 59, 90],
					[33, 87],
				],
			],
			[
				"idle-3",
				[
					[72, 685, 58, 92],
					[32, 89],
				],
			],
			[
				"idle-4",
				[
					[142, 684, 55, 93],
					[31, 90],
				],
			],

			// Forward
			[
				"forwards-1",
				[
					[8, 872, 53, 83],
					[27, 82],
				],
			],
			[
				"forwards-2",
				[
					[70, 867, 60, 88],
					[35, 86],
				],
			],
			[
				"forwards-3",
				[
					[140, 866, 64, 90],
					[35, 87],
				],
			],
			[
				"forwards-4",
				[
					[215, 865, 63, 89],
					[29, 88],
				],
			],
			[
				"forwards-5",
				[
					[288, 866, 54, 89],
					[25, 87],
				],
			],
			[
				"forwards-6",
				[
					[357, 867, 50, 89],
					[25, 86],
				],
			],

			// Backward
			[
				"backwards-1",
				[
					[417, 868, 61, 87],
					[35, 85],
				],
			],
			[
				"backwards-2",
				[
					[487, 866, 59, 90],
					[36, 87],
				],
			],
			[
				"backwards-3",
				[
					[558, 865, 57, 90],
					[36, 88],
				],
			],
			[
				"backwards-4",
				[
					[629, 864, 58, 90],
					[38, 89],
				],
			],
			[
				"backwards-5",
				[
					[702, 865, 58, 91],
					[36, 88],
				],
			],
			[
				"backwards-6",
				[
					[773, 866, 57, 89],
					[36, 87],
				],
			],
		]);

		this.animations = {
			idle: [
				"idle-1",
				"idle-2",
				"idle-3",
				"idle-4",
				"idle-3",
				"idle-2",
			],
			walkForwards: [
				"forwards-1",
				"forwards-2",
				"forwards-3",
				"forwards-4",
				"forwards-5",
				"forwards-6",
			],
			walkBackwards: [
				"backwards-1",
				"backwards-2",
				"backwards-3",
				"backwards-4",
				"backwards-5",
				"backwards-6",
			],
		};
	}
}
