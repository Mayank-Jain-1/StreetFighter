import { FighterDirection } from "./constants/fighter.js";
import { STAGE_FLOOR } from "./constants/Stage.js";
import { Ken } from "./entitites/fighters/Ken.js";
import { Ryu } from "./entitites/fighters/Ryu.js";
import { FpsCounter } from "./entitites/FpsCounter.js";
import { Stage } from "./entitites/Stage.js";
import { registerKeyboardEvents } from "./InputHandler.js";

export class StreetFighterGame {
	constructor() {
		this.fighters = [
			new Ken(180, STAGE_FLOOR, FighterDirection.RIGHT, 0),
			new Ryu(250, STAGE_FLOOR, FighterDirection.LEFT,1),
		];

		this.entities = [new Stage(), new FpsCounter(), ...this.fighters];

		this.frameTime = {
			secondsPassed: 0,
			previous: 0,
		};

		this.context = this.getContext();
	}

	getContext = () => {
		const canvasEL = document.querySelector("canvas");
		const context = canvasEL.getContext("2d");
		context.imageSmoothingEnabled = false;
		return context;
	};

	update = () => {
		for (const entity of this.entities) {
			entity.update(this.frameTime, this.context);
		}
	};

	draw = () => {
		for (const entity of this.entities) {
			entity.draw(this.context);
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
