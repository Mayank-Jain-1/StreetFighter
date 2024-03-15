import * as control from "../../InputHandler.js";
import { STAGE_FLOOR } from "../../constants/Stage.js";
import {
	FighterDirection,
	FighterState,
	FrameDelay,
	PushFriction,
} from "../../constants/fighter.js";
import { rectsOverlap } from "../../utils/collisions.js";

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
				init: this.resetVelocities,
				update: this.handleJumpStartState.bind(this),
				validFrom: [
					FighterState.IDLE,
					FighterState.WALK_FORWARD,
					FighterState.WALK_BACKWARD,
					FighterState.JUMP_LAND,
				],
			},
			[FighterState.JUMP_LAND]: {
				init: this.resetVelocities,
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
				init: this.resetVelocities,
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

	hasCollidedWithOpponent = () =>
		rectsOverlap(
			this.position.x + this.pushBox.x,
			this.position.y + this.pushBox.y,
			this.pushBox.width,
			this.pushBox.height,
			this.opponent.position.x + this.opponent.pushBox.x,
			this.opponent.position.y + this.opponent.pushBox.y,
			this.opponent.pushBox.width,
			this.opponent.pushBox.height
		);

	getDirection = () => {
		if (
			this.position.x + this.pushBox.x + this.pushBox.width >=
			this.opponent.position.x +
				this.opponent.pushBox.x +
				this.opponent.pushBox.width
		) {
			return FighterDirection.LEFT;
		} else if (
			this.position.x + this.pushBox.x <=
			this.opponent.position.x +
				this.opponent.pushBox.x +
				this.opponent.pushBox.width
		) {
			return FighterDirection.RIGHT;
		}

		return this.direction;
	};

	getPushBox = (frameKey) => {
		const [, [x, y, width, height] = [0, 0, 0, 0]] = this.frames.get(frameKey);

		return { x, y, width, height };
	};

	isAnimationCompleted = () => {
		return (
			this.animations[this.currentState][this.animationFrame][1] ===
			FrameDelay.TRANSITION
		);
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

	updateStageConstraints = (time, context, camera) => {
		// Right Boundary
		if (
			this.position.x - camera.position.x + this.pushBox.width >=
			context.canvas.width
		) {
			this.position.x =
				camera.position.x + context.canvas.width - this.pushBox.width;
			if (
				[
					FighterState.WALK_BACKWARD,
					FighterState.WALK_FORWARD,
					FighterState.JUMP_FORWARD,
					FighterState.JUMP_BACKWARD,
				].includes(this.currentState) &&
				camera.position.x <= 700 &&
				this.opponent.position.x >
					camera.position.x + this.opponent.pushBox.width
			) {
				camera.position.x += camera.speed * time.secondsPassed;
			}
		}

		// Left Boundary
		if (this.position.x - camera.position.x - this.pushBox.width <= 0) {
			this.position.x = camera.position.x + this.pushBox.width;
			if (
				[
					FighterState.WALK_BACKWARD,
					FighterState.WALK_FORWARD,
					FighterState.JUMP_FORWARD,
					FighterState.JUMP_BACKWARD,
				].includes(this.currentState) &&
				camera.position.x > 250 &&
				this.opponent.position.x - camera.position.x <
					context.canvas.width - this.opponent.pushBox.width
			) {
				camera.position.x -= camera.speed * time.secondsPassed;
			}
		}

		if (this.hasCollidedWithOpponent()) {
			if (this.position.x <= this.opponent.position.x) {
				this.position.x = Math.max(
					this.opponent.position.x +
						this.opponent.pushBox.x -
						(this.pushBox.x + this.pushBox.width),
					this.pushBox.width - 1
				);

				if (
					[
						FighterState.IDLE,
						FighterState.CROUCH,
						FighterState.JUMP_UP,
						FighterState.JUMP_BACKWARD,
						FighterState.JUMP_FORWARD,
					].includes(this.opponent.currentState)
				) {
					this.opponent.position.x += PushFriction * time.secondsPassed;
				}
			} else if (this.position.x >= this.opponent.position.x) {
				this.position.x = Math.min(
					camera.position.x + context.canvas.width - this.pushBox.width,
					this.opponent.position.x + this.opponent.pushBox.width
				);
				if (
					[
						FighterState.IDLE,
						FighterState.CROUCH,
						FighterState.JUMP_UP,
						FighterState.JUMP_BACKWARD,
						FighterState.JUMP_FORWARD,
					].includes(this.opponent.currentState)
				) {
					this.opponent.position.x -= PushFriction * time.secondsPassed;
				}
			}
		}
	};

	resetVelocities = () => {
		this.velocity.x = 0;
		this.velocity.y = 0;
	};

	handleIdleInit = () => {
		this.resetVelocities();
		this.handleIdleInit;
	};

	handleIdle = () => {
		control.isUp(this.playerId, this.direction)
			? this.changeState(FighterState.JUMP_START)
			: control.isDown(this.playerId)
			? this.changeState(FighterState.CROUCH_DOWN)
			: control.isForward(this.playerId, this.direction)
			? this.changeState(FighterState.WALK_FORWARD)
			: control.isBackward(this.playerId, this.direction) &&
			  this.changeState(FighterState.WALK_BACKWARD);

		const newDirection = this.getDirection();
		if (newDirection !== this.direction) {
			this.direction = newDirection;
			this.changeState(FighterState.IDLE_TURN);
		}
	};

	handleWalkForward = () => {
		!control.isForward(this.playerId, this.direction)
			? this.changeState(FighterState.IDLE)
			: control.isUp(this.playerId)
			? this.changeState(FighterState.JUMP_FORWARD)
			: control.isDown(this.playerId) &&
			  this.changeState(FighterState.CROUCH_DOWN);
	};

	hanldeWalkBackward = () => {
		!control.isBackward(this.playerId, this.direction)
			? this.changeState(FighterState.IDLE)
			: control.isUp(this.playerId)
			? this.changeState(FighterState.JUMP_BACKWARD)
			: control.isDown(this.playerId) &&
			  this.changeState(FighterState.CROUCH_DOWN);
	};

	handleCrouchDownUpdate = () => {
		if (this.isAnimationCompleted()) {
			this.changeState(FighterState.CROUCH);
		}
		if (!control.isDown(this.playerId)) {
			this.currentState = FighterState.CROUCH_UP;
			this.animationFrame =
				this.animations[this.currentState].length - this.animationFrame - 1;
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
		if (this.isAnimationCompleted()) {
			this.changeState(FighterState.IDLE);
		}
	};

	handleCrouchTurn = () => {
		if (this.isAnimationCompleted()) {
			this.changeState(FighterState.CROUCH);
		}
	};

	handleMoveInit = () => {
		this.velocity.x = this.initialVelocity.x[this.currentState] ?? 0;
	};

	handleJumpStartState = () => {
		if (this.isAnimationCompleted()) {
			if (control.isBackward(this.playerId, this.direction))
				this.changeState(FighterState.JUMP_BACKWARD);
			else if (control.isForward(this.playerId, this.direction))
				this.changeState(FighterState.JUMP_FORWARD);
			else this.changeState(FighterState.JUMP_UP);
		}
	};

	handleJumpLandState = () => {
		if (this.animationFrame == 0) return;
		this.handleIdle();
		if (this.isAnimationCompleted()) this.changeState(FighterState.IDLE);
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

		if (this.isAnimationCompleted()) {
			this.changeState(FighterState.IDLE);
		}
	};

	drawDebug = (context, camera) => {
		const [frameKey] = this.animations[this.currentState][this.animationFrame];
		const pushBox = this.getPushBox(frameKey);
		context.lineWidth = 1;
		// Push Box

		context.beginPath();
		context.strokeStyle = "#55ff55";
		context.fillStyle = "#55ff5555";
		context.fillRect(
			Math.floor(this.position.x - camera.position.x + pushBox.x) + 0.5,
			Math.floor(this.position.y + pushBox.y - camera.position.y) + 0.5,
			pushBox.width,
			pushBox.height
		);
		context.rect(
			Math.floor(this.position.x - camera.position.x + pushBox.x) + 0.5,
			Math.floor(this.position.y + pushBox.y - camera.position.y) + 0.5,
			pushBox.width,
			pushBox.height
		);
		context.stroke();

		// Origin
		context.beginPath();
		context.strokeStyle = "white";
		context.moveTo(
			Math.floor(this.position.x - camera.position.x) + 5,
			Math.floor(this.position.y - camera.position.y) - 0.5
		);
		context.lineTo(
			Math.floor(this.position.x - camera.position.x) - 4,
			Math.floor(this.position.y - camera.position.y) - 0.5
		);
		context.moveTo(
			Math.floor(this.position.x - camera.position.x) + 0.5,
			Math.floor(this.position.y - camera.position.y) - 5
		);
		context.lineTo(
			Math.floor(this.position.x - camera.position.x) + 0.5,
			Math.floor(this.position.y - camera.position.y) + 4
		);
		context.stroke();
	};

	updateAnimation = (time) => {
		const animation = this.animations[this.currentState];
		const [frameKey, frameDelay] = animation[this.animationFrame];
		if (time.previous >= this.animationTime + frameDelay) {
			this.animationTime = time.previous;

			if (frameDelay > FrameDelay.FREEZE) {
				this.animationFrame++;
				this.pushBox = this.getPushBox(frameKey);
			}

			if (this.animationFrame >= animation.length) this.animationFrame = 0;
		}
	};

	update = (time, context, camera) => {
		this.position.x += this.velocity.x * this.direction * time.secondsPassed;
		this.position.y += this.velocity.y * time.secondsPassed;
		this.states[this.currentState].update(time, context);
		this.updateAnimation(time);
		this.updateStageConstraints(time, context, camera);
	};

	draw = (context, camera) => {
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
			Math.floor((this.position.x - camera.position.x) * this.direction) -
				originX,
			Math.floor(this.position.y - camera.position.y) - originY,
			width,
			height
		);

		context.setTransform(1, 0, 0, 1, 0, 0);
		this.drawDebug(context, camera);
	};
}
