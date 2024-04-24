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
	FIGHTER_PUSH_FRICTION,
	FighterAttackBaseData,
	FighterAttackStrength,
	FighterHurtStates,
	FighterHurtArea,
	FighterStruckDelay,
	FIGHTER_DEFAULT_WIDTH,
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
import { ControlHistory } from '../../engine/ControlHistory.js';

// [Done] TODO Convert hurt: [[], [], []] to {head:[], body:[], legs:[],}
// [FIXED]: handleHadoukenInit was being called in Fighter Idle.init TODO BUG: find what makes the hadouken sound call out of noWhere - happens when hitting and after atleast once the Hadouken is thrown

// [Found not fixed] !!TODO One of the fighters randomly stops registering hits - Happens because illegal hurtState - from jumping to hurtHeadBody- jugaad by changing attackStruck in handleIdle

//[FIXED] this.opponent.attackStruck = false was missing in handleHeadBodyHit TODO: if fighters move into each other for some time they wont take hits.

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
	animationTimer = 0;
	animations = {};

	slideVelocity = 0;
	slideFriction = 0;

	attackStruckDelay = 0;

	hurtShakeTimer = 0;
	hurtShake = 0;

	victory = false;

	opponent = undefined;
	boxes = {
		push: { pushX: 0, pushY: 0, pushWidth: 0, pushHeight: 0 },
		hurt: {
			[FighterHurtArea.HEAD]: [0, 0, 0, 0],
			[FighterHurtArea.BODY]: [0, 0, 0, 0],
			[FighterHurtArea.LEGS]: [0, 0, 0, 0],
		},
		hit: { x: 0, y: 0, width: 0, height: 0 },
	};

	currentState = FighterState.IDLE;

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

	specialMoves = null;

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

	constructor(playerId, onAttackHit, entityList) {
		this.playerId = playerId;
		this.onAttackHit = onAttackHit;
		this.entityList = entityList;
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
					FighterState.HURT_HEAD_LIGHT,
					FighterState.HURT_HEAD_HEAVY,
					FighterState.HURT_HEAD_MEDIUM,
					FighterState.HURT_BODY_LIGHT,
					FighterState.HURT_BODY_MEDIUM,
					FighterState.HURT_BODY_HEAVY,
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
				update: this.handleWalkBackward,
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
			[FighterState.HURT_HEAD_LIGHT]: {
				init: this.handleAttackHitInit,
				update: this.handleHeadBodyHit,
				validFrom: FighterHurtStates,
			},
			[FighterState.HURT_HEAD_MEDIUM]: {
				init: this.handleAttackHitInit,
				update: this.handleHeadBodyHit,
				validFrom: FighterHurtStates,
			},
			[FighterState.HURT_HEAD_HEAVY]: {
				init: this.handleAttackHitInit,
				update: this.handleHeadBodyHit,
				validFrom: FighterHurtStates,
			},
			[FighterState.HURT_BODY_LIGHT]: {
				init: this.handleAttackHitInit,
				update: this.handleHeadBodyHit,
				validFrom: FighterHurtStates,
			},
			[FighterState.HURT_BODY_MEDIUM]: {
				init: this.handleAttackHitInit,
				update: this.handleHeadBodyHit,
				validFrom: FighterHurtStates,
			},
			[FighterState.HURT_BODY_HEAVY]: {
				init: this.handleAttackHitInit,
				update: this.handleHeadBodyHit,
				validFrom: FighterHurtStates,
			},
			[FighterState.VICTORY]: {
				init: this.resetVelocities,
				update: () => {},
				validFrom: Object.values(FighterState),
			},
			[FighterState.KO]: {
				init: this.resetVelocities,
				update: this.handleFallBack,
				shadow: [2.4, 1, 0, 0],
				validFrom: Object.values(FighterState),
			},
		};
		this.controlHistory = new ControlHistory(this);
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
			hurt: {
				[FighterHurtArea.HEAD]: head,
				[FighterHurtArea.BODY]: body,
				[FighterHurtArea.LEGS]: legs,
			},
			hit: { x: hitX, y: hitY, width: hitWidth, height: hitHeight },
		};
	};
	isAnimationCompleted = () => {
		return (
			this.animations[this.currentState][this.animationFrame][1] ===
			FrameDelay.TRANSITION
		);
	};

	changeState = (newState, time) => {
		if (!this.states[newState].validFrom.includes(this.currentState)) {
			console.log(`Illegal move from ${this.currentState} to ${newState}`);
			return;
		}
		this.currentState = newState;
		this.setAnimationFrame(0, time);
		this.states[this.currentState].init(time);
	};

	updateStageConstraints = (time, camera) => {
		const fightersDistance = Math.abs(
			this.position.x - this.opponent.position.x
		);

		// Right Boundary
		if (
			this.position.x - camera.position.x + FIGHTER_DEFAULT_WIDTH >
			SCENE_WIDTH
		) {
			this.position.x = camera.position.x + SCENE_WIDTH - FIGHTER_DEFAULT_WIDTH;
			fightersDistance < 150 && this.resetSlide(true);
		}
		// Left Boundary
		else if (this.position.x - camera.position.x - FIGHTER_DEFAULT_WIDTH < 0) {
			this.position.x = camera.position.x + FIGHTER_DEFAULT_WIDTH;
			fightersDistance < 150 && this.resetSlide(true);
		}

		if (this.hasCollidedWithOpponent()) {
			if (this.position.x < this.opponent.position.x) {
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
					this.opponent.position.x +=
						FIGHTER_PUSH_FRICTION * time.secondsPassed;
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
					this.opponent.position.x -=
						FIGHTER_PUSH_FRICTION * time.secondsPassed;
				}
			}
		}
	};

	resetVelocities = () => {
		this.velocity = { x: 0, y: 0 };
	};

	handleIdleInit = () => {
		this.resetVelocities();
		this.opponent.attackStruck = false;
	};

	handleIdle = (time) => {
		if (this.victory) {
			this.changeState(FighterState.VICTORY, time);
			return;
		}
		if (control.isUp(this.playerId, this.direction))
			this.changeState(FighterState.JUMP_START, time);
		else if (control.isDown(this.playerId))
			this.changeState(FighterState.CROUCH_DOWN, time);
		else if (control.isForward(this.playerId, this.direction))
			this.changeState(FighterState.WALK_FORWARD, time);
		else if (control.isBackward(this.playerId, this.direction))
			this.changeState(FighterState.WALK_BACKWARD, time);
		else if (control.isLightPunch(this.playerId))
			this.changeState(FighterState.LIGHT_PUNCH, time);
		else if (control.isMediumPunch(this.playerId))
			this.changeState(FighterState.MEDIUM_PUNCH, time);
		else if (control.isHeavyPunch(this.playerId))
			this.changeState(FighterState.HEAVY_PUNCH, time);
		else if (control.isLightKick(this.playerId))
			this.changeState(FighterState.LIGHT_KICK, time);
		else if (control.isMediumKick(this.playerId))
			this.changeState(FighterState.MEDIUM_KICK, time);
		else if (control.isHeavyKick(this.playerId))
			this.changeState(FighterState.HEAVY_KICK, time);

		const newDirection = this.getDirection();

		if (newDirection !== this.direction) {
			this.direction = newDirection;
			this.changeState(FighterState.IDLE_TURN, time);
		}
	};

	handleWalkForward = (time) => {
		if (!control.isForward(this.playerId, this.direction))
			this.changeState(FighterState.IDLE, time);
		else if (control.isUp(this.playerId))
			this.changeState(FighterState.JUMP_FORWARD, time);
		else if (control.isDown(this.playerId))
			this.changeState(FighterState.CROUCH_DOWN, time);
		else if (control.isLightPunch(this.playerId))
			this.changeState(FighterState.LIGHT_PUNCH, time);
		else if (control.isMediumPunch(this.playerId))
			this.changeState(FighterState.MEDIUM_PUNCH, time);
		else if (control.isHeavyPunch(this.playerId))
			this.changeState(FighterState.HEAVY_PUNCH, time);
		else if (control.isLightKick(this.playerId))
			this.changeState(FighterState.LIGHT_KICK, time);
		else if (control.isMediumKick(this.playerId))
			this.changeState(FighterState.MEDIUM_KICK, time);
		else if (control.isHeavyKick(this.playerId))
			this.changeState(FighterState.HEAVY_KICK, time);
	};

	handleWalkBackward = (time) => {
		if (!control.isBackward(this.playerId, this.direction))
			this.changeState(FighterState.IDLE, time);
		else if (control.isUp(this.playerId))
			this.changeState(FighterState.JUMP_BACKWARD, time);
		else if (control.isDown(this.playerId))
			this.changeState(FighterState.CROUCH_DOWN, time);
		else if (control.isLightPunch(this.playerId))
			this.changeState(FighterState.LIGHT_PUNCH, time);
		else if (control.isMediumPunch(this.playerId))
			this.changeState(FighterState.MEDIUM_PUNCH, time);
		else if (control.isHeavyPunch(this.playerId))
			this.changeState(FighterState.HEAVY_PUNCH, time);
		else if (control.isLightKick(this.playerId))
			this.changeState(FighterState.LIGHT_KICK, time);
		else if (control.isMediumKick(this.playerId))
			this.changeState(FighterState.MEDIUM_KICK, time);
		else if (control.isHeavyKick(this.playerId))
			this.changeState(FighterState.HEAVY_KICK, time);
	};

	handleCrouchDownUpdate = (time) => {
		if (this.isAnimationCompleted()) {
			this.changeState(FighterState.CROUCH, time);
		}
		if (!control.isDown(this.playerId)) {
			this.currentState = FighterState.CROUCH_UP;
			this.setAnimationFrame(
				Math.max(
					0,
					this.animations[FighterState.CROUCH_UP][this.animationFrame].length -
						this.animationFrame
				),
				time
			);
		}
	};

	handleCrouch = (time) => {
		!control.isDown(this.playerId) &&
			this.changeState(FighterState.CROUCH_UP, time);

		const newDirection = this.getDirection();
		if (newDirection !== this.direction) {
			this.direction = newDirection;
			this.changeState(FighterState.CROUCH_TURN, time);
		}
	};

	handleCrouchUpUpdate = (time) => {
		if (this.isAnimationCompleted()) {
			this.changeState(FighterState.IDLE, time);
		}
	};

	handleCrouchTurn = (time) => {
		if (this.isAnimationCompleted()) {
			this.changeState(FighterState.CROUCH, time);
		}
	};

	handleMoveInit = () => {
		this.velocity.x = this.initialVelocity.x[this.currentState] ?? 0;
	};

	handleJumpStartState = (time) => {
		if (this.isAnimationCompleted()) {
			if (control.isBackward(this.playerId, this.direction))
				this.changeState(FighterState.JUMP_BACKWARD, time);
			else if (control.isForward(this.playerId, this.direction))
				this.changeState(FighterState.JUMP_FORWARD, time);
			else this.changeState(FighterState.JUMP_UP, time);
		}
	};

	handleJumpLandState = (time) => {
		if (this.animationFrame == 0) {
			playSound(this.soundLand);
			return;
		}
		this.handleIdle(time);
		if (this.isAnimationCompleted()) this.changeState(FighterState.IDLE, time);
	};

	handleJumpInit = () => {
		this.velocity.y = this.initialVelocity.jump;
		this.handleMoveInit();
	};
	handleJump = (time) => {
		this.velocity.y += time.secondsPassed * this.gravity;
		if (this.position.y > STAGE_FLOOR) {
			this.position.y = STAGE_FLOOR;
			this.changeState(FighterState.JUMP_LAND, time);
		}
	};

	handleIdleTurnState = (time) => {
		if (this.isAnimationCompleted()) {
			this.changeState(FighterState.IDLE, time);
		}
	};

	handleAttackInit = (time) => {
		this.resetVelocities();
		playSound(this.soundAttacks[this.states[this.currentState].attackStrength]);
	};

	handleLightAttackReset = (time) => {
		this.setAnimationFrame(0, time);
		this.attackStruck = false;
		this.handleAttackInit();
	};

	handleLightPunch = (time) => {
		if (this.animationFrame < 2) return;
		if (control.isLightPunch(this.playerId)) this.handleLightAttackReset(time);
		if (!this.isAnimationCompleted()) return;
		this.changeState(FighterState.IDLE, time);
	};
	handleAttackHitInit = (time) => {
		this.resetVelocities();
		this.hurtShake = 2;
		this.hurtShakeTimer = time.previous;
	};

	getAttackHurtState = (attackStrength, hurtArea) => {
		switch (hurtArea) {
			case FighterHurtArea.HEAD:
				switch (attackStrength) {
					case FighterAttackStrength.LIGHT:
						return FighterState.HURT_HEAD_LIGHT;
					case FighterAttackStrength.MEDIUM:
						return FighterState.HURT_HEAD_MEDIUM;
					case FighterAttackStrength.HEAVY:
						return FighterState.HURT_HEAD_HEAVY;
					default:
						break;
				}
				break;
			case FighterHurtArea.BODY:
				switch (attackStrength) {
					case FighterAttackStrength.LIGHT:
						return FighterState.HURT_BODY_LIGHT;
					case FighterAttackStrength.MEDIUM:
						return FighterState.HURT_BODY_MEDIUM;
					case FighterAttackStrength.HEAVY:
						return FighterState.HURT_BODY_HEAVY;
					default:
						break;
				}
				break;
			default:
				switch (attackStrength) {
					case FighterAttackStrength.LIGHT:
						return FighterState.HURT_HEAD_LIGHT;
					case FighterAttackStrength.MEDIUM:
						return FighterState.HURT_HEAD_MEDIUM;
					case FighterAttackStrength.HEAVY:
						return FighterState.HURT_HEAD_HEAVY;
					default:
						break;
				}
				break;
		}
	};

	handleAttackHit = (
		time,
		attackStrength,
		hurtArea,
		attackType,
		hitPosition
	) => {
		const newState = this.getAttackHurtState(attackStrength, hurtArea);
		this.slideVelocity = FighterAttackBaseData[attackStrength].slide.velocity;
		this.slideFriction = FighterAttackBaseData[attackStrength].slide.friction;

		playSound(this.soundHits[attackStrength][attackType]);
		this.opponent.attackStruck = true;
		this.onAttackHit(
			time,
			this.opponent.playerId,
			this.playerId,
			hitPosition,
			attackStrength
		);

		this.changeState(newState, time);
	};

	handleHeadBodyHit = (time) => {
		if (!this.isAnimationCompleted()) return;
		this.hurtShake = 0;
		this.hurtShakeTimer = 0;
		this.opponent.attackStruck = false;
		this.changeState(FighterState.IDLE, time);
	};

	handleFallBack = (time) => {
		if (this.animationFrame === 2 && this.position.y >= STAGE_FLOOR) {
			this.animationFrame++;
			this.velocity.y = 0;
			this.position.y = STAGE_FLOOR;
		} else if (this.animationFrame === 2) this.velocity.y = 120;
		if (!this.isAnimationCompleted()) return;
		this.hurtShake = 0;
		this.hurtShakeTimer = 0;
		this.opponent.attackStruck = false;
		this.changeState(FighterState.IDLE, time);
	};

	handleMedPunch = (time) => {
		if (this.isAnimationCompleted()) {
			this.changeState(FighterState.IDLE, time);
		}
	};

	handleHeavyPunch = (time) => {
		if (this.isAnimationCompleted()) {
			this.changeState(FighterState.IDLE, time);
		}
	};

	handleLightKick = (time) => {
		if (this.animationFrame < 2) return;
		if (control.isLightKick(this.playerId)) this.handleLightAttackReset(time);
		if (!this.isAnimationCompleted()) return;
		this.changeState(FighterState.IDLE, time);
	};

	handleMedKick = (time) => {
		if (this.isAnimationCompleted()) {
			this.changeState(FighterState.IDLE, time);
		}
	};

	handleHeavyKick = (time) => {
		if (this.isAnimationCompleted()) {
			this.changeState(FighterState.IDLE, time);
		}
	};

	setAnimationFrame = (animationFrame, time) => {
		const animation = this.animations[this.currentState];
		this.animationFrame = animationFrame;
		if (this.animationFrame >= animation.length) this.animationFrame = 0;

		const [frameKey, frameDelay] = animation[this.animationFrame];
		this.boxes = this.getBoxes(frameKey);
		this.animationTimer = time.previous + frameDelay * FRAME_TIME;
	};

	updateAnimation = (time) => {
		const animation = this.animations[this.currentState];
		if (
			animation[this.animationFrame][1] <= FrameDelay.FREEZE ||
			time.previous <= this.animationTimer
		)
			return;
		this.setAnimationFrame(this.animationFrame + 1, time);
	};

	updateAttackBoxCollided = (time) => {
		if (!this.states[this.currentState].attackType || this.attackStruck) return;

		const actualHitBox = getActualBoxDimensions(
			this.position,
			this.direction,
			this.boxes.hit
		);

		for (const [hurtArea, hurtBox] of Object.entries(
			this.opponent.boxes.hurt
		)) {
			if (this.attackStruck) return;
			const [x, y, width, height] = hurtBox;
			const actualOpponentHurtBox = getActualBoxDimensions(
				this.opponent.position,
				this.opponent.direction,
				{ x, y, width, height }
			);

			if (!boxOverlap(actualHitBox, actualOpponentHurtBox)) return;

			const { attackStrength, attackType } = this.states[this.currentState];

			stopSound(this.soundAttacks[attackStrength]);

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

			this.opponent.handleAttackHit(
				time,
				attackStrength,
				hurtArea,
				attackType,
				hitPosition
			);
		}
	};

	updatePositions = (time) => {
		this.position.x +=
			(this.velocity.x - this.slideVelocity) *
			this.direction *
			time.secondsPassed;
		this.position.y += this.velocity.y * time.secondsPassed;
	};

	resetSlide = (transfer = false) => {
		if (transfer) {
			this.opponent.slideVelocity = this.slideVelocity;
			this.opponent.slideFriction = this.slideFriction;
		}
		this.slideVelocity = 0;
		this.slideFriction = 0;
	};

	updateSlide = (time) => {
		if (this.slideVelocity <= 0) {
			this.resetSlide();
			return;
		}
		this.slideVelocity =
			this.slideVelocity - this.slideFriction * time.secondsPassed;
	};

	updateHurtShake = (time, delay) => {
		if (
			this.hurtShakeTimer + FRAME_TIME < time.previous &&
			!this.attackStruck
		) {
			const shakeAmount =
				delay - time.previous >= (FighterStruckDelay * FRAME_TIME) / 2 ? 2 : 1;
			this.hurtShake = shakeAmount - this.hurtShake;
			this.hurtShakeTimer = time.previous;
		}
	};

	update = (time, camera) => {
		this.states[this.currentState].update(time);
		this.updatePositions(time);
		this.updateSlide(time);
		this.updateAnimation(time);
		this.updateStageConstraints(time, camera);
		this.updateAttackBoxCollided(time);
		this.controlHistory.update(time);
	};

	draw = (context, camera) => {
		const frameKey = this.animations[this.currentState][this.animationFrame][0];
		const [[[x, y, width, height], [originX, originY]]] =
			this.frames.get(frameKey);

		context.scale(this.direction, 1);

		context.drawImage(
			this.image,
			x - this.hurtShake,
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
