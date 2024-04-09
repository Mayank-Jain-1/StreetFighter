import {
	FighterState,
	FrameDelay,
	HurtBox,
	PushBox,
} from '../../constants/fighter.js';
import { Fighter } from './Fighter.js';

export class Ryu extends Fighter {
	constructor(playerId) {
		super(playerId);
		this.image = document.getElementById('RyuImage');
		this.frames = new Map([
			// IDLE
			[
				'idle-1',
				[
					[
						[75, 14, 60, 89],
						[34, 86],
					],
					PushBox.IDLE,
					HurtBox.IDLE,
				],
			],
			[
				'idle-2',
				[
					[
						[7, 14, 59, 90],
						[33, 87],
					],
					PushBox.IDLE,
					HurtBox.IDLE,
				],
			],

			[
				'idle-3',
				[
					[
						[142, 13, 59, 90],
						[33, 88],
					],
					PushBox.IDLE,
					HurtBox.IDLE,
				],
			],

			[
				'idle-4',
				[
					[
						[211, 10, 55, 93],
						[31, 90],
					],
					PushBox.IDLE,
					HurtBox.IDLE,
				],
			],

			[
				// Forward
				'forwards-1',
				[
					[
						[9, 136, 53, 83],
						[27, 81],
					],
					PushBox.IDLE,
					HurtBox.FORWARD,
				],
			],
			[
				'forwards-2',
				[
					[
						[78, 131, 60, 88],
						[35, 86],
					],
					PushBox.IDLE,
					HurtBox.FORWARD,
				],
			],
			[
				'forwards-3',
				[
					[
						[152, 128, 64, 92],
						[35, 89],
					],
					PushBox.IDLE,
					HurtBox.FORWARD,
				],
			],
			[
				'forwards-4',
				[
					[
						[229, 130, 63, 90],
						[29, 89],
					],
					PushBox.IDLE,
					HurtBox.FORWARD,
				],
			],
			[
				'forwards-5',
				[
					[
						[307, 128, 54, 91],
						[25, 89],
					],
					PushBox.IDLE,
					HurtBox.FORWARD,
				],
			],
			[
				'forwards-6',
				[
					[
						[371, 128, 50, 89],
						[25, 86],
					],
					PushBox.IDLE,
					HurtBox.FORWARD,
				],
			],

			// Backward
			[
				'backwards-1',
				[
					[
						[777, 128, 61, 87],
						[35, 85],
					],
					PushBox.IDLE,
					HurtBox.BACKWARD,
				],
			],
			[
				'backwards-2',
				[
					[
						[430, 124, 59, 90],
						[36, 87],
					],
					PushBox.IDLE,
					HurtBox.BACKWARD,
				],
			],
			[
				'backwards-3',
				[
					[
						[495, 124, 57, 90],
						[36, 88],
					],
					PushBox.IDLE,
					HurtBox.BACKWARD,
				],
			],
			[
				'backwards-4',
				[
					[
						[559, 124, 58, 90],
						[38, 89],
					],
					PushBox.IDLE,
					HurtBox.BACKWARD,
				],
			],
			[
				'backwards-5',
				[
					[
						[631, 125, 58, 91],
						[36, 88],
					],
					PushBox.IDLE,
					HurtBox.BACKWARD,
				],
			],
			[
				'backwards-6',
				[
					[
						[707, 126, 57, 89],
						[36, 87],
					],
					PushBox.IDLE,
					HurtBox.BACKWARD,
				],
			],

			[
				'jump-start/land',
				[
					[
						[7, 268, 55, 85],
						[29, 83],
					],
					PushBox.IDLE,
					HurtBox.IDLE,
				],
			],

			[
				'jump-up-1',
				[
					[
						[67, 244, 56, 104],
						[32, 107],
					],
					PushBox.JUMP,
					HurtBox.JUMP,
				],
			],
			[
				'jump-up-2',
				[
					[
						[138, 233, 50, 89],
						[24, 103],
					],
					PushBox.JUMP,
					HurtBox.JUMP,
				],
			],
			[
				'jump-up-3',
				[
					[
						[197, 233, 54, 77],
						[25, 103],
					],
					PushBox.JUMP,
					HurtBox.JUMP,
				],
			],
			[
				'jump-up-4',
				[
					[
						[259, 240, 48, 70],
						[28, 101],
					],
					PushBox.JUMP,
					HurtBox.JUMP,
				],
			],
			[
				'jump-up-5',
				[
					[
						[319, 234, 48, 89],
						[25, 106],
					],
					PushBox.JUMP,
					HurtBox.JUMP,
				],
			],
			[
				'jump-up-6',
				[
					[
						[375, 244, 55, 109],
						[31, 113],
					],
					PushBox.JUMP,
					HurtBox.JUMP,
				],
			],

			// Jump Roll

			[
				'jump-roll-1',
				[
					[
						[375, 244, 55, 109],
						[25, 106],
					],
					PushBox.JUMP,
					[
						[-11, -106, 24, 16],
						[-26, -90, 40, 42],
						[-26, -31, 40, 32],
					],
				],
			],
			[
				'jump-roll-2',
				[
					[
						[442, 261, 61, 78],
						[22, 90],
					],
					PushBox.JUMP,
					[
						[17, -90, 24, 16],
						[-14, -91, 40, 42],
						[-22, -66, 38, 18],
					],
				],
			],
			[
				'jump-roll-3',
				[
					[
						[507, 259, 104, 42],
						[61, 76],
					],
					PushBox.JUMP,
					[
						[22, -51, 24, 16],
						[-14, -81, 40, 42],
						[-22, -66, 38, 18],
					],
				],
			],
			[
				'jump-roll-4',
				[
					[
						[617, 240, 53, 82],
						[42, 111],
					],
					PushBox.JUMP,
					[
						[-39, -46, 24, 16],
						[-30, -88, 40, 42],
						[-34, -118, 44, 48],
					],
				],
			],
			[
				'jump-roll-5',
				[
					[
						[676, 257, 122, 44],
						[71, 81],
					],
					PushBox.JUMP,
					[
						[-72, -56, 24, 16],
						[-54, -77, 52, 40],
						[-14, -82, 48, 34],
					],
				],
			],
			[
				'jump-roll-6',
				[
					[
						[804, 258, 71, 87],
						[53, 98],
					],
					PushBox.JUMP,
					[
						[-55, -100, 24, 16],
						[-48, -87, 44, 38],
						[-22, -66, 38, 18],
					],
				],
			],
			[
				'jump-roll-7',
				[
					[
						[883, 261, 54, 109],
						[31, 113],
					],
					PushBox.JUMP,
					[
						[-11, -106, 24, 16],
						[-26, -90, 40, 42],
						[-26, -31, 40, 32],
					],
				],
			],

			// Crouch
			[
				'crouch-1',
				[
					[
						[551, 21, 53, 83],
						[27, 81],
					],
					PushBox.IDLE,
					HurtBox.IDLE,
				],
			],
			[
				'crouch-2',
				[
					[
						[611, 36, 57, 69],
						[25, 66],
					],
					PushBox.BEND,
					HurtBox.BEND,
				],
			],
			[
				'crouch-3',
				[
					[
						[679, 44, 61, 61],
						[25, 58],
					],
					PushBox.CROUCH,
					HurtBox.CROUCH,
				],
			],

			// Stand Turn
			[
				'idle-turn-1',
				[
					[
						[348, 8, 54, 95],
						[29, 92],
					],
					PushBox.IDLE,
					[
						[-10, -89, 28, 18],
						[-14, -74, 40, 42],
						[-14, -31, 40, 32],
					],
				],
			],
			[
				'idle-turn-2',
				[
					[
						[414, 6, 58, 97],
						[30, 94],
					],
					PushBox.IDLE,
					[
						[-16, -96, 28, 18],
						[-14, -74, 40, 42],
						[-14, -31, 40, 32],
					],
				],
			],
			[
				'idle-turn-3',
				[
					[
						[486, 10, 54, 94],
						[27, 90],
					],
					PushBox.IDLE,
					[
						[-16, -96, 28, 18],
						[-14, -74, 40, 42],
						[-14, -31, 40, 32],
					],
				],
			],
			// Crouch Turn

			[
				'crouch-turn-1',
				[
					[
						[751, 46, 53, 61],
						[26, 58],
					],
					PushBox.CROUCH,
					[
						[-7, -60, 24, 18],
						[-28, -46, 44, 24],
						[-28, -24, 44, 24],
					],
				],
			],
			[
				'crouch-turn-2',
				[
					[
						[816, 46, 52, 61],
						[27, 58],
					],
					PushBox.CROUCH,
					[
						[-7, -60, 24, 18],
						[-28, -46, 44, 24],
						[-28, -24, 44, 24],
					],
				],
			],
			[
				'crouch-turn-3',
				[
					[
						[878, 46, 53, 61],
						[29, 58],
					],
					PushBox.CROUCH,
					[
						[-26, -61, 24, 18],
						[-28, -46, 44, 24],
						[-28, -24, 44, 24],
					],
				],
			],

			// Light Punch
			[
				'light-punch-1',
				[
					[
						[9, 365, 64, 91],
						[32, 88],
					],
					PushBox.IDLE,
					HurtBox.IDLE,
				],
			],
			[
				'light-punch-2',
				[
					[
						[98, 365, 92, 91],
						[32, 88],
					],
					PushBox.IDLE,
					HurtBox.IDLE,
					[11, -85, 50, 18],
				],
			],

			// Medium/Heavy Punch
			[
				'med-punch-1',
				[
					[
						[6, 466, 60, 94],
						[29, 92],
					],
					PushBox.IDLE,
					HurtBox.IDLE,
				],
			],
			[
				'med-punch-2',
				[
					[
						[86, 465, 74, 95],
						[29, 92],
					],
					PushBox.IDLE,
					HurtBox.PUNCH,
				],
			],
			[
				'med-punch-3',
				[
					[
						[175, 465, 108, 94],
						[24, 92],
					],
					PushBox.IDLE,
					HurtBox.PUNCH,
					[17, -85, 68, 14],
				],
			],
			// Heavy Punch
			[
				'heavy-punch-1',
				[
					[
						[175, 465, 108, 94],
						[24, 92],
					],
					PushBox.IDLE,
					HurtBox.PUNCH,
					[17, -85, 76, 14],
				],
			],

			// Light/Medium Kick
			[
				'light-kick-1',
				[
					[
						[87, 923, 66, 92],
						[46, 93],
					],
					PushBox.IDLE,
					[
						[-33, -96, 30, 18],
						[-41, -79, 42, 38],
						[-32, -52, 44, 50],
					],
				],
			],
			[
				'light-kick-2',
				[
					[
						[162, 922, 114, 94],
						[68, 95],
					],
					PushBox.IDLE,
					[
						[-65, -96, 30, 18],
						[-57, -79, 42, 38],
						[-32, -52, 44, 50],
					],
					[-17, -98, 66, 28],
				],
			],
			// Medium Kick
			[
				'med-kick-1',
				[
					[
						[162, 922, 114, 94],
						[68, 95],
					],
					PushBox.IDLE,
					[
						[-65, -96, 30, 18],
						[-57, -79, 42, 38],
						[-32, -52, 44, 50],
					],
					[-18, -98, 80, 28],
				],
			],
			// Heavy Kick
			[
				'heavy-kick-1',
				[
					[
						[5, 1196, 61, 90],
						[37, 87],
					],
					PushBox.IDLE,
					[
						[-41, -78, 20, 20],
						[-25, -78, 42, 42],
						[-11, -50, 42, 50],
					],
				],
			],
			[
				'heavy-kick-2',
				[
					[
						[72, 1192, 94, 94],
						[44, 91],
					],
					PushBox.IDLE,
					[
						[12, -90, 34, 34],
						[-25, -78, 42, 42],
						[-11, -50, 42, 50],
					],
					[15, -99, 40, 32],
				],
			],
			[
				'heavy-kick-3',
				[
					[
						[176, 1191, 120, 94],
						[42, 91],
					],
					PushBox.IDLE,
					[
						[13, -91, 62, 34],
						[-25, -78, 42, 42],
						[-11, -50, 42, 50],
					],
					[21, -97, 62, 24],
				],
			],
			[
				'heavy-kick-4',
				[
					[
						[306, 1208, 101, 77],
						[39, 74],
					],
					PushBox.IDLE,
					[
						[-41, -78, 20, 20],
						[-25, -78, 42, 42],
						[-11, -50, 42, 50],
					],
				],
			],
			[
				'heavy-kick-5',
				[
					[
						[418, 1204, 64, 81],
						[38, 78],
					],
					PushBox.IDLE,
					[
						[-41, -78, 20, 20],
						[-25, -78, 42, 42],
						[-11, -50, 42, 50],
					],
				],
			],
		]);

		this.animations = {
			[FighterState.JUMP_START]: [
				['jump-start/land', 3],
				['jump-start/land', FrameDelay.TRANSITION],
			],

			[FighterState.JUMP_LAND]: [
				['jump-start/land', 2],
				['jump-start/land', 5],
				['jump-start/land', FrameDelay.TRANSITION],
			],
			[FighterState.JUMP_FORWARD]: [
				['jump-roll-1', 13],
				['jump-roll-2', 5],
				['jump-roll-3', 3],
				['jump-roll-4', 3],
				['jump-roll-5', 3],
				['jump-roll-6', 5],
				['jump-roll-7', FrameDelay.FREEZE],
			],
			[FighterState.JUMP_BACKWARD]: [
				['jump-roll-7', 15],
				['jump-roll-6', 3],
				['jump-roll-5', 3],
				['jump-roll-4', 3],
				['jump-roll-3', 3],
				['jump-roll-2', 3],
				['jump-roll-1', FrameDelay.FREEZE],
			],
			[FighterState.IDLE]: [
				['idle-1', 4],
				['idle-2', 4],
				['idle-3', 4],
				['idle-4', 4],
				['idle-3', 4],
				['idle-2', 4],
			],

			[FighterState.WALK_FORWARD]: [
				['forwards-1', 3],
				['forwards-2', 6],
				['forwards-3', 4],
				['forwards-4', 4],
				['forwards-5', 4],
				['forwards-6', 6],
			],

			[FighterState.WALK_BACKWARD]: [
				['backwards-1', 3],
				['backwards-2', 6],
				['backwards-3', 4],
				['backwards-4', 4],
				['backwards-5', 4],
				['backwards-6', 6],
			],
			[FighterState.JUMP_UP]: [
				['jump-up-1', 8],
				['jump-up-2', 8],
				['jump-up-3', 8],
				['jump-up-4', 8],
				['jump-up-5', 8],
				['jump-up-6', FrameDelay.FREEZE],
			],
			[FighterState.CROUCH_DOWN]: [
				['crouch-1', 2],
				['crouch-2', 2],
				['crouch-3', 2],
				['crouch-3', FrameDelay.TRANSITION],
			],
			[FighterState.CROUCH]: [['crouch-3', FrameDelay.TRANSITION]],
			[FighterState.CROUCH_UP]: [
				['crouch-3', 2],
				['crouch-2', 2],
				['crouch-1', 2],
				['crouch-1', FrameDelay.TRANSITION],
			],
			[FighterState.IDLE_TURN]: [
				['idle-turn-3', 2],
				['idle-turn-2', 2],
				['idle-turn-1', 2],
				['idle-turn-1', FrameDelay.TRANSITION],
			],
			[FighterState.CROUCH_TURN]: [
				['crouch-turn-3', 2],
				['crouch-turn-2', 2],
				['crouch-turn-1', 2],
				['crouch-turn-1', FrameDelay.TRANSITION],
			],
			[FighterState.LIGHT_PUNCH]: [
				['light-punch-1', 2],
				['light-punch-2', 4],
				['light-punch-1', 4],
				['light-punch-1', FrameDelay.TRANSITION],
			],

			[FighterState.MEDIUM_PUNCH]: [
				['med-punch-1', 1],
				['med-punch-2', 2],
				['med-punch-3', 4],
				['med-punch-2', 3],
				['med-punch-1', 3],
				['med-punch-1', FrameDelay.TRANSITION],
			],
			[FighterState.HEAVY_PUNCH]: [
				['med-punch-1', 3],
				['med-punch-2', 2],
				['heavy-punch-1', 6],
				['med-punch-2', 10],
				['med-punch-1', 12],
				['med-punch-1', FrameDelay.TRANSITION],
			],

			[FighterState.LIGHT_KICK]: [
				['med-punch-1', 3],
				['light-kick-1', 3],
				['light-kick-2', 8],
				['light-kick-1', 4],
				['med-punch-1', 1],
				['med-punch-1', FrameDelay.TRANSITION],
			],
			[FighterState.MEDIUM_KICK]: [
				['med-punch-1', 5],
				['light-kick-1', 6],
				['med-kick-1', 12],
				['light-kick-1', 7],
				['light-kick-1', FrameDelay.TRANSITION],
			],
			[FighterState.HEAVY_KICK]: [
				['heavy-kick-1', 2],
				['heavy-kick-2', 4],
				['heavy-kick-3', 8],
				['heavy-kick-4', 10],
				['heavy-kick-5', 7],
				['heavy-kick-5', FrameDelay.TRANSITION],
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
