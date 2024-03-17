export const FIGHTER_START_DISTANCE = 88

export const FighterDirection = {
	LEFT: -1,
	RIGHT: 1,
};

export const FighterState = {
	IDLE: "idle",
	WALK_FORWARD: "walkForwards",
	WALK_BACKWARD: "walkBackwards",
	JUMP_START: "jumpStart",
	JUMP_UP: "jumpUp",
	JUMP_FORWARD: "jumpForwards",
	JUMP_BACKWARD: "jumpBackwards",
	JUMP_LAND: "jumpLand",
	CROUCH: "crouch",
	CROUCH_UP: "crouchUp",
	CROUCH_DOWN: "crouchDown",
	IDLE_TURN: "idleTurn",
	CROUCH_TURN: "crouchTurn",
};

export const FrameDelay = {
  FREEZE: 0,
  TRANSITION: -1
}

export const PushBox = {
	IDLE: [-16, -80, 32, 78],
	JUMP: [-16, -91, 32, 66],
	BEND: [-16, -58, 32, 58],
	CROUCH: [-16, -50, 32, 50],
};

export const PushFriction = 66