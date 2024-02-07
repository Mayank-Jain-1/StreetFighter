import { FighterState } from "../../constants/fighter.js";
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

			// Jump Up

			[
				"jump-up-1",
				[
					[724, 1036, 56, 104],
					[32, 107],
				],
			],
			[
				"jump-up-2",
				[
					[792, 995, 50, 89],
					[25, 103],
				],
			],
			[
				"jump-up-3",
				[
					[853, 967, 54, 77],
					[25, 103],
				],
			],
			[
				"jump-up-4",
				[
					[911, 966, 48, 70],
					[28, 101],
				],
			],
			[
				"jump-up-5",
				[
					[975, 977, 48, 86],
					[25, 103],
				],
			],
			[
				"jump-up-6",
				[
					[1031, 1008, 55, 103],
					[32, 107],
				],
			],
		]);

		this.animations = {
			[FighterState.IDLE]: [
				["idle-1", 68],
				["idle-2", 68],
				["idle-3", 68],
				["idle-4", 68],
				["idle-3", 68],
				["idle-2", 68],
			],

			[FighterState.WALK_FORWARD]: [
				["forwards-1", 65],
				["forwards-2", 65],
				["forwards-3", 65],
				["forwards-4", 65],
				["forwards-5", 65],
				["forwards-6", 65],
			],

			[FighterState.WALK_BACKWARD]: [
				["backwards-1", 65],
				["backwards-2", 65],
				["backwards-3", 65],
				["backwards-4", 65],
				["backwards-5", 65],
				["backwards-6", 65],
			],
			[FighterState.JUMP_UP]: [
				["jump-up-1", 180],
				["jump-up-2", 100],
				["jump-up-3", 100],
				["jump-up-4", 100],
				["jump-up-5", 100],
				["jump-up-6", -1],
			],
		};

		this.initialVelocity = {
			jump: -420,
		};

		this.gravity = 1000;
	}
}
