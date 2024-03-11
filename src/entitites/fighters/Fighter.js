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
		(this.states = {
			[FighterState.IDLE]: {
				init: this.handleIdleInit.bind(this),
				update: this.hanldeIdle.bind(this),
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
				validFrom: [FighterState.CROUCH_DOWN],
			},
			[FighterState.CROUCH_UP]: {
				init: () => {},
				update: this.handleCrouchUpUpdate.bind(this),
				validFrom: [FighterState.CROUCH],
			},
		}),
			this.changeState(FighterState.IDLE);

		this.opponent;
	}

	getDirection = () =>
		this.opponent.position.x > this.position.x
			? FighterDirection.RIGHT
			: FighterDirection.LEFT;

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

	hanldeIdle = () => {
		control.isUp(this.playerId, this.direction) &&
			this.changeState(FighterState.JUMP_START);

		control.isDown(this.playerId) && this.changeState(FighterState.CROUCH_DOWN);

		control.isForward(this.playerId, this.direction) &&
			this.changeState(FighterState.WALK_FORWARD);
		control.isBackward(this.playerId, this.direction) &&
			this.changeState(FighterState.WALK_BACKWARD);
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
	};

	handleCrouchUpUpdate = () => {
		if (this.animations[this.currentState][this.animationFrame][1] === -2) {
			this.changeState(FighterState.IDLE);
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
		this.hanldeIdle();
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

	updateAnimation = (time) => {
		const animation = this.animations[this.currentState];
		const [, frameDelay] = animation[this.animationFrame];
		if (time.previous >= this.animationTime + frameDelay) {
			this.animationTime = time.previous;

			if (frameDelay > 0) this.animationFrame++;

			if (this.animationFrame >= animation.length) this.animationFrame = 0;
		}
	};

	update = (time, context) => {
		console.log(this.direction);
		this.position.x += this.velocity.x * this.direction * time.secondsPassed;
		this.position.y += this.velocity.y * time.secondsPassed;

		if (
			[
				FighterState.IDLE,
				FighterState.WALK_BACKWARD,
				FighterState.WALK_FORWARD,
				FighterState.JUMP_LAND,
				FighterState.CROUCH,
			].includes(this.currentState)
		) {
			const newDirection = this.getDirection();
			if(newDirection !== this.direction)this.changeState(FighterState.IDLE)
			this.direction = newDirection;
		}

		this.states[this.currentState].update(time, context);
		this.updateAnimation(time);
		this.updateStageConstraints(context);
	};

	draw = (context) => {
		const frameKey = this.animations[this.currentState][this.animationFrame][0];
		const [[x, y, width, height], [originX, originY]] =
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
	};
}
