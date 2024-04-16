import {
	registerGamepadEvents,
	registerKeyboardEvents,
	updateGamePads,
} from './engine/InputHandler.js';
import { getContext } from './utils/context.js';
import { BattleScene } from './scenes/BattleScene.js';
import { GAME_SPEED } from './constants/game.js';

export class StreetFighterGame {
	context = getContext();

	frameTime = {
		secondsPassed: 0,
		previous: 0,
	};

	timeStarted = 0;

	constructor() {
		this.scene = new BattleScene();
	}

	frame = (time) => {
		window.requestAnimationFrame(this.frame.bind(this));

		if (this.timeStarted === 0) {
			this.timeStarted = time;
		}
		time -= this.timeStarted;
		time = time * GAME_SPEED;

		this.frameTime = {
			secondsPassed: (time - this.frameTime.previous) / 1000,
			previous: time,
		};
		updateGamePads();
		this.scene.update(this.frameTime);
		this.scene.draw(this.context);
	};

	start() {
		registerKeyboardEvents();
		registerGamepadEvents();
		window.requestAnimationFrame(this.frame.bind(this));
	}
}
