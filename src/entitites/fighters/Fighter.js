import * as control from "../../InputHandler.js";
import { STAGE_FLOOR } from "../../constants/Stage.js";
import { FighterDirection, FighterState } from "../../constants/fighter.js";

export class Fighter {
	constructor(name, x, y, direction, playerId) {
		this.name = name;
		this.position = { x, y };
		this.direction = direction;
		this.playerId = playerId;
		this.velocity = {
			x: 0,
			y: 0,
		};
		this.initialVelocity = {};
		this.gravity = 0;
		this.image = new Image();
		this.frames = new Map();
		this.animationFrame = 0;
		this.animationTime = 0;
		this.animations = {};
		this.currentState = FighterState.IDLE;
		this.states = {
			[FighterState.IDLE]: {
				init: this.handleIdleInit.bind(this),
				update: this.handleIdle.bind(this),
				validFrom: [
					undefined,
					FighterState.IDLE,
					FighterState.WALK_FORWARD,
					FighterState.WALK_BACKWARD,
					FighterState.JUMP_UP,
					FighterState.JUMP_FORWARD,
					FighterState.JUMP_BACKWARD,
					FighterState.CROUCH_UP,
					FighterState.JUMP_LAND,
					FighterState.IDLE_TURN,
				],
			},
			[FighterState.WALK_FORWARD]: {
				init: this.handleMoveInit.bind(this),
				update: this.handleWalkForward.bind(this),
				validFrom: [
					FighterState.IDLE,
					FighterState.JUMP_FORWARD,
					FighterState.WALK_BACKWARD,
					FighterState.JUMP_LAND,
				],
			},
			[FighterState.WALK_BACKWARD]: {
				init: this.handleMoveInit.bind(this),
				update: this.hanldeWalkBackward.bind(this),
				validFrom: [
					FighterState.IDLE,
					FighterState.WALK_FORWARD,
					FighterState.JUMP_BACKWARD,
					FighterState.JUMP_LAND,
				],
			},
			[FighterState.JUMP_START]: {
				init: this.handleJumpStartInit.bind(this),
				update: this.handleJumpStartState.bind(this),
				validFrom: [
					FighterState.IDLE,
					FighterState.WALK_FORWARD,
					FighterState.WALK_BACKWARD,
					FighterState.JUMP_LAND,
				],
			},
			[FighterState.JUMP_LAND]: {
				init: this.handleJumpLandInit.bind(this),
				update: this.handleJumpLandState.bind(this),
				validFrom: [
					FighterState.JUMP_UP,
					FighterState.JUMP_FORWARD,
					FighterState.JUMP_BACKWARD,
				],
			},
			[FighterState.JUMP_UP]: {
				init: this.handleJumpInit.bind(this),
				update: this.handleJump.bind(this),
				validFrom: [FighterState.IDLE, FighterState.JUMP_START],
			},
			[FighterState.JUMP_FORWARD]: {
				init: this.handleJumpInit.bind(this),
				update: this.handleJump.bind(this),
				validFrom: [FighterState.JUMP_START, FighterState.WALK_FORWARD],
			},
			[FighterState.JUMP_BACKWARD]: {
				init: this.handleJumpInit.bind(this),
				update: this.handleJump.bind(this),
				validFrom: [FighterState.JUMP_START, FighterState.WALK_BACKWARD],
			},
			[FighterState.CROUCH_DOWN]: {
				init: this.handleIdleInit.bind(this),
				update: this.handleCrouchDownUpdate.bind(this),
				validFrom: [
					FighterState.IDLE,
					FighterState.WALK_FORWARD,
					FighterState.WALK_BACKWARD,
					FighterState.JUMP_LAND,
				],
			},
			[FighterState.CROUCH]: {
				init: () => {},
				update: this.handleCrouch.bind(this),
				validFrom: [FighterState.CROUCH_DOWN, FighterState.CROUCH_TURN],
			},
			[FighterState.CROUCH_UP]: {
				init: () => {},
				update: this.handleCrouchUpUpdate.bind(this),
				validFrom: [FighterState.CROUCH],
			},
			[FighterState.IDLE_TURN]: {
				init: () => {},
				update: this.handleIdleTurnState.bind(this),
				validFrom: [
					FighterState.IDLE,
					FighterState.JUMP_LAND,
					FighterState.WALK_FORWARD,
					FighterState.WALK_BACKWARD,
				],
			},
			[FighterState.CROUCH_TURN]: {
				init: () => {},
				update: this.handleCrouchTurn.bind(this),
				validFrom: [FighterState.CROUCH],
			},
		};
		this.changeState(FighterState.CROUCH);
		this.opponent;
		this.pushBox = { x: 0, y: 0, width: 0, height: 0 };
	}

