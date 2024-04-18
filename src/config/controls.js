import { Control } from '../constants/controls.js';

const PSControls = {
	X: 0,
	O: 1,
	SQ: 2,
	TR: 3,
	L1: 4,
	R1: 5,
	L2: 6,
	R2: 7,
	L3: 10,
	R3: 11,
	UP: 12,
	DOWN: 13,
	LEFT: 14,
	RIGHT: 15,
};

export const controls = [
	{
		gamepad: {
			[Control.LEFT]: PSControls.LEFT,
			[Control.RIGHT]: PSControls.RIGHT,
			[Control.UP]: PSControls.UP,
			[Control.DOWN]: PSControls.DOWN,
			[Control.LIGHT_PUNCH]: PSControls.X,
			[Control.MEDIUM_PUNCH]: PSControls.SQ,
			[Control.HEAVY_PUNCH]: PSControls.L1,
			[Control.LIGHT_KICK]: PSControls.O,
			[Control.MEDIUM_KICK]: PSControls.TR,
			[Control.HEAVY_KICK]: PSControls.R1,
		},
		keyboard: {
			[Control.LEFT]: 'KeyA',
			[Control.RIGHT]: 'KeyD',
			[Control.UP]: 'KeyW',
			[Control.DOWN]: 'KeyS',
			[Control.LIGHT_PUNCH]: 'KeyQ',
			[Control.MEDIUM_PUNCH]: 'KeyE',
			[Control.HEAVY_PUNCH]: 'KeyR',
			[Control.LIGHT_KICK]: 'KeyF',
			[Control.MEDIUM_KICK]: 'KeyV',
			[Control.HEAVY_KICK]: 'KeyG',
		},
	},
	{
		gamepad: {
			[Control.LEFT]: PSControls.LEFT,
			[Control.RIGHT]: PSControls.RIGHT,
			[Control.UP]: PSControls.UP,
			[Control.DOWN]: PSControls.DOWN,
			[Control.LIGHT_PUNCH]: PSControls.X,
			[Control.MEDIUM_PUNCH]: PSControls.SQ,
			[Control.HEAVY_PUNCH]: PSControls.L1,
			[Control.LIGHT_KICK]: PSControls.O,
			[Control.MEDIUM_KICK]: PSControls.TR,
			[Control.HEAVY_KICK]: PSControls.R1,
		},
		keyboard: {
			[Control.LEFT]: 'ArrowLeft',
			[Control.RIGHT]: 'ArrowRight',
			[Control.UP]: 'ArrowUp',
			[Control.DOWN]: 'ArrowDown',
			[Control.LIGHT_PUNCH]: 'Slash',
			[Control.MEDIUM_PUNCH]: 'ControlRight',
			[Control.HEAVY_PUNCH]: 'Period',
			[Control.LIGHT_KICK]: 'ShiftRight',
			[Control.MEDIUM_KICK]: 'Quote',
			[Control.HEAVY_KICK]: 'Enter',
		},
	},
];

export const CONTROLLER_DEADZONE = 0.4;
