import { controls } from '../config/controls.js';
import { FighterControls, POLLING_DELAY } from '../constants/controls.js';
import { FighterState } from '../constants/fighter.js';
import * as control from './InputHandler.js';

export class ControlHistory {
	historyTimerCap = 2000;
	history = [];
	historyTimer = 0;

	controlToButton = [
		[control.isLightPunch, FighterControls.LIGHT_PUNCH],
		[control.isMediumPunch, FighterControls.MEDIUM_PUNCH],
		[control.isHeavyPunch, FighterControls.HEAVY_PUNCH],
		[control.isLightKick, FighterControls.LIGHT_KICK],
		[control.isMediumKick, FighterControls.MEDIUM_KICK],
		[control.isHeavyKick, FighterControls.HEAVY_KICK],
	];

	constructor(fighter) {
		this.fighter = fighter;
		this.playerId = fighter.playerId;
	}

	matchMovesinArrays = (sequence, history) => {
		if (history.length < sequence.length) return false;
		for (let i = 0; i < sequence.length; i++) {
			if (history[i][0] !== sequence[i]) return false;
		}
		this.history = [];
		return true;
	};

	isMoveSequenceMade(fighterState) {
		const sequence = this.fighter.specialMoveSequence[fighterState]
			.slice()
			.reverse();

		return (
			this.matchMovesinArrays(sequence, this.history) ||
			this.matchMovesinArrays(sequence, this.history.slice(1)) ||
			this.matchMovesinArrays(sequence, this.history.slice(2)) ||
			this.matchMovesinArrays(sequence, this.history.slice(3))
		);
	}

	getMove = () => {
		if (control.isForward(this.playerId, this.fighter.direction)) {
			if (control.isUp(this.playerId, this.fighter.direction))
				return FighterControls.FORWARD_UP;
			else if (control.isDown(this.playerId, this.fighter.direction))
				return FighterControls.FORWARD_DOWN;
			return FighterControls.FORWARD;
		} else if (control.isBackward(this.playerId, this.fighter.direction)) {
			if (control.isUp(this.playerId, this.fighter.direction))
				return FighterControls.BACKWARD_UP;
			else if (control.isDown(this.playerId, this.fighter.direction))
				return FighterControls.BACKWARD_DOWN;
			return FighterControls.BACKWARD;
		} else if (control.isUp(this.playerId, this.fighter.direction))
			return FighterControls.UP;
		else if (control.isDown(this.playerId, this.fighter.direction))
			return FighterControls.DOWN;
		else if (control.isLightPunch(this.playerId, this.fighter.direction))
			return FighterControls.LIGHT_PUNCH;
		else if (control.isMediumPunch(this.playerId, this.fighter.direction))
			return FighterControls.MEDIUM_PUNCH;
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
		if (time.previous - this.history[0][1] > 2 * POLLING_DELAY) return true;
		return false;
	};

	add = (time) => {
		if (this.historyTimer > time.previous) return;
		this.historyTimer = time.previous + POLLING_DELAY;

		const button = this.getButton();
		const move = this.getMove();

		if (button && this.isValidAddition(button, time))
			this.history.unshift([button, time.previous]);

		if (move && this.isValidAddition(move, time))
			this.history.unshift([move, time.previous]);

		// this.print();
	};

	remove = (time) => {
		for (let i = this.history.length - 1; i >= 0; i--) {
			if (this.history[i][1] <= time.previous - this.historyTimerCap) {
				this.history.splice(i, 1);
			} else {
				return;
			}
		}
	};

	print() {
		let something = [];
		for (const [name] of this.history) something.push(name);
		console.log(something);
	}

	checkSequences = (time) => {
		for (const [state, sequence] of Object.entries(
			this.fighter.specialMoveSequence
		)) {
			if (this.isMoveSequenceMade(state)) {
				this.fighter.changeState(state, time);
			}
		}
	};

	update = (time) => {
		this.add(time);
		this.remove(time);
		this.checkSequences(time);
	};
}
