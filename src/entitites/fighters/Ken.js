import { FighterState, FrameDelay, PushBox } from "../../constants/fighter.js";
import { Fighter } from "./Fighter.js";

export class Ken extends Fighter {
	constructor(playerId) {
		super("Ken", playerId);
		this.image = document.getElementById("KenImage");
		this.frames = new Map([
			// Idle

			[
				"idle-1",
				[
					[
						[346, 688, 60, 89],
						[34, 86],
					],
					PushBox.IDLE,
				],
			],
			[
				"idle-2",
				[
					[
						[2, 687, 59, 90],
						[33, 87],
					],
					PushBox.IDLE,
				],
			],
			[
				"idle-3",
				[
					[
						[72, 685, 58, 92],
						[32, 89],
					],
					PushBox.IDLE,
				],
			],
			[
				"idle-4",
				[
					[
						[142, 684, 55, 93],
						[31, 90],
					],
					PushBox.IDLE,
				],
			],

			// Forward
			[
				"forwards-1",
				[
					[
						[8, 872, 53, 83],
						[27, 82],
					],
					PushBox.IDLE,
				],
			],
			[
				"forwards-2",
				[
					[
						[70, 867, 60, 88],
						[35, 86],
					],
					PushBox.IDLE,
				],
			],
			[
				"forwards-3",
				[
					[
						[140, 866, 64, 90],
						[35, 87],
					],
					PushBox.IDLE,
				],
			],
			[
				"forwards-4",
				[
					[
						[215, 865, 63, 89],
						[29, 88],
					],
					PushBox.IDLE,
				],
			],
			[
				"forwards-5",
				[
					[
						[288, 866, 54, 89],
						[25, 87],
					],
					PushBox.IDLE,
				],
			],
			[
				"forwards-6",
				[
					[
						[357, 867, 50, 89],
						[25, 86],
					],
					PushBox.IDLE,
				],
			],

			// Backward
			[
				"backwards-1",
				[
					[
						[417, 868, 61, 87],
						[35, 85],
					],
					PushBox.IDLE,
				],
			],
			[
				"backwards-2",
				[
					[
						[487, 866, 59, 90],
						[36, 87],
					],
					PushBox.IDLE,
				],
			],
			[
				"backwards-3",
				[
					[
						[558, 865, 57, 90],
						[36, 88],
					],
					PushBox.IDLE,
				],
			],
			[
				"backwards-4",
				[
					[
						[629, 864, 58, 90],
						[38, 89],
					],
					PushBox.IDLE,
				],
			],
			[
				"backwards-5",
				[
					[
						[702, 865, 58, 91],
						[36, 88],
					],
					PushBox.IDLE,
				],
			],
			[
				"backwards-6",
				[
					[
						[773, 866, 57, 89],
						[36, 87],
					],
					PushBox.IDLE,
				],
			],

			[
				"jump-start/land",
				[
					[
						[660, 1060, 55, 85],
						[29, 83],
					],
					PushBox.IDLE,
				],
			],
			[
				"jump-up-1",
				[
					[
						[724, 1036, 56, 104],
						[32, 107],
					],
					PushBox.JUMP,
				],
			],
			[
				"jump-up-2",
				[
					[
						[792, 995, 50, 89],
						[25, 103],
					],
					PushBox.JUMP,
				],
			],
			[
				"jump-up-3",
				[
					[
						[853, 967, 54, 77],
						[25, 103],
					],
					PushBox.JUMP,
				],
			],
			[
				"jump-up-4",
				[
					[
						[911, 966, 48, 70],
						[28, 101],
					],
					PushBox.JUMP,
				],
			],
			[
				"jump-up-5",
				[
					[
						[975, 977, 48, 86],
						[25, 103],
					],
					PushBox.JUMP,
				],
			],
			[
				"jump-up-6",
				[
					[
						[1031, 1008, 55, 103],
						[32, 107],
					],
					PushBox.JUMP,
				],
			],

			// Landing frame
			[
				"jump-up-7",
				[
					[
						[660, 1060, 55, 85],
						[32, 107],
					],
					PushBox.JUMP,
				],
			],

			// Jump Forward
			[
				"jump-roll-1",
				[
					[
						[1237, 1037, 55, 103],
						[25, 106],
					],
					PushBox.JUMP,
				],
			],
			[
				"jump-roll-2",
				[
					[
						[1301, 990, 61, 78],
						[22, 90],
					],
					PushBox.JUMP,
				],
			],
			[
				"jump-roll-3",
				[
					[
						[1363, 994, 104, 42],
						[61, 76],
					],
					PushBox.JUMP,
				],
			],
			[
				"jump-roll-4",
				[
					[
						[1468, 957, 53, 82],
						[42, 111],
					],
					PushBox.JUMP,
				],
			],
			[
				"jump-roll-5",
				[
					[
						[1541, 988, 122, 44],
						[71, 81],
					],
					PushBox.JUMP,
				],
			],
			[
				"jump-roll-6",
				[
					[
						[1664, 976, 71, 87],
						[53, 98],
					],
					PushBox.JUMP,
				],
			],
			[
				"jump-roll-7",
				[
					[
						[1748, 977, 55, 103],
						[32, 107],
					],
					PushBox.JUMP,
				],
			],

			// Crouch

			[
				"crouch-1",
				[
					[
						[8, 779, 53, 83],
						[27, 81],
					],
					PushBox.IDLE,
				],
			],
			[
				"crouch-2",
				[
					[
						[79, 794, 57, 69],
						[25, 66],
					],
					PushBox.BEND,
				],
			],
			[
				"crouch-3",
				[
					[
						[148, 802, 61, 61],
						[25, 58],
					],
					PushBox.CROUCH,
				],
			],

			// Stand Turn
			[
				"idle-turn-1",
				[
					[
						[420, 682, 54, 95],
						[29, 92],
					],
					PushBox.IDLE,
				],
			],
			[
				"idle-turn-2",
				[
					[
						[488, 678, 58, 98],
						[30, 95],
					],
					PushBox.IDLE,
				],
			],
			[
				"idle-turn-3",
				[
					[
						[560, 683, 54, 94],
						[27, 90],
					],
					PushBox.IDLE,
				],
			],
			// Crouch Turn
			[
				"crouch-turn-1",
				[
					[
						[356, 802, 53, 61],
						[26, 58],
					],
					PushBox.CROUCH,
				],
			],
			[
				"crouch-turn-2",
				[
					[
						[424, 802, 52, 61],
						[27, 58],
					],
					PushBox.CROUCH,
				],
			],
			[
				"crouch-turn-3",
				[
					[
						[486, 802, 53, 61],
						[29, 58],
					],
					PushBox.CROUCH,
				],
			],
		]);

		this.animations = {
			[FighterState.JUMP_START]: [
				["jump-start/land", 50],
				["jump-start/land", FrameDelay.TRANSITION],
			],

			[FighterState.JUMP_LAND]: [
				["jump-start/land", 33],
				["jump-start/land", 117],
				["jump-start/land", FrameDelay.TRANSITION],
			],
			[FighterState.JUMP_FORWARD]: [
				["jump-roll-1", 200],
				["jump-roll-2", 50],
				["jump-roll-3", 50],
				["jump-roll-4", 50],
				["jump-roll-5", 50],
				["jump-roll-6", 50],
				["jump-roll-7", FrameDelay.FREEZE],
			],
			[FighterState.JUMP_BACKWARD]: [
				["jump-roll-7", 200],
				["jump-roll-6", 50],
				["jump-roll-5", 50],
				["jump-roll-4", 50],
				["jump-roll-3", 50],
				["jump-roll-2", 50],
				["jump-roll-1", FrameDelay.FREEZE],
			],
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
				["jump-up-6", FrameDelay.FREEZE],
			],
			[FighterState.CROUCH_DOWN]: [
				["crouch-1", 30],
				["crouch-2", 30],
				["crouch-3", 30],
				["crouch-3", FrameDelay.TRANSITION],
			],
			[FighterState.CROUCH]: [["crouch-3", FrameDelay.TRANSITION]],
			[FighterState.CROUCH_UP]: [
				["crouch-3", 30],
				["crouch-2", 30],
				["crouch-1", 30],
				["crouch-1", FrameDelay.TRANSITION],
			],
			[FighterState.IDLE_TURN]: [
				["idle-turn-3", 33],
				["idle-turn-2", 33],
				["idle-turn-1", 33],
				["idle-turn-1", FrameDelay.TRANSITION],
			],
			[FighterState.CROUCH_TURN]: [
				["crouch-turn-3", 33],
				["crouch-turn-2", 33],
				["crouch-turn-1", 33],
				["crouch-turn-1", FrameDelay.TRANSITION],
			],
		};

		this.initialVelocity = {
			x: {
				[FighterState.WALK_FORWARD]: 3 * 60,
				[FighterState.WALK_BACKWARD]: -(2 * 60),
				[FighterState.JUMP_FORWARD]: 168,
				[FighterState.JUMP_BACKWARD]: -180,
				[FighterState.JUMP_UP]: 0,
			},
			jump: -420,
		};

		this.gravity = 1000;
	}
}
