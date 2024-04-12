import * as control from '../../engine/InputHandler.js';
import {
	SCENE_WIDTH,
	STAGE_FLOOR,
	STAGE_MID_POINT,
	STAGE_PADDING,
	STAGE_WIDTH,
} from '../../constants/Stage.js';
import {
	FighterAttackType,
	FIGHTER_START_DISTANCE,
	FighterDirection,
	FighterState,
	FrameDelay,
	PushFriction,
	FighterAttackBaseData,
	FighterAttackStrength,
} from '../../constants/fighter.js';
import {
	boxOverlap,
	getActualBoxDimensions,
	rectsOverlap,
} from '../../utils/collisions.js';
import { FRAME_TIME } from '../../constants/game.js';
import { DRAW_DEBUG, HIT_SPLASH_RANDOMNESS } from '../../constants/battle.js';
import { DEBUG_drawCollisionInfo } from '../../utils/fighterDebug.js';
import {
	soundAttackIds,
	soundHitIds,
	soundLandId,
} from '../../constants/sounds.js';
import { playSound, stopSound } from '../../engine/SoundHandler.js';

// TODO Convert hurt: [[], [], []] to {head:[], body:[], legs:[],}

export class Fighter {
	velocity = {
		x: 0,
		y: 0,
	};
	initialVelocity = {};
	gravity = 0;
	image = new Image();
	frames = new Map();
	animationFrame = 0;
	animationTime = 0;
	animations = {};

	opponent = undefined;
	boxes = {
		push: { pushX: 0, pushY: 0, pushWidth: 0, pushHeight: 0 },
		hurt: [
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
		],
		hit: { x: 0, y: 0, width: 0, height: 0 },
	};
	attackStruck = false;
	soundAttacks = {
		[FighterAttackStrength.LIGHT]: document.getElementById(
			soundAttackIds.LIGHT
		),
		[FighterAttackStrength.MEDIUM]: document.getElementById(
			soundAttackIds.MEDIUM
		),
		[FighterAttackStrength.HEAVY]: document.getElementById(
			soundAttackIds.HEAVY
		),
	};

	soundHits = {
		[FighterAttackStrength.LIGHT]: {
			[FighterAttackType.PUNCH]: document.getElementById(
				soundHitIds.LIGHT.PUNCH
			),
			[FighterAttackType.KICK]: document.getElementById(soundHitIds.LIGHT.KICK),
		},
		[FighterAttackStrength.MEDIUM]: {
			[FighterAttackType.PUNCH]: document.getElementById(
				soundHitIds.MEDIUM.PUNCH
			),
			[FighterAttackType.KICK]: document.getElementById(
				soundHitIds.MEDIUM.KICK
			),
		},
		[FighterAttackStrength.HEAVY]: {
			[FighterAttackType.PUNCH]: document.getElementById(
				soundHitIds.HEAVY.PUNCH
			),
			[FighterAttackType.KICK]: document.getElementById(soundHitIds.HEAVY.KICK),
		},
	};

	soundLand = document.getElementById(soundLandId);

