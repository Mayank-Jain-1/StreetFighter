import { controls } from '../config/controls.js';
import { Control } from '../constants/controls.js';
import { FighterDirection } from '../constants/fighter.js';

const heldKeys = new Set();
const pressedKeys = new Set();
const pressedKeysControlHistory = new Set();
const mappedKeys = controls
	.map(({ keyboard }) => Object.values(keyboard))
	.flat();

const isPressed = (code) => {
	if (heldKeys.has(code) && !pressedKeys.has(code)) {
		pressedKeys.add(code);
		return true;
	}
	return false;
};

const isPressedControlHistory = (code) => {
	if (heldKeys.has(code) && !pressedKeysControlHistory.has(code)) {
		pressedKeysControlHistory.add(code);
		return true;
	}
	return false;
};

const handleKeyDown = (event) => {
	if (!mappedKeys.includes(event.code)) return;
	event.preventDefault();
	if (!heldKeys.has(event.code)) {
		heldKeys.add(event.code);
	}
};

const handleKeyUp = (event) => {
	event.preventDefault();
	if (heldKeys.has(event.code)) {
		heldKeys.delete(event.code);
		pressedKeys.delete(event.code);
		pressedKeysControlHistory.delete(event.code);
	}
};

export const registerKeyboardEvents = () => {
	window.addEventListener('keydown', handleKeyDown);
	window.addEventListener('keyup', handleKeyUp);
};

export const isLeft = (id) => {
	return heldKeys.has(controls[id].keyboard[Control.LEFT]);
};

export const isUp = (id) => {
	return heldKeys.has(controls[id].keyboard[Control.UP]);
};

export const isRight = (id) => {
	return heldKeys.has(controls[id].keyboard[Control.RIGHT]);
};

export const isDown = (id) => {
	return heldKeys.has(controls[id].keyboard[Control.DOWN]);
};

export const isForward = (id, direction) => {
	return direction === FighterDirection.RIGHT ? isRight(id) : isLeft(id);
};

export const isBackward = (id, direction) => {
	return direction === FighterDirection.RIGHT ? isLeft(id) : isRight(id);
};

export const isIdle = (id) =>
	isUp(id) || isDown(id) || isLeft(id) || isRight(id);

export const isKeyPressed = (id, code, forControlHistory) => {
	if (forControlHistory)
		return isPressedControlHistory(controls[id].keyboard[code]);
	return isPressed(controls[id].keyboard[code]);
};

export const isLightPunch = (id, forControlHistory = false) => {
	return isKeyPressed(id, Control.LIGHT_PUNCH, forControlHistory);
};
export const isMediumPunch = (id, forControlHistory = false) => {
	return isKeyPressed(id, Control.MEDIUM_PUNCH, forControlHistory);
};
export const isHeavyPunch = (id, forControlHistory = false) => {
	return isKeyPressed(id, Control.HEAVY_PUNCH, forControlHistory);
};

export const isLightKick = (id, forControlHistory = false) => {
	return isKeyPressed(id, Control.LIGHT_KICK, forControlHistory);
};
export const isMediumKick = (id, forControlHistory = false) => {
	return isKeyPressed(id, Control.MEDIUM_KICK, forControlHistory);
};
export const isHeavyKick = (id, forControlHistory = false) => {
	return isKeyPressed(id, Control.HEAVY_KICK, forControlHistory);
};
