import { registerKeyboardEvents } from './engine/InputHandler.js';
import { getContext } from './utils/context.js';
import { BattleScene } from './scenes/BattleScene.js';

export class StreetFighterGame {
	context = getContext();

	frameTime = {
		secondsPassed: 0,
		previous: 0,
	};

	constructor() {
		this.scene = new BattleScene();
	}

	frame = (time) => {
		window.requestAnimationFrame(this.frame.bind(this));

		this.frameTime = {
			secondsPassed: (time - this.frameTime.previous) / 1000,
			previous: time,
		};

		this.scene.update(this.frameTime);
		this.scene.draw(this.context);

	};

	start() {
		registerKeyboardEvents();
		window.requestAnimationFrame(this.frame.bind(this));
	}
}
