import { FighterAttackStrength } from './fighter.js';

export const fireballVelocity = {
	[FighterAttackStrength.LIGHT]: 150,
	[FighterAttackStrength.MEDIUM]: 220,
	[FighterAttackStrength.HEAVY]: 300,
};

export const FireballCollisionType = {
	OPPONENT: 'opponent',
	FIREBALL: 'fireball',
};

export const FireballState = {
	ACTIVE: 'active',
	COLLIDED: 'collided',
};
