export const Control = {
	LEFT: "left",
	RIGHT: "right",
	UP: "up",
	DOWN: "down",
	LIGHT_PUNCH: "lightPunch",
	MEDIUM_PUNCH: "mediumPunch",
	HEAVY_PUNCH: "heavyPunch",
	LIGHT_KICK: "lightKick",
	MEDIUM_KICK: "mediumKick",
	HEAVY_KICK: "heavyKick",
};

export const controls = [
	{
		keyboard: {
			[Control.LEFT]: "KeyA",
			[Control.RIGHT]: "KeyD",
			[Control.UP]: "KeyW",
			[Control.DOWN]: "KeyS",
			[Control.LIGHT_PUNCH]: "KeyQ",
			[Control.MEDIUM_PUNCH]: "KeyE",
			[Control.HEAVY_PUNCH]: "KeyR",
			[Control.LIGHT_KICK]: "KeyZ",
      [Control.MEDIUM_KICK]: "KeyX",
      [Control.HEAVY_KICK]: "KeyC",
		},
	},
	{
		keyboard: {
			[Control.LEFT]: "ArrowLeft",
			[Control.RIGHT]: "ArrowRight",
			[Control.UP]: "ArrowUp",
			[Control.DOWN]: "ArrowDown",
			[Control.LIGHT_PUNCH]: "Slash",
			[Control.MEDIUM_PUNCH]: "ControlRight",
			[Control.HEAVY_PUNCH]: "Period",
			[Control.LIGHT_KICK]: "ShiftRight",
      [Control.MEDIUM_KICK]: "Quote",
      [Control.HEAVY_KICK]: "Enter",
		},
	},
];
