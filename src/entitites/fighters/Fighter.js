import { STAGE_FLOOR } from "../../constants/Stage.js";
import { FighterDirection, FighterState } from "../../constants/fighter.js";

export class Fighter {
	constructor(name, x, y, direction) {
		this.name = name;
		this.position = { x, y };
		this.direction = direction;
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
		this.states = {
			[FighterState.IDLE]: {
				init: this.handleIdleInit.bind(this),
				update: this.handleIdleUpdate.bind(this),
			},
			[FighterState.WALK_FORWARD]: {
				init: this.handleWalkForwardInit.bind(this),
				update: this.handleWalkForwardUpdate.bind(this),
			},
			[FighterState.WALK_BACKWARD]: {
				init: this.handleWalkBackwardInit.bind(this),
				update: () => {},
			},
			[FighterState.JUMP_UP]: {
				init: this.handleJumpUpInit.bind(this),
				update: this.handleJumpUpUpdate.bind(this),
			},
		};
		this.changeState(FighterState.IDLE);
	}

	changeState = (newState) => {
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
	handleIdleUpdate = () => {};

	handleWalkForwardInit = () => {
		this.velocity.x = 150 * this.direction;
	};

	handleWalkForwardUpdate = () => {};

	handleWalkBackwardInit = () => {
		this.velocity.x = -150 * this.direction;
	};

	handleWalkBackwardUpdate = () => {};

	handleJumpUpInit = () => {
		this.velocity.y = this.initialVelocity.jump;
	};
	handleJumpUpUpdate = (time) => {
		this.velocity.y += time.secondsPassed * this.gravity;
		if (this.position.y > STAGE_FLOOR) {
			this.position.y = STAGE_FLOOR;
			this.changeState(FighterState.IDLE);
		}
	};

	updateAnimation = (time) => {
		if (
			time.previous >=
			this.animationTime +
				this.animations[this.currentState][this.animationFrame][1]
		) {
			this.animationTime = time.previous;
			this.animationFrame++;
			if (this.animationFrame > this.animations[this.currentState].length - 1)
				this.animationFrame = 0;
		}
		this.states[this.currentState].update(time);
	};

	update = (time, context) => {
		this.updateAnimation(time);
		this.position.x += this.velocity.x * time.secondsPassed;
		this.position.y += this.velocity.y * time.secondsPassed;

		const [[, , width]] = this.frames.get(
			this.animations[this.currentState][this.animationFrame][0]
		);
		this.updateStageConstraints(context);
	};

	draw = (context) => {
		const [[x, y, width, height], [originX, originY]] = this.frames.get(
			this.animations[this.currentState][this.animationFrame][0]
		);

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
