import { FRAME_TIME } from './game.js';

export const FIGHTER_START_DISTANCE = 88;

export const FIGHTER_DEFAULT_WIDTH = 40;

export const FighterDirection = {
	LEFT: -1,
	RIGHT: 1,
};

// export const AllFighterStates = [
// 	IDLE,
// 	WALK_FORWARD,
// 	WALK_BACKWARD,
// 	JUMP_START,
// 	JUMP_UP,
// 	JUMP_FORWARD,
// 	JUMP_BACKWARD,
// 	JUMP_LAND,
// 	CROUCH,
// 	CROUCH_UP,
// 	CROUCH_DOWN,
// 	IDLE_TURN,
// 	CROUCH_TURN,
// 	LIGHT_PUNCH,
// 	MEDIUM_PUNCH,
// 	HEAVY_PUNCH,
// 	LIGHT_KICK,
// 	MEDIUM_KICK,
// 	HEAVY_KICK,
// 	HURT_HEAD_LIGHT,
// 	HURT_HEAD_MEDIUM,
// 	HURT_HEAD_HEAVY,
// 	HURT_BODY_LIGHT,
// 	HURT_BODY_MEDIUM,
// 	HURT_BODY_HEAVY,
// 	SPECIAL_1_LIGHT,
// 	SPECIAL_1_MEDIUM,
// 	SPECIAL_1_HEAVY,
// 	VICTORY,
// ];

export const FighterState = {
	IDLE: 'idle',
	WALK_FORWARD: 'walkForwards',
	WALK_BACKWARD: 'walkBackwards',
	JUMP_START: 'jumpStart',
	JUMP_UP: 'jumpUp',
	JUMP_FORWARD: 'jumpForwards',
	JUMP_BACKWARD: 'jumpBackwards',
	JUMP_LAND: 'jumpLand',
	CROUCH: 'crouch',
	CROUCH_UP: 'crouchUp',
	CROUCH_DOWN: 'crouchDown',
	IDLE_TURN: 'idleTurn',
	CROUCH_TURN: 'crouchTurn',
	LIGHT_PUNCH: 'lightPunch',
	MEDIUM_PUNCH: 'mediumPunch',
	HEAVY_PUNCH: 'heavyPunch',
	LIGHT_KICK: 'lightKick',
	MEDIUM_KICK: 'mediumKick',
	HEAVY_KICK: 'heavyKick',
	HURT_HEAD_LIGHT: 'hurtHeadLight',
	HURT_HEAD_MEDIUM: 'hurtHeadMedium',
	HURT_HEAD_HEAVY: 'hurtHeadHeavy',
	HURT_BODY_LIGHT: 'hurtBodyLight',
	HURT_BODY_MEDIUM: 'hurtBodyMedium',
	HURT_BODY_HEAVY: 'hurtBodyHeavy',
	SPECIAL_1_LIGHT: 'special1Light',
	SPECIAL_1_MEDIUM: 'special1Medium',
	SPECIAL_1_HEAVY: 'special1Heavy',
	VICTORY: 'victory',
	KO: 'ko',
};

export const FighterStruckDelay = 15;

export const FrameDelay = {
	FREEZE: 0,
	TRANSITION: -1,
};

export const FighterId = {
	KEN: 'Ken',
	RYU: 'Ryu',
};

export const PushBox = {
	IDLE: [-16, -80, 32, 78],
	JUMP: [-16, -91, 32, 66],
	BEND: [-16, -58, 32, 58],
	CROUCH: [-16, -50, 32, 50],
};

export const FighterHurtArea = {
	HEAD: 'head',
	BODY: 'body',
	LEGS: 'legs',
};

export const HurtBox = {
	INVINCLIBLE: [
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
	],

	IDLE: [
		[-8, -88, 24, 16],
		[-26, -74, 40, 42],
		[-26, -31, 40, 32],
	],
	BACKWARD: [
		[-19, -88, 24, 16],
		[-26, -74, 40, 42],
		[-26, -31, 40, 32],
	],
	FORWARD: [
		[-3, -88, 24, 16],
		[-26, -74, 40, 42],
		[-26, -31, 40, 32],
	],
	JUMP: [
		[-13, -106, 28, 18],
		[-26, -90, 40, 42],
		[-22, -66, 38, 18],
	],
	BEND: [
		[-2, -68, 24, 18],
		[-16, -53, 44, 24],
		[-16, -24, 44, 24],
	],
	CROUCH: [
		[6, -61, 24, 18],
		[-16, -46, 44, 24],
		[-16, -24, 44, 24],
	],
	PUNCH: [
		[11, -94, 24, 18],
		[-7, -77, 40, 43],
		[-7, -33, 40, 33],
	],
};

export const FIGHTER_PUSH_FRICTION = 66;

export const FighterAttackType = {
	PUNCH: 'punch',
	KICK: 'kick',
};

export const FighterAttackStrength = {
	LIGHT: 'light',
	MEDIUM: 'medium',
	HEAVY: 'heavy',
};

export const FighterAttackBaseData = {
	[FighterAttackStrength.LIGHT]: {
		score: 100,
		damage: 12,
		slide: {
			velocity: 12 * FRAME_TIME,
			friction: 600,
		},
	},
	[FighterAttackStrength.MEDIUM]: {
		score: 300,
		damage: 20,
		slide: {
			velocity: 16 * FRAME_TIME,
			friction: 600,
		},
	},
	[FighterAttackStrength.HEAVY]: {
		score: 100,
		damage: 28,
		slide: {
			velocity: 22 * FRAME_TIME,
			friction: 800,
		},
	},
};

export const FighterHurtStates = [
	FighterState.IDLE,
	FighterState.IDLE_TURN,
	FighterState.WALK_FORWARD,
	FighterState.WALK_BACKWARD,
	FighterState.JUMP_START,
	FighterState.JUMP_LAND,
	FighterState.LIGHT_PUNCH,
	FighterState.MEDIUM_PUNCH,
	FighterState.HEAVY_PUNCH,
	FighterState.LIGHT_KICK,
	FighterState.MEDIUM_KICK,
	FighterState.HEAVY_KICK,
	FighterState.HURT_HEAD_LIGHT,
	FighterState.HURT_HEAD_MEDIUM,
	FighterState.HURT_HEAD_HEAVY,
	FighterState.HURT_BODY_LIGHT,
	FighterState.HURT_BODY_MEDIUM,
	FighterState.HURT_BODY_HEAVY,
	FighterState.SPECIAL_1_LIGHT,
	FighterState.SPECIAL_1_MEDIUM,
	FighterState.SPECIAL_1_HEAVY,
	FighterState.CROUCH,
	FighterState.CROUCH_UP,
	FighterState.CROUCH_DOWN,
];
