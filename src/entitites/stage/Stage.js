import { FRAME_TIME } from "../../constants/game.js";
import { drawFrame } from "../../utils/context.js";
import { BackgroundAnimation } from "./shared/BackgroundAnimation.js";

export class Stage {
	constructor() {
		this.image = document.getElementById("KenStage");
		this.frames = new Map([
			["stage-background", [72, 208, 768, 176]],
			["stage-boat", [8, 16, 521, 180]],
			["stage-floor", [8, 392, 896, 72]],
		]);

		this.boat = {
			position: {
				x: 0,
				y: 0,
			},
			animationFrame: 0,
			animationDelay: 22,
			animationTimer: 0,
			animation: [0, -1, -2, -3, -4, -3, -2, -1],
		};

		this.flag = new BackgroundAnimation(
			"Flag",
			this.image,
			[
				["flag-1", [848, 208, 40, 40]],
				["flag-2", [848, 256, 40, 40]],
				["flag-3", [848, 304, 40, 40]],
			],
			[
				["flag-1", 166],
				["flag-2", 166],
				["flag-3", 166],
				["flag-2", 166],
			],
			0
		);

		this.backgroundPeople = {
			shineGuy: [
				new BackgroundAnimation(
					"shineGuy",
					this.image,
					[
						["shiny-guy-1", [552, 8, 40, 64]],
						["shiny-guy-2", [552, 80, 40, 56]],
						["shiny-guy-3", [552, 144, 40, 56]],
					],
					[
						["shiny-guy-1", 100],
						["shiny-guy-2", 133],
						["shiny-guy-3", 664],
						["shiny-guy-2", 133],
					],
					0
				),
				[278, 157],
			],
			hatGuy: [
				new BackgroundAnimation(
					"HatGuy",
					this.image,
					[
						["hat-guy-1", [600, 24, 16, 48]],
						["hat-guy-2", [600, 88, 16, 48]],
					],
					[
						["hat-guy-1", 1000],
						["hat-guy-2", 1000],
					],
					0
				),
				[318, 157],
			],
			girl: [
				new BackgroundAnimation(
					"girl",
					this.image,
					[
						["girl-1", [624, 16, 32, 56]],
						["girl-2", [624, 80, 32, 56]],
						["girl-3", [624, 144, 32, 56]],
					],
					[
						["girl-1", 216],
						["girl-2", 216],
						["girl-3", 216],
						["girl-2", 216],
					],
					0
				),
				[342, 157],
			],
			greenGuy: [
				new BackgroundAnimation(
					"greenGuy",
					this.image,
					[
						["green-guy-1", [664, 16, 32, 56]],
						["green-guy-2", [664, 80, 32, 56]],
					],
					[
						["green-guy-1", 664],
						["green-guy-2", 498],
						["green-guy-1", 133],
						["green-guy-2", 133],
					],
					0
				),
				[374, 157],
			],
			blueCoatGuy: [
				new BackgroundAnimation(
					"blueCoatGuy",
					this.image,
					[
						["blue-coat-1", [704, 16, 48, 56]],
						["blue-coat-2", [704, 80, 48, 56]],
						["blue-coat-3", [704, 144, 48, 56]],
					],
					[
						["blue-coat-1", 996],
						["blue-coat-2", 133],
						["blue-coat-3", 100],
						["blue-coat-2", 133],
						["blue-coat-1", 249],
						["blue-coat-2", 133],
						["blue-coat-3", 100],
						["blue-coat-2", 133],
					],
					0
				),
				[438, 149],
			],
			brownCoatGuy: [
				new BackgroundAnimation(
					"brownCoatGuy",
					this.image,
					[
						["brown-coat-1", [760, 16, 40, 40]],
						["brown-coat-2", [760, 64, 40, 40]],
						["brown-coat-3", [760, 112, 40, 40]],
					],
					[
						["brown-coat-1", 133],
						["brown-coat-2", 133],
						["brown-coat-3", 133],
						["brown-coat-2", 133],
					],
					0
				),
				[238, 61],
			],
			pinkCoatGuy: [
				new BackgroundAnimation(
					"pinkCoatGuy",
					this.image,
					[
						["pink-coat-1", [808, 24, 48, 32]],
						["pink-coat-2", [808, 72, 48, 32]],
						["pink-coat-3", [808, 120, 48, 32]],
					],
					[
						["pink-coat-1", 1992],
						["pink-coat-2", 166],
						["pink-coat-3", 166],
						["pink-coat-2", 166],
						["pink-coat-1", 664],
						["pink-coat-2", 166],
						["pink-coat-3", 166],
						["pink-coat-2", 166],
						["pink-coat-3", 166],
						["pink-coat-2", 166],
					],
					0
				),
				[278, 53],
			],
		};
	}

	drawFrame = (context, frameKey, x, y, direction = 1) => {
		drawFrame(context, this.image, this.frames.get(frameKey), x, y, direction);
	};

	drawBoat = (context, camera) => {
		this.boat.position = {
			x: Math.floor(150 - camera.position.x / 1.613445),
			y: -3 - camera.position.y - this.boat.animation[this.boat.animationFrame],
		};
		this.drawFrame(
			context,
			"stage-boat",
			this.boat.position.x,
			this.boat.position.y
		);
	};

	updateBoat = (time, context) => {
		if (
			time.previous >
			this.boat.animationTimer + this.boat.animationDelay * FRAME_TIME
		) {
			this.boat.animationTimer = time.previous;
			this.boat.animationFrame++;
			this.boat.animationDelay = 22 + (Math.random() * 16 - 8);

			if (this.boat.animationFrame >= this.boat.animation.length) {
				this.boat.animationFrame = 0;
			}
		}
	};

	updateBoatPersons(time, context, camera) {
		Object.keys(this.backgroundPeople).forEach((name) => {
			this.backgroundPeople[name][0].update(time, camera);
		});
	}

	update = (time, context, camera) => {
		this.updateBoat(time, context);
		this.updateBoatPersons(time, context);
		this.flag.update(time, camera);
	};

	draw = (context, camera) => {
		this.drawFrame(
			context,
			"stage-background",
			Math.floor(16 - camera.position.x / 2.157303),
			-camera.position.y
		);
		this.flag.draw(
			context,
			camera,
			Math.floor(576 - camera.position.x / 2.157303),
			48
		);

		this.drawBoat(context, camera);

		Object.keys(this.backgroundPeople).forEach((name) => {
			this.backgroundPeople[name][0].draw(
				context,
				camera,
				Math.floor(
					this.backgroundPeople[name][1][0] - camera.position.x / 1.613445
				),
				this.backgroundPeople[name][1][1] -
					this.boat.animation[this.boat.animationFrame]
			);
		});

		this.drawFrame(
			context,
			"stage-floor",
			Math.floor(192 - camera.position.x),
			176 - camera.position.y
		);
	};
}
