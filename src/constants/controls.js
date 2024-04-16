export const Control = {
	LEFT: 'left',
	RIGHT: 'right',
	UP: 'up',
	DOWN: 'down',
	LIGHT_PUNCH: 'lightPunch',
	MEDIUM_PUNCH: 'mediumPunch',
	HEAVY_PUNCH: 'heavyPunch',
	LIGHT_KICK: 'lightKick',
	MEDIUM_KICK: 'mediumKick',
	HEAVY_KICK: 'heavyKick',
};

export const SpecialMovesControls = {
	FORWARD: 'forward',
	BACKWARD: 'backward',
	UP: 'up',
	DOWN: 'down',
	FORWARD_DOWN: 'forwardDown',
	FORWARD_UP: 'forwardUp',
	BACKWARD_UP: 'backwardUp',
	BACKWARD_DOWN: 'backwardDown',
	LIGHT_PUNCH: 'lightPunch',
	MEDIUM_PUNCH: 'mediumPunch',
	HEAVY_PUNCH: 'heavyPunch',
	LIGHT_KICK: 'lightKick',
	MEDIUM_KICK: 'mediumKick',
	HEAVY_KICK: 'heavyKick',
};

const POLLING_RATE = 30; // milliseconds . for per seconds = 1000/POLLING_RATE

export const POLLING_DELAY = 1000 / POLLING_RATE;

export const MINIMUM_REPOLL_TIME = 200; // milliseconds before the same move/button is added into the history back to back
