import { controls } from '../config/controls.js';
import { Control } from '../constants/controls.js';
import { FighterDirection } from '../constants/fighter.js';

const gamePads = [];

const mappedButtons = new Set(
	controls.map(({ gamepad }) => Object.values(gamepad)).flat()
);
// console.log(mappedButtons);
const heldGamepadButtons = [new Set(), new Set()];
const pressedGamepadButtons = [new Set(), new Set()];

const heldKeys = new Set();
const pressedKeys = new Set();
const pressedKeysControlHistory = [new Set(), new Set()];
const mappedKeys = controls
	.map(({ keyboard }) => Object.values(keyboard))
	.flat();

const isButtonPressed = (id, code) => {
	if (
		heldGamepadButtons[id].has(code) &&
		!pressedGamepadButtons[id].has(code)
	) {
		pressedGamepadButtons[id].add(code);
		return true;
	}
	return false;
};

const isPressed = (code) => {
	if (heldKeys.has(code) && !pressedKeys.has(code)) {
		pressedKeys.add(code);
		return true;
	}
	return false;
};

const isPressedControlHistory = (id, code) => {
	const controlKeyId = controls[id].keyboard[code];
	const controlButtonId = controls[id].gamepad[code];
	if (
		heldKeys.has(controlKeyId) &&
		!pressedKeysControlHistory[id].has(controlKeyId)
	) {
		pressedKeysControlHistory[id].add(controlKeyId);
		return true;
	} else if (
		heldGamepadButtons[id].has(controlButtonId) &&
		!pressedKeysControlHistory[id].has(controlButtonId)
	) {
		pressedKeysControlHistory[id].add(controlButtonId);
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
		if (Object.values(controls[0].keyboard).includes(event.code))
			pressedKeysControlHistory[0].delete(event.code);
		else pressedKeysControlHistory[1].delete(event.code);
	}
};

export const registerKeyboardEvents = () => {
	window.addEventListener('keydown', handleKeyDown);
	window.addEventListener('keyup', handleKeyUp);
};

const handleGamepadConnected = (event) => {
	const gamepad = event.gamepad;
	gamePads[gamepad.index] = gamepad;
};

const handleGamepadDisconnected = (event) => {
	const gamepad = event.gamepad;
	const index = gamepad.index;
	gamepads.splice(index, 1);
};

export const updateGamePads = () => {
	const gamepadList = navigator.getGamepads();
	for (const [gamePadIndex, gamePad] of gamepadList.entries()) {
		if (!gamePad) continue;
		gamePad.buttons.forEach((button, index) => {
			if (!mappedButtons.has(index)) return;
			if (button.pressed) {
				// console.log(index);
				heldGamepadButtons[gamePadIndex].add(index);
			} else {
				heldGamepadButtons[gamePadIndex].delete(index);
				pressedGamepadButtons[gamePadIndex].delete(index);
				pressedKeysControlHistory[gamePadIndex].delete(index);
			}
		});
	}
	// if (gamepadList[0]) {
	// 	console.log(gamepadList[0].buttons[controls[0].gamepad[Control.LEFT]]);
	// 	console.log(
	// 		gamepadList[0].buttons[controls[0].gamepad[Control.LEFT]].pressed
	// 	);
	// }
	// if (gamepadList.some((gamepad) => gamepad))
	// 	console.log(gamepadList[0].buttons);
};

export const registerGamepadEvents = () => {
	window.addEventListener('gamepadconnected', handleGamepadConnected);
	window.addEventListener('gamepaddisconnected', handleGamepadDisconnected);
};

export const isLeft = (id) => {
	return (
		heldKeys.has(controls[id].keyboard[Control.LEFT]) ||
		heldGamepadButtons[id].has(controls[id].gamepad[Control.LEFT])
	);
};

export const isUp = (id) => {
	return (
		heldKeys.has(controls[id].keyboard[Control.UP]) ||
		heldGamepadButtons[id].has(controls[id].gamepad[Control.UP])
	);
};

export const isRight = (id) => {
	return (
		heldKeys.has(controls[id].keyboard[Control.RIGHT]) ||
		heldGamepadButtons[id].has(controls[id].gamepad[Control.RIGHT])
	);
};

export const isDown = (id) => {
	return (
		heldKeys.has(controls[id].keyboard[Control.DOWN]) ||
		heldGamepadButtons[id].has(controls[id].gamepad[Control.DOWN])
	);
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
	if (forControlHistory) return isPressedControlHistory(id, code);

	return (
		isButtonPressed(id, controls[id].gamepad[code]) ||
		isPressed(controls[id].keyboard[code])
	);
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
