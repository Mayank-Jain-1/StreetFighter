import { Control, controls } from "./constants/controls.js";
import { FighterDirection } from "./constants/fighter.js";

const heldKeys = new Set();

const handleKeyDown = (event) => {
	event.preventDefault();
	if (!heldKeys.has(event.code)) {
		heldKeys.add(event.code);
		console.log(heldKeys);
	}
};

const handleKeyUp = (event) => {
	event.preventDefault();
	if (heldKeys.has(event.code)) {
		heldKeys.delete(event.code);
		console.log(heldKeys);
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

export const isRight = (id) => {
	return heldKeys.has(controls[id].keyboard[Control.RIGHT]);
};

export const isForward = (id, direction) => {
	return direction === FighterDirection.RIGHT ? isRight(id) : isLeft(id);
};

export const isBackward = (id, direction) => {
  return direction === FighterDirection.LEFT ? isLeft(id) : isRight(id);
}