	getDirection = () =>
		this.opponent.position.x > this.position.x
			? FighterDirection.RIGHT
			: FighterDirection.LEFT;

	getPushBox = (frameKey) => {
		const [, [x, y, width, height] = [0, 0, 0, 0]] = this.frames.get(frameKey);

		return { x, y, width, height };
	};

	changeState = (newState) => {
		if (
			newState === this.currentState ||
			!this.states[newState].validFrom.includes(this.currentState)
		) {
			return;
		}
		this.currentState = newState;
		this.animationFrame = 0;
		this.states[this.currentState].init();
	};

	updateStageConstraints = (context) => {
		const WIDTH = 32;

		if (this.position.x + 32 >= context.canvas.width) {
			this.position.x = context.canvas.width - WIDTH;
		}
		if (this.position.x - 32 <= 0) {
			this.position.x = WIDTH;
		}
	};

	handleIdleInit = () => {
		this.velocity.x = 0;
		this.velocity.y = 0;
	};

	handleIdle = () => {
		control.isUp(this.playerId, this.direction) &&
			this.changeState(FighterState.JUMP_START);

		control.isDown(this.playerId) && this.changeState(FighterState.CROUCH_DOWN);

		control.isForward(this.playerId, this.direction) &&
			this.changeState(FighterState.WALK_FORWARD);
		control.isBackward(this.playerId, this.direction) &&
			this.changeState(FighterState.WALK_BACKWARD);

		const newDirection = this.getDirection();
		if (newDirection !== this.direction) {
			this.direction = newDirection;
			this.changeState(FighterState.IDLE_TURN);
		}
	};

	handleWalkForward = () => {
		!control.isForward(this.playerId, this.direction) &&
			this.changeState(FighterState.IDLE);
		control.isUp(this.playerId) && this.changeState(FighterState.JUMP_FORWARD);

		control.isDown(this.playerId) && this.changeState(FighterState.CROUCH_DOWN);
	};

	hanldeWalkBackward = () => {
		!control.isBackward(this.playerId, this.direction) &&
			this.changeState(FighterState.IDLE);
		control.isUp(this.playerId) && this.changeState(FighterState.JUMP_BACKWARD);

		control.isDown(this.playerId) && this.changeState(FighterState.CROUCH_DOWN);
	};

	handleCrouchDownUpdate = () => {
		if (this.animations[this.currentState][this.animationFrame][1] === -2) {
			this.changeState(FighterState.CROUCH);
		}
	};

	handleCrouch = () => {
		!control.isDown(this.playerId) && this.changeState(FighterState.CROUCH_UP);

		const newDirection = this.getDirection();
		if (newDirection !== this.direction) {
			this.direction = newDirection;
			this.changeState(FighterState.CROUCH_TURN);
		}
	};

	handleCrouchUpUpdate = () => {
		if (this.animations[this.currentState][this.animationFrame][1] === -2) {
			this.changeState(FighterState.IDLE);
		}
	};

	handleCrouchTurn = () => {
		if (this.animations[this.currentState][this.animationFrame][1] === -2) {
			this.changeState(FighterState.CROUCH);
		}
	};

	handleMoveInit = () => {
		this.velocity.x = this.initialVelocity.x[this.currentState] ?? 0;
	};

	handleJumpStartInit = () => {
		if (this.animations[this.currentState][this.animationFrame][1] == -2) {
			if (control.isBackward(this.playerId, this.direction))
				this.changeState(FighterState.JUMP_BACKWARD);
			else if (control.isForward(this.playerId, this.direction))
				this.changeState(FighterState.JUMP_FORWARD);
			else this.changeState(FighterState.JUMP_UP);
		}
	};

