import { SCENE_WIDTH, STAGE_WIDTH } from '../../../constants/Stage.js';
import { FighterAttackType } from '../../../constants/fighter.js';
import {
	FireballState,
	fireballVelocity,
} from '../../../constants/fireball.js';
import { FRAME_TIME } from '../../../constants/game.js';
import {
	boxOverlap,
	getActualBoxDimensions,
} from '../../../utils/collisions.js';
import * as DEBUG from '../../../utils/fighterDebug.js';
import { Fighter } from '../Fighter.js';

export class Fireball {
	image = document.getElementById('KenImage');

	animationFrame = 0;
	animationTimer = 0;

	frames = new Map([
		[
			'hadouken-fireball-1',
			[
				[
					[400, 2756, 43, 32],
					[25, 16],
				],
				[-15, -13, 30, 24],
				[-28, -20, 56, 38],
			],
		],
		[
			'hadouken-fireball-2',
			[
				[
					[460, 2761, 56, 28],
					[37, 14],
				],
				[-15, -13, 30, 24],
				[-28, -20, 56, 38],
			],
		],
		[
			'hadouken-fireball-3',
			[
				[
					[0, 0, 0, 0],
					[0, 0],
				],
				[-15, -13, 30, 24],
				[-28, -20, 56, 38],
			],
		],
		[
			'hadouken-collide-1',
			[
				[
					[543, 2767, 26, 20],
					[13, 10],
				],
				[0, 0, 0, 0],
			],
		],
		[
			'hadouken-collide-2',
			[
				[
					[590, 2766, 15, 25],
					[9, 13],
				],
				[0, 0, 0, 0],
			],
		],
		[
			'hadouken-collide-3',
			[
				[
					[625, 2764, 28, 28],
					[26, 14],
				],
				[0, 0, 0, 0],
			],
		],
	]);

	animations = {
		[FireballState.ACTIVE]: [
			['hadouken-fireball-1', 5],
			['hadouken-fireball-3', 2],
			['hadouken-fireball-2', 5],
			['hadouken-fireball-3', 1],
		],
		[FireballState.COLLIDED]: [
			['hadouken-collide-1', 9],
			['hadouken-collide-1', 5],
			['hadouken-collide-3', 9],
		],
	};

	currentState = FireballState.ACTIVE;

	constructor(fighter, strength, time, onEnd) {
		this.fighter = fighter;
		this.direction = this.fighter.direction;
		this.strength = strength;
		this.velocity = fireballVelocity[strength];
		this.onEnd = onEnd;
		this.position = {
			x: this.fighter.position.x + 76 * this.direction,
			y: this.fighter.position.y - 57,
		};
		this.animationTimer = time.previous;
	}

	updateAnimation = (time) => {
		if (this.animationTimer > time.previous) return;

		this.animationFrame++;

		if (this.animationFrame >= this.animations[this.currentState].length) {
			this.animationFrame = 0;
			if (this.currentState === FireballState.COLLIDED) this.onEnd(this);
		}
		this.animationTimer =
			time.previous +
			this.animations[this.currentState][this.animationFrame][1] * FRAME_TIME;
	};

	updatePosition = (time, camera) => {
		this.position.x += this.velocity * this.direction * time.secondsPassed;
		if (
			this.position.x - camera.position.x >= SCENE_WIDTH + 56 ||
			this.position.x - camera.position.x <= -56
		) {
			this.onEnd(this);
		}

		if (this.currentState === FireballState.COLLIDED) return;
		const hasCollided = this.hasFireballCollided(time);
		if (!hasCollided) return;
		this.velocity /= 2;
		this.currentState = FireballState.COLLIDED;
		this.animationFrame = 0;
		this.animationTimer =
			time.previous +
			this.animations[this.currentState][this.animationFrame][1] * FRAME_TIME;
	};

	hasFireballCollided = (time) => {
		const [x, y, width, height] = this.frames.get(
			this.animations[this.currentState][this.animationFrame][0]
		)[1];

		const actualFireballDimensions = getActualBoxDimensions(
			this.position,
			this.direction,
			{ x, y, width, height }
		);

		for (const [hurtArea, dimensions] of Object.entries(
			this.fighter.opponent.boxes.hurt
		)) {
			const [x, y, width, height] = dimensions;
			const actualHurtDimensions = getActualBoxDimensions(
				this.fighter.opponent.position,
				this.fighter.opponent.direction,
				{ x, y, width, height }
			);
			if (boxOverlap(actualFireballDimensions, actualHurtDimensions)) {
				this.fighter.opponent.handleAttackHit(
					time,
					this.strength,
					hurtArea,
					FighterAttackType.PUNCH,
					undefined
				);
				return true;
			}
		}

		return false;
	};

	update = (time, camera) => {
		this.updateAnimation(time);
		this.updatePosition(time, camera);
		// this.hasFireballCollided(time);
	};

	drawFireball = (context, camera) => {
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
			Math.floor(this.position.x - camera.position.x) * this.direction -
				originX,
			Math.floor(this.position.y - camera.position.y) - originY,
			width,
			height
		);

		context.setTransform(1, 0, 0, 1, 0, 0);
	};

	draw = (context, camera) => {
		this.drawFireball(context, camera);

		// DEBUG.drawDebugBox(
		// 	context,
		// 	camera,
		// 	this.position,
		// 	this.direction,
		// 	this.frames.get(
		// 		this.animations[this.currentState][this.animationFrame][0]
		// 	)[1],
		// 	'#2222ff'
		// );
	};
}
