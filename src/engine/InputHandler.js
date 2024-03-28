import { Control, controls } from "../constants/controls.js";
import { FighterDirection } from "../constants/fighter.js";

const heldKeys = new Set();
const mappedKeys = controls
	.map(({ keyboard }) => Object.values(keyboard))
	.flat();

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
		// console.log(`Lifted ${input.code}`)
	}
};

export const registerKeyboardEvents = () => {
	window.addEventListener("keydown", handleKeyDown);
	window.addEventListener("keyup", handleKeyUp);
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