	handleJumpStartState = () => {
		if (this.animations[this.currentState][this.animationFrame][1] == -2) {
			if (control.isBackward(this.playerId, this.direction))
				this.changeState(FighterState.JUMP_BACKWARD);
			else if (control.isForward(this.playerId, this.direction))
				this.changeState(FighterState.JUMP_FORWARD);
			else this.changeState(FighterState.JUMP_UP);
		}
	};

	handleJumpLandInit = () => {
		this.handleIdleInit();
	};

	handleJumpLandState = () => {
		if (this.animationFrame == 0) return;
		this.handleIdle();
		if (this.animations[this.currentState][this.animationFrame][1] == -2)
			this.changeState(FighterState.IDLE);
	};

	handleJumpInit = () => {
		this.velocity.y = this.initialVelocity.jump;
		this.handleMoveInit();
	};
	handleJump = (time) => {
		this.velocity.y += time.secondsPassed * this.gravity;
		if (this.position.y > STAGE_FLOOR) {
			this.position.y = STAGE_FLOOR;
			this.changeState(FighterState.JUMP_LAND);
		}
	};

	handleIdleTurnState = () => {
		this.handleIdleInit();

		if (this.animations[this.currentState][this.animationFrame][1] === -2) {
			this.changeState(FighterState.IDLE);
		}
	};

	drawDebug = (context) => {
		const [frameKey] = this.animations[this.currentState][this.animationFrame];
		console.log(frameKey);
		const pushBox = this.getPushBox(frameKey);
		console.log(pushBox);
		context.lineWidth = 1;
		// Push Box

		console.log(this.position.x, this.position.y, pushBox.x, pushBox.y);
		context.beginPath();
		context.strokeStyle = "#55ff55";
		context.fillStyle = "#55ff5555";
		context.fillRect(
			Math.floor(this.position.x + pushBox.x) + 0.5,
			Math.floor(this.position.y + pushBox.y) + 0.5,
			pushBox.width,
			pushBox.height
		);
		context.rect(
			Math.floor(this.position.x + pushBox.x) + 0.5,
			Math.floor(this.position.y + pushBox.y) + 0.5,
			pushBox.width,
			pushBox.height
		);
		context.stroke();

		// Origin
		context.beginPath();
		context.strokeStyle = "white";
		context.moveTo(
			Math.floor(this.position.x) + 4,
			Math.floor(this.position.y) - 0.5
		);
		context.lineTo(
			Math.floor(this.position.x) - 4,
			Math.floor(this.position.y) - 0.5
		);
		context.moveTo(
			Math.floor(this.position.x) + 0.5,
			Math.floor(this.position.y) - 5
		);
		context.lineTo(
			Math.floor(this.position.x) + 0.5,
			Math.floor(this.position.y) + 4
		);
		context.stroke();
	};

	updateAnimation = (time) => {
		const animation = this.animations[this.currentState];
		const [frameKey, frameDelay] = animation[this.animationFrame];
		if (time.previous >= this.animationTime + frameDelay) {
			this.animationTime = time.previous;

			if (frameDelay > 0) {
				this.animationFrame++;
				this.pushBox = this.getPushBox(frameKey);
			}

			if (this.animationFrame >= animation.length) this.animationFrame = 0;
		}
	};

	update = (time, context) => {
		this.position.x += this.velocity.x * this.direction * time.secondsPassed;
		this.position.y += this.velocity.y * time.secondsPassed;
		this.states[this.currentState].update(time, context);
		this.updateAnimation(time);
		this.updateStageConstraints(context);
	};

	draw = (context) => {
		const frameKey = this.animations[this.currentState][this.animationFrame][0];
		const [[[x, y, width, height], [originX, originY]]] =
			this.frames.get(frameKey);

		context.scale(this.direction, 1);

		context.drawImage(
			this.image,
			x,
			y,
			width,
			height,
			Math.floor(this.position.x * this.direction) - originX,
			Math.floor(this.position.y) - originY,
			width,
			height
		);

		context.setTransform(1, 0, 0, 1, 0, 0);
		this.drawDebug(context);
	};
}
