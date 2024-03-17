import { Camera } from "./Camera.js";
import {
	FIGHTER_START_DISTANCE,
	FighterDirection,
} from "./constants/fighter.js";
import {
	SCENE_WIDTH,
	STAGE_FLOOR,
	STAGE_MID_POINT,
	STAGE_PADDING,
	STAGE_WIDTH,
} from "./constants/Stage.js";
import { Ken } from "./entitites/fighters/Ken.js";
import { Ryu } from "./entitites/fighters/Ryu.js";
import { FpsCounter } from "./entitites/FpsCounter.js";
import { StatusBar } from "./entitites/overlays/StatusBar.js";
import { Shadow } from "./entitites/Shadow.js";
import { Stage } from "./entitites/Stage.js";
import { registerKeyboardEvents } from "./InputHandler.js";

export class StreetFighterGame {
	constructor() {
		console.log(STAGE_MID_POINT);
		this.fighters = [
			new Ken(
				STAGE_MID_POINT + STAGE_PADDING - FIGHTER_START_DISTANCE,
				STAGE_FLOOR,
				FighterDirection.RIGHT,
				0
			),
			new Ryu(
				STAGE_MID_POINT + STAGE_PADDING + FIGHTER_START_DISTANCE,
				STAGE_FLOOR,
				FighterDirection.LEFT,
				1
			),
		];

		this.fighters[0].opponent = this.fighters[1];
		this.fighters[1].opponent = this.fighters[0];

		this.camera = new Camera(
			STAGE_PADDING + STAGE_MID_POINT - SCENE_WIDTH / 2,
			16,
			this.fighters
		);

		this.entities = [
			new Stage(),
			...this.fighters.map((fighter) => new Shadow(fighter)),
			new FpsCounter(),
			...this.fighters,
			new StatusBar(this.fighters),
		];

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
		this.camera.update(this.frameTime, this.context);

		for (const entity of this.entities) {
			entity.update(this.frameTime, this.context, this.camera);
		}
	};

	draw = () => {
		for (const entity of this.entities) {
			entity.draw(this.context, this.camera);
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
