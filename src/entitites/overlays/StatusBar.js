import {
	TIME_DELAY,
	TIME_FLASH_DELAY,
	TIME_FRAME_KEYS,
} from "../../constants/battle.js";

export class StatusBar {
	constructor(fighters) {
		this.image = document.getElementById("hud");
		this.fighters = fighters;
		this.time = 99;
		this.timeTimer = 0;

		this.timeFlashTimer = 0;
		this.useFlashFrames = false;

		this.frames = new Map([
			["health-bar", [16, 18, 145, 11]],
			["ko-white", [161, 16, 32, 14]],
			//Time
			[`${TIME_FRAME_KEYS[0]}-0`, [16, 32, 14, 16]],
			[`${TIME_FRAME_KEYS[0]}-1`, [32, 32, 14, 16]],
			[`${TIME_FRAME_KEYS[0]}-2`, [48, 32, 14, 16]],
			[`${TIME_FRAME_KEYS[0]}-3`, [64, 32, 14, 16]],
			[`${TIME_FRAME_KEYS[0]}-4`, [80, 32, 14, 16]],
			[`${TIME_FRAME_KEYS[0]}-5`, [96, 32, 14, 16]],
			[`${TIME_FRAME_KEYS[0]}-6`, [112, 32, 14, 16]],
			[`${TIME_FRAME_KEYS[0]}-7`, [128, 32, 14, 16]],
			[`${TIME_FRAME_KEYS[0]}-8`, [144, 32, 14, 16]],
			[`${TIME_FRAME_KEYS[0]}-9`, [160, 32, 14, 16]],

			// Time Flash
			[`${TIME_FRAME_KEYS[1]}-0`, [16, 192, 14, 16]],
			[`${TIME_FRAME_KEYS[1]}-1`, [32, 192, 14, 16]],
			[`${TIME_FRAME_KEYS[1]}-2`, [48, 192, 14, 16]],
			[`${TIME_FRAME_KEYS[1]}-3`, [64, 192, 14, 16]],
			[`${TIME_FRAME_KEYS[1]}-4`, [80, 192, 14, 16]],
			[`${TIME_FRAME_KEYS[1]}-5`, [96, 192, 14, 16]],
			[`${TIME_FRAME_KEYS[1]}-6`, [112, 192, 14, 16]],
			[`${TIME_FRAME_KEYS[1]}-7`, [128, 192, 14, 16]],
			[`${TIME_FRAME_KEYS[1]}-8`, [144, 192, 14, 16]],
			[`${TIME_FRAME_KEYS[1]}-9`, [160, 192, 14, 16]],

			// Name tags
			["tag-ken", [128, 56, 30, 9]],
			["tag-ryu", [16, 56, 28, 9]],
		]);
	}

	drawFrame(context, frameKey, x, y, direction = 1) {
		const [sourceX, sourceY, sourceWidth, sourceHeight] =
			this.frames.get(frameKey);

		context.scale(direction, 1);
		context.drawImage(
			this.image,
			sourceX,
			sourceY,
			sourceWidth,
			sourceHeight,
			x * direction,
			y,
			sourceWidth,
			sourceHeight
		);

		context.setTransform(1, 0, 0, 1, 0, 0);
	}

	drawHealthBar(context) {
		this.drawFrame(context, "health-bar", 31, 20);
		this.drawFrame(context, "ko-white", 176, 18);
		this.drawFrame(context, "health-bar", 353, 20, -1);
	}

	drawTime(context) {
		const timeString = String(Math.max(this.time, 0)).padStart(2, "0");

		const timeFrame = TIME_FRAME_KEYS[Number(this.useFlashFrames)];

		this.drawFrame(context, `${timeFrame}-${timeString.charAt(0)}`, 178, 33);
		this.drawFrame(context, `${timeFrame}-${timeString.charAt(1)}`, 194, 33);
	}

	drawNames(context) {
		const [{ name: name1 }, { name: name2 }] = this.fighters;
		this.drawFrame(context, `tag-${name1.toLowerCase()}`, 32, 33);
		this.drawFrame(context, `tag-${name2.toLowerCase()}`, 322, 33);
	}

	updateTime(time) {
		if (time.previous > this.timeTimer + TIME_DELAY) {
			this.time -= 1;
			this.timeTimer = time.previous;
		}

		if (
			this.time < 15 &&
			this.time > -1 &&
			time.previous > this.timeFlashTimer + TIME_FLASH_DELAY
		) {
			this.timeFlashTimer = time.previous;
			this.useFlashFrames = !this.useFlashFrames;
		}
	}

	update(time) {
		this.updateTime(time);
	}

	draw(context) {
		this.drawHealthBar(context);
		this.drawTime(context);
		this.drawNames(context);
	}
}