	constructor(playerId, handleAttackHit) {
		this.playerId = playerId;
		this.handleAttackHit = handleAttackHit;
		this.position = {
			x:
				STAGE_MID_POINT +
				STAGE_PADDING +
				(playerId === 0 ? -1 : 1) * FIGHTER_START_DISTANCE,
			STAGE_FLOOR,
			y: STAGE_FLOOR,
		};
		this.direction =
			playerId === 0 ? FighterDirection.RIGHT : FighterDirection.LEFT;

		this.states = {
			[FighterState.IDLE]: {
				init: this.handleIdleInit,
				update: this.handleIdle,
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
					FighterState.LIGHT_PUNCH,
					FighterState.MEDIUM_PUNCH,
					FighterState.HEAVY_PUNCH,
					FighterState.LIGHT_KICK,
					FighterState.MEDIUM_KICK,
					FighterState.HEAVY_KICK,
				],
			},
			[FighterState.WALK_FORWARD]: {
				init: this.handleMoveInit,
				update: this.handleWalkForward,
				validFrom: [
					FighterState.IDLE,
					FighterState.JUMP_FORWARD,
					FighterState.WALK_BACKWARD,
					FighterState.JUMP_LAND,
				],
			},
			[FighterState.WALK_BACKWARD]: {
				init: this.handleMoveInit,
				update: this.hanldeWalkBackward,
				validFrom: [
					FighterState.IDLE,
					FighterState.WALK_FORWARD,
					FighterState.JUMP_BACKWARD,
					FighterState.JUMP_LAND,
				],
			},
			[FighterState.JUMP_START]: {
				init: this.resetVelocities,
				update: this.handleJumpStartState,
				validFrom: [
					FighterState.IDLE,
					FighterState.WALK_FORWARD,
					FighterState.WALK_BACKWARD,
					FighterState.JUMP_LAND,
				],
			},
			[FighterState.JUMP_LAND]: {
				init: this.resetVelocities,
				update: this.handleJumpLandState,
				validFrom: [
					FighterState.JUMP_UP,
					FighterState.JUMP_FORWARD,
					FighterState.JUMP_BACKWARD,
				],
			},
			[FighterState.JUMP_UP]: {
				init: this.handleJumpInit,
				update: this.handleJump,
				validFrom: [FighterState.IDLE, FighterState.JUMP_START],
			},
			[FighterState.JUMP_FORWARD]: {
				init: this.handleJumpInit,
				update: this.handleJump,
				validFrom: [FighterState.JUMP_START, FighterState.WALK_FORWARD],
			},
			[FighterState.JUMP_BACKWARD]: {
				init: this.handleJumpInit,
				update: this.handleJump,
				validFrom: [FighterState.JUMP_START, FighterState.WALK_BACKWARD],
			},
			[FighterState.CROUCH_DOWN]: {
				init: this.resetVelocities,
				update: this.handleCrouchDownUpdate,
				validFrom: [
					FighterState.IDLE,
					FighterState.WALK_FORWARD,
					FighterState.WALK_BACKWARD,
					FighterState.JUMP_LAND,
				],
			},
			[FighterState.CROUCH]: {
				init: () => {},
				update: this.handleCrouch,
				validFrom: [FighterState.CROUCH_DOWN, FighterState.CROUCH_TURN],
			},
			[FighterState.CROUCH_UP]: {
				init: () => {},
				update: this.handleCrouchUpUpdate,
				validFrom: [FighterState.CROUCH],
			},
			[FighterState.IDLE_TURN]: {
				init: () => {},
				update: this.handleIdleTurnState,
				validFrom: [
					FighterState.IDLE,
					FighterState.JUMP_LAND,
					FighterState.WALK_FORWARD,
					FighterState.WALK_BACKWARD,
				],
			},
			[FighterState.CROUCH_TURN]: {
				init: () => {},
				update: this.handleCrouchTurn,
				validFrom: [FighterState.CROUCH],
			},
			[FighterState.LIGHT_PUNCH]: {
				attackType: FighterAttackType.PUNCH,
				attackStrength: FighterAttackStrength.LIGHT,
				init: this.handleAttackInit,
				update: this.handleLightKick,
				validFrom: [
					FighterState.IDLE,
					FighterState.WALK_FORWARD,
					FighterState.WALK_BACKWARD,
				],
			},
			[FighterState.MEDIUM_PUNCH]: {
				attackType: FighterAttackType.PUNCH,
				attackStrength: FighterAttackStrength.MEDIUM,
				init: this.handleAttackInit,
				update: this.handleMedKick,
				validFrom: [
					FighterState.IDLE,
					FighterState.WALK_FORWARD,
					FighterState.WALK_BACKWARD,
				],
			},
			[FighterState.HEAVY_PUNCH]: {
				attackType: FighterAttackType.PUNCH,
				attackStrength: FighterAttackStrength.HEAVY,
				init: this.handleAttackInit,
				update: this.handleHeavyKick,
				validFrom: [
					FighterState.IDLE,
					FighterState.WALK_FORWARD,
					FighterState.WALK_BACKWARD,
				],
			},
			[FighterState.LIGHT_KICK]: {
				attackType: FighterAttackType.KICK,
				attackStrength: FighterAttackStrength.LIGHT,
				init: this.handleAttackInit,
				update: this.handleLightPunch,
				validFrom: [
					FighterState.IDLE,
					FighterState.WALK_FORWARD,
					FighterState.WALK_BACKWARD,
				],
			},
			[FighterState.MEDIUM_KICK]: {
				attackType: FighterAttackType.KICK,
				attackStrength: FighterAttackStrength.MEDIUM,
				init: this.handleAttackInit,
				update: this.handleMedPunch,
				validFrom: [
					FighterState.IDLE,
					FighterState.WALK_FORWARD,
					FighterState.WALK_BACKWARD,
				],
			},
			[FighterState.HEAVY_KICK]: {
				attackType: FighterAttackType.KICK,
				attackStrength: FighterAttackStrength.HEAVY,
				init: this.handleAttackInit,
				update: this.handleHeavyPunch,
				validFrom: [
					FighterState.IDLE,
					FighterState.WALK_FORWARD,
					FighterState.WALK_BACKWARD,
				],
			},
		};
		this.currentState = FighterState.IDLE;
	}

	hasCollidedWithOpponent = () =>
		rectsOverlap(
			this.position.x + this.boxes.push.pushX,
			this.position.y + this.boxes.push.pushY,
			this.boxes.push.pushWidth,
			this.boxes.push.pushHeight,
			this.opponent.position.x + this.opponent.boxes.push.pushX,
			this.opponent.position.y + this.opponent.boxes.push.pushY,
			this.opponent.boxes.push.pushWidth,
			this.opponent.boxes.push.pushHeight
		);

	getDirection = () => {
		if (
			this.position.x + this.boxes.push.pushX + this.boxes.push.pushWidth >=
			this.opponent.position.x +
				this.opponent.boxes.push.pushX +
				this.opponent.boxes.push.pushWidth
		) {
			return FighterDirection.LEFT;
		} else if (
			this.position.x + this.boxes.push.pushX <=
			this.opponent.position.x +
				this.opponent.boxes.push.pushX +
				this.opponent.boxes.push.pushWidth
		) {
			return FighterDirection.RIGHT;
		}

		return this.direction;
	};

	getBoxes = (frameKey) => {
		const [
			,
			[pushX, pushY, pushWidth, pushHeight] = [0, 0, 0, 0],
			[head, body, legs] = [
				[0, 0, 0, 0],
				[0, 0, 0, 0],
				[0, 0, 0, 0],
			],
			[hitX, hitY, hitWidth, hitHeight] = [0, 0, 0, 0],
		] = this.frames.get(frameKey);

		return {
			push: { pushX, pushY, pushWidth, pushHeight },
			hurt: [head, body, legs],
			hit: { x: hitX, y: hitY, width: hitWidth, height: hitHeight },
		};
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
			console.log(`Illegal move from ${this.currentState} to ${newState}`);
			return;
		}
		this.currentState = newState;
		this.animationFrame = 0;
		this.states[this.currentState].init();
	};

	updateStageConstraints = (time, context, camera) => {
		// Right Boundary
		if (
			this.position.x - camera.position.x + this.boxes.push.pushWidth >=
			SCENE_WIDTH
		) {
			this.position.x =
				camera.position.x + SCENE_WIDTH - this.boxes.push.pushWidth;
			// if (
			// 	[
			// 		// FighterState.IDLE,
			// 		FighterState.WALK_BACKWARD,
			// 		FighterState.WALK_FORWARD,
			// 		FighterState.JUMP_FORWARD,
			// 		FighterState.JUMP_BACKWARD,
			// 	].includes(this.currentState) &&
			// 	camera.position.x <= 700  &&
			// 	this.opponent.position.x >
			// 		camera.position.x + this.opponent.boxes.push.pushWidth
			// ) {
			// 	camera.position.x += camera.speed * time.secondsPassed;
			// }
		}

		// Left Boundary
		if (this.position.x - camera.position.x - this.boxes.push.pushWidth <= 0) {
			this.position.x = camera.position.x + this.boxes.push.pushWidth + 1;
			// if (
			// 	[
			// 		// FighterState.IDLE,
			// 		FighterState.WALK_BACKWARD,
			// 		FighterState.WALK_FORWARD,
			// 		FighterState.JUMP_FORWARD,
			// 		FighterState.JUMP_BACKWARD,
			// 	].includes(this.currentState) &&
			// 	camera.position.x > STAGE_PADDING &&
			// 	this.opponent.position.x - camera.position.x <
			// 		context.canvas.width - this.opponent.boxes.push.pushWidth
			// ) {
			// 	camera.position.x -= camera.speed * time.secondsPassed;
			// }
		}

		if (this.hasCollidedWithOpponent()) {
			if (this.position.x <= this.opponent.position.x) {
				this.position.x = Math.max(
					this.opponent.position.x +
						this.opponent.boxes.push.pushX -
						(this.boxes.push.pushX + this.boxes.push.pushWidth),
					this.boxes.push.pushWidth - 1
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
					camera.position.x + SCENE_WIDTH - this.boxes.push.pushWidth,
					this.opponent.position.x + this.opponent.boxes.push.pushWidth
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
		this.velocity = { x: 0, y: 0 };
	};

	handleIdleInit = () => {
		this.resetVelocities();
		this.attackStruck = false;
	};

	handleIdle = () => {
		if (control.isUp(this.playerId, this.direction))
			this.changeState(FighterState.JUMP_START);
		else if (control.isDown(this.playerId))
			this.changeState(FighterState.CROUCH_DOWN);
		else if (control.isForward(this.playerId, this.direction))
			this.changeState(FighterState.WALK_FORWARD);
		else if (control.isBackward(this.playerId, this.direction))
			this.changeState(FighterState.WALK_BACKWARD);
		else if (control.isLightPunch(this.playerId))
			this.changeState(FighterState.LIGHT_PUNCH);
		else if (control.isMediumPunch(this.playerId))
			this.changeState(FighterState.MEDIUM_PUNCH);
		else if (control.isHeavyPunch(this.playerId))
			this.changeState(FighterState.HEAVY_PUNCH);
		else if (control.isLightKick(this.playerId))
			this.changeState(FighterState.LIGHT_KICK);
		else if (control.isMediumKick(this.playerId))
			this.changeState(FighterState.MEDIUM_KICK);
		else if (control.isHeavyKick(this.playerId))
			this.changeState(FighterState.HEAVY_KICK);

		const newDirection = this.getDirection();

		if (newDirection !== this.direction) {
			this.direction = newDirection;
			this.changeState(FighterState.IDLE_TURN);
		}
	};

	handleWalkForward = () => {
		if (!control.isForward(this.playerId, this.direction))
			this.changeState(FighterState.IDLE);
		else if (control.isUp(this.playerId))
			this.changeState(FighterState.JUMP_FORWARD);
		else if (control.isDown(this.playerId))
			this.changeState(FighterState.CROUCH_DOWN);
		else if (control.isLightPunch(this.playerId))
			this.changeState(FighterState.LIGHT_PUNCH);
		else if (control.isMediumPunch(this.playerId))
			this.changeState(FighterState.MEDIUM_PUNCH);
		else if (control.isHeavyPunch(this.playerId))
			this.changeState(FighterState.HEAVY_PUNCH);
		else if (control.isLightKick(this.playerId))
			this.changeState(FighterState.LIGHT_KICK);
		else if (control.isMediumKick(this.playerId))
			this.changeState(FighterState.MEDIUM_KICK);
		else if (control.isHeavyKick(this.playerId))
			this.changeState(FighterState.HEAVY_KICK);
	};

	hanldeWalkBackward = () => {
		if (!control.isBackward(this.playerId, this.direction))
			this.changeState(FighterState.IDLE);
		else if (control.isUp(this.playerId))
			this.changeState(FighterState.JUMP_BACKWARD);
		else if (control.isDown(this.playerId))
			this.changeState(FighterState.CROUCH_DOWN);
		else if (control.isLightPunch(this.playerId))
			this.changeState(FighterState.LIGHT_PUNCH);
		else if (control.isMediumPunch(this.playerId))
			this.changeState(FighterState.MEDIUM_PUNCH);
		else if (control.isHeavyPunch(this.playerId))
			this.changeState(FighterState.HEAVY_PUNCH);
		else if (control.isLightKick(this.playerId))
			this.changeState(FighterState.LIGHT_KICK);
		else if (control.isMediumKick(this.playerId))
			this.changeState(FighterState.MEDIUM_KICK);
		else if (control.isHeavyKick(this.playerId))
			this.changeState(FighterState.HEAVY_KICK);
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
		playSound(this.soundLand);
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

	handleAttackInit = () => {
		this.resetVelocities();
		playSound(this.soundAttacks[this.states[this.currentState].attackStrength]);
	};

	handleLightAttackReset = () => {
		this.animationFrame = 0;
		this.attackStruck = false;
		this.handleAttackInit();
	};

	handleLightPunch = () => {
		if (this.animationFrame < 2) return;
		if (control.isLightPunch(this.playerId)) this.handleLightAttackReset();
		if (!this.isAnimationCompleted()) return;
		this.changeState(FighterState.IDLE);
	};

	handleMedPunch = () => {
		if (this.isAnimationCompleted()) {
			this.changeState(FighterState.IDLE);
		}
	};

	handleHeavyPunch = () => {
		if (this.isAnimationCompleted()) {
			this.changeState(FighterState.IDLE);
		}
	};

	handleLightKick = () => {
		if (this.animationFrame < 2) return;
		if (control.isLightKick(this.playerId)) this.handleLightAttackReset();
		if (!this.isAnimationCompleted()) return;
		this.changeState(FighterState.IDLE);
	};

	handleMedKick = () => {
		if (this.isAnimationCompleted()) {
			this.changeState(FighterState.IDLE);
		}
	};

	handleHeavyKick = () => {
		if (this.isAnimationCompleted()) {
			this.changeState(FighterState.IDLE);
		}
	};

	updateAnimation = (time) => {
		const animation = this.animations[this.currentState];
		const [, frameDelay] = animation[this.animationFrame];
		if (time.previous <= this.animationTime + frameDelay * FRAME_TIME) return;
		this.animationTime = time.previous;

		if (frameDelay <= FrameDelay.FREEZE) return;

		this.animationFrame++;
		if (this.animationFrame >= animation.length) this.animationFrame = 0;

		this.boxes = this.getBoxes(animation[this.animationFrame][0]);
	};

	updateAttackBoxCollided = (time) => {
		if (!this.states[this.currentState].attackType || this.attackStruck) return;

		const actualHitBox = getActualBoxDimensions(
			this.position,
			this.direction,
			this.boxes.hit
		);

		this.opponent.boxes.hurt.map((hurt, index) => {
			if (this.attackStruck) return;
			const [x, y, width, height] = hurt;
			const actualOpponentHurtBox = getActualBoxDimensions(
				this.opponent.position,
				this.opponent.direction,
				{ x, y, width, height }
			);

			if (!boxOverlap(actualHitBox, actualOpponentHurtBox)) return;

			const { attackStrength, attackType } = this.states[this.currentState];
			this.attackStruck = true;

			stopSound(this.soundAttacks[attackStrength]);
			playSound(this.soundHits[attackStrength][attackType]);

			const hitPosition = {
				x:
					(actualHitBox.x +
						actualHitBox.width / 2 +
						actualOpponentHurtBox.x +
						actualOpponentHurtBox.width / 2) /
					2,
				y:
					(actualHitBox.y +
						actualOpponentHurtBox.y +
						actualHitBox.height / 2 +
						actualOpponentHurtBox.width / 2) /
					2,
			};

			hitPosition.x += 4 - Math.random() * HIT_SPLASH_RANDOMNESS;
			hitPosition.y += 4 - Math.random() * HIT_SPLASH_RANDOMNESS;

			this.handleAttackHit(
				this.playerId,
				this.opponent.playerId,
				hitPosition,
				attackStrength
			);
		});
	};

	update = (time, context, camera) => {
		this.position.x += this.velocity.x * this.direction * time.secondsPassed;
		this.position.y += this.velocity.y * time.secondsPassed;
		this.states[this.currentState].update(time, context);
		this.updateAnimation(time);
		this.updateStageConstraints(time, context, camera);
		this.updateAttackBoxCollided(time);
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
		DRAW_DEBUG && DEBUG_drawCollisionInfo(this, context, camera);
	};
}
