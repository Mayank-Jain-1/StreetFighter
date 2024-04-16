import { controls } from '../config/controls.js';
import {
	SpecialMovesControls,
	POLLING_DELAY,
	MINIMUM_REPOLL_TIME,
} from '../constants/controls.js';
import { FighterState } from '../constants/fighter.js';
import * as control from './InputHandler.js';

export class ControlHistory {
	historyTimerCap = 2000;
	history = [];
	historyTimer = 0;

	controlToButton = [
		[control.isLightPunch, SpecialMovesControls.LIGHT_PUNCH],
		[control.isMediumPunch, SpecialMovesControls.MEDIUM_PUNCH],
		[control.isHeavyPunch, SpecialMovesControls.HEAVY_PUNCH],
		[control.isLightKick, SpecialMovesControls.LIGHT_KICK],
		[control.isMediumKick, SpecialMovesControls.MEDIUM_KICK],
		[control.isHeavyKick, SpecialMovesControls.HEAVY_KICK],
	];

	constructor(fighter) {
		this.fighter = fighter;
		this.playerId = fighter.playerId;
	}

	getMove = () => {
		if (control.isForward(this.playerId, this.fighter.direction)) {
			if (control.isUp(this.playerId, this.fighter.direction))
				return SpecialMovesControls.FORWARD_UP;
			else if (control.isDown(this.playerId, this.fighter.direction))
				return SpecialMovesControls.FORWARD_DOWN;
			return SpecialMovesControls.FORWARD;
		} else if (control.isBackward(this.playerId, this.fighter.direction)) {
			if (control.isUp(this.playerId, this.fighter.direction))
				return SpecialMovesControls.BACKWARD_UP;
			else if (control.isDown(this.playerId, this.fighter.direction))
				return SpecialMovesControls.BACKWARD_DOWN;
			return SpecialMovesControls.BACKWARD;
		} else if (control.isUp(this.playerId, this.fighter.direction))
			return SpecialMovesControls.UP;
		else if (control.isDown(this.playerId, this.fighter.direction))
			return SpecialMovesControls.DOWN;
		else if (control.isLightPunch(this.playerId, this.fighter.direction))
			return SpecialMovesControls.LIGHT_PUNCH;
		else if (control.isMediumPunch(this.playerId, this.fighter.direction))
			return SpecialMovesControls.MEDIUM_PUNCH;
		else return null;
	};

	getButton = () => {
		for (const [isButton, buttonName] of this.controlToButton) {
			if (isButton(this.playerId, true)) {
				return buttonName;
			}
		}
		return false;
	};

	isValidAddition = (control, time) => {
		if (this.history.length === 0 || this.history[0][0] !== control)
			return true;
		if (time.previous - this.history[0][1] > MINIMUM_REPOLL_TIME) return true;
		return false;
	};

	handleAdd = (time) => {
		if (this.historyTimer > time.previous) return;
		this.historyTimer = time.previous + POLLING_DELAY;

		const button = this.getButton();
		const move = this.getMove();

		if (button && this.isValidAddition(button, time)) {
			this.history.unshift([button, time.previous]);
			this.updateSpecialMoveSequences(time);
		}

		if (move && this.isValidAddition(move, time)) {
			this.history.unshift([move, time.previous]);
			this.updateSpecialMoveSequences(time);
		}
	};

	handleRemove = (time) => {
		for (let i = this.history.length - 1; i >= 0; i--) {
			if (this.history[i][1] <= time.previous - this.historyTimerCap) {
				this.history.splice(i, 1);
			} else {
				return;
			}
		}
		if (this.history.length === 0) this.resetCursors();
	};

	print() {
		let historyWithNamesOnly = [];
		for (const [name] of this.history) historyWithNamesOnly.push(name);
		console.log(historyWithNamesOnly);
	}

	// older version which work with 	specialMoveSequence = {
	// 	[FighterState.SPECIAL_1_LIGHT]: [
	// 		SpecialMovesControls.DOWN,
	// 		SpecialMovesControls.FORWARD_DOWN,
	// 		SpecialMovesControls.FORWARD,
	// 		SpecialMovesControls.LIGHT_PUNCH,
	// 	],
	// 	[FighterState.SPECIAL_1_MEDIUM]: [
	// 		SpecialMovesControls.DOWN,
	// 		SpecialMovesControls.FORWARD_DOWN,
	// 		SpecialMovesControls.FORWARD,
	// 		SpecialMovesControls.MEDIUM_PUNCH,
	// 	],
	// 	[FighterState.SPECIAL_1_HEAVY]: [
	// 		SpecialMovesControls.DOWN,
	// 		SpecialMovesControls.FORWARD_DOWN,
	// 		SpecialMovesControls.FORWARD,
	// 		SpecialMovesControls.HEAVY_PUNCH,
	// 	],
	// };

	// NOT Used
	OLD_VERSION_TO_CHECK_SEQUENCE = () => {
		checkSequences = (time) => {
			for (const [state, sequence] of Object.entries(
				this.fighter.specialMoveSequence
			)) {
				if (this.isMoveSequenceMade(state)) {
					this.fighter.changeState(state, time);
				}
			}
		};
		matchMovesinArrays = (sequence, history) => {
			if (history.length < sequence.length) return false;
			for (let i = 0; i < sequence.length; i++) {
				if (history[i][0] !== sequence[i]) return false;
			}
			this.history = [];
			return true;
		};
		isMoveSequenceMade = (fighterState) => {
			const sequence = this.fighter.specialMoveSequence[fighterState]
				.slice()
				.reverse();

			return (
				this.matchMovesinArrays(sequence, this.history) ||
				this.matchMovesinArrays(sequence, this.history.slice(1)) ||
				this.matchMovesinArrays(sequence, this.history.slice(2)) ||
				this.matchMovesinArrays(sequence, this.history.slice(3))
			);
		};
	};

	resetCursors = () => {
		this.fighter.specialMoves.forEach((move) => {
			move.cursor = 0;
		});
	};

	checkSequence = (time, move) => {
		if (move.cursor === move.sequence.length) {
			this.fighter.changeState(move.state, time);
			move.cursor = 0;
		}
	};

	updateSpecialMoveSequences = (time) => {
		// this.print();
		this.fighter.specialMoves.forEach((move) => {
			if (this.history[0][0] === move.sequence[move.cursor]) {
				move.cursor++;
				this.checkSequence(time, move);
			} else move.cursor = 0;
		});
	};

	update = (time) => {
		this.handleAdd(time);
		this.handleRemove(time);
	};
}
