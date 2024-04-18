import { FighterId } from './fighter.js';

export const soundAttackIds = {
	LIGHT: 'sound-fighter-light-attack',
	MEDIUM: 'sound-fighter-medium-attack',
	HEAVY: 'sound-fighter-heavy-attack',
};

export const soundHadoukenId = {
	[FighterId.KEN]: 'sound-ken-hadouken',
	[FighterId.RYU]: 'sound-ryu-hadouken',
};

export const soundLandId = 'sound-fighter-land';

export const soundHitIds = {
	LIGHT: {
		PUNCH: 'sound-fighter-light-punch-hit',
		KICK: 'sound-fighter-light-kick-hit',
	},
	MEDIUM: {
		PUNCH: 'sound-fighter-medium-punch-hit',
		KICK: 'sound-fighter-medium-kick-hit',
	},
	HEAVY: {
		PUNCH: 'sound-fighter-heavy-punch-hit',
		KICK: 'sound-fighter-heavy-kick-hit',
	},
};

export const GLOBAL_VOLUME = 0.7;
