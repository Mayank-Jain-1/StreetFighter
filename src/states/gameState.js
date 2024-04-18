import { FighterId } from '../constants/fighter.js';
import { createDefaultFighterState } from './fighterState.js';

export var gameState = {
	fighters: [
		createDefaultFighterState(FighterId.RYU),
		createDefaultFighterState(FighterId.KEN),
	],
};

export const resetGameState = () => {
	gameState = {
		fighters: [
			createDefaultFighterState(FighterId.RYU),
			createDefaultFighterState(FighterId.KEN),
		],
	};
};
