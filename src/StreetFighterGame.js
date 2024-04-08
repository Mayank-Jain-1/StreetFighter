import { Camera } from './engine/Camera.js';
import {
	SCENE_WIDTH,
	STAGE_MID_POINT,
	STAGE_PADDING,
} from './constants/Stage.js';
import { Ken } from './entitites/fighters/Ken.js';
import { Ryu } from './entitites/fighters/Ryu.js';
import { FpsCounter } from './entitites/overlays/FpsCounter.js';
import { StatusBar } from './entitites/overlays/StatusBar.js';
import { Shadow } from './entitites/Shadow.js';
import { KenStage } from './entitites/stage/KenStage.js';
import { registerKeyboardEvents } from './engine/InputHandler.js';
import { getContext } from './utils/context.js';

export class StreetFighterGame {
	constructor() {
		this.fighters = [new Ken(0), new Ryu(1)];

		this.fighters[0].opponent = this.fighters[1];
		this.fighters[1].opponent = this.fighters[0];

		this.camera = new Camera(
			STAGE_PADDING + STAGE_MID_POINT - SCENE_WIDTH / 2,
			16,
			this.fighters
		);

		this.stage = new KenStage();

		this.entities = [
			...this.fighters.map((fighter) => new Shadow(fighter)),
			...this.fighters,
		];

		this.overlays = [new FpsCounter(), new StatusBar(this.fighters)];

		this.frameTime = {
			secondsPassed: 0,
			previous: 0,
		};

		this.context = getContext();
	}

	update = () => {
		this.camera.update(this.frameTime, this.context);
		this.stage.update(this.frameTime, this.context, this.camera);

		for (const entity of this.entities) {
			entity.update(this.frameTime, this.context, this.camera);
		}
		for (const overlay of this.overlays) {
			overlay.update(this.frameTime, this.context, this.camera);
		}
	};

	draw = () => {
		this.stage.drawBackground(this.context, this.camera);
		for (const entity of this.entities) {
			entity.draw(this.context, this.camera);
		}
		this.stage.drawForeground(this.context, this.camera);
		for (const overlay of this.overlays) {
			overlay.draw(this.context, this.camera);
		}
	};

	frame = (time) => {
		window.requestAnimationFrame(this.frame.bind(this));

		this.update();
		this.draw();

		this.frameTime = {
			secondsPassed: (time - this.frameTime.previous) / 1000,
			previous: time,
		};
	};

	start() {
		registerKeyboardEvents();
		window.requestAnimationFrame(this.frame.bind(this));
	}
}
