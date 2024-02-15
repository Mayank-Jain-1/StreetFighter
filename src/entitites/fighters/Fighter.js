import * as control from "../../InputHandler.js";
import { STAGE_FLOOR } from "../../constants/Stage.js";
import { FighterState } from "../../constants/fighter.js";

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
				update: this.hanldeIdleState.bind(this),
				validFrom: [
					undefined,
					FighterState.IDLE,
					FighterState.WALK_FORWARD,
					FighterState.WALK_BACKWARD,
					FighterState.JUMP_UP,
					FighterState.JUMP_FORWARD,
					FighterState.JUMP_BACKWARD,
					FighterState.CROUCH_UP,
				],
			},
			[FighterState.WALK_FORWARD]: {
				init: this.handleMoveInit.bind(this),
				update: () => {},
				validFrom: [
					FighterState.IDLE,
					FighterState.JUMP_FORWARD,
					FighterState.WALK_BACKWARD,
				],
			},
			[FighterState.WALK_BACKWARD]: {
				init: this.handleMoveInit.bind(this),
				update: () => {},
				validFrom: [
					FighterState.IDLE,
					FighterState.WALK_FORWARD,
					FighterState.JUMP_BACKWARD,
				],
			},
			[FighterState.JUMP_UP]: {
				init: this.handleJumpInit.bind(this),
				update: this.handleJumpUpdate.bind(this),
				validFrom: [FighterState.IDLE],
			},
			[FighterState.JUMP_FORWARD]: {
				init: this.handleJumpInit.bind(this),
				update: this.handleJumpUpdate.bind(this),
				validFrom: [FighterState.IDLE, FighterState.WALK_FORWARD],
			},
			[FighterState.JUMP_BACKWARD]: {
				init: this.handleJumpInit.bind(this),
				update: this.handleJumpUpdate.bind(this),
				validFrom: [FighterState.IDLE, FighterState.WALK_BACKWARD],
			},
			[FighterState.CROUCH_DOWN]: {
				init: () => {},
				update: this.handleCrouchDownUpdate.bind(this),
				validFrom: [
					FighterState.IDLE,
					FighterState.WALK_FORWARD,
					FighterState.WALK_BACKWARD,
				],
			},
			[FighterState.CROUCH]: {
				init: () => {},
				update: () => {},
				validFrom: [FighterState.CROUCH_DOWN],
			},
			[FighterState.CROUCH_UP]: {
				init: () => {},
				update: this.handleCrouchUpUpdate.bind(this),
				validFrom: [FighterState.CROUCH],
			},
		}),
			this.changeState(FighterState.IDLE);
	}

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

	hanldeIdleState = () => {
		control.isForward(this.playerId, this.direction) &&
			this.changeState(FighterState.WALK_BACKWARD);
		control.isBackward(this.playerId, this.direction) &&
			this.changeState(FighterState.WALK_FORWARD);
	};

	handleCrouchDownUpdate = () => {
		if (this.animations[this.currentState][this.animationFrame][1] === -2) {
			this.changeState(FighterState.CROUCH);
		}
	};

	handleCrouchUpUpdate = () => {
		if (this.animations[this.currentState][this.animationFrame][1] === -2) {
			this.changeState(FighterState.IDLE);
		}
	};

	handleIdleInit = () => {
		this.velocity.x = 0;
		this.velocity.y = 0;
	};

	handleMoveInit = () => {
		this.velocity.x = this.initialVelocity.x[this.currentState] ?? 0;
	};

	handleJumpInit = () => {
		this.velocity.y = this.initialVelocity.jump;
		this.handleMoveInit();
	};
	handleJumpUpdate = (time) => {
		this.velocity.y += time.secondsPassed * this.gravity;
		if (this.position.y > STAGE_FLOOR) {
			this.position.y = STAGE_FLOOR;
			this.changeState(FighterState.IDLE);
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
		this.position.x += this.velocity.x * this.direction * time.secondsPassed;
		this.position.y += this.velocity.y * time.secondsPassed;
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
