import {
	TIME_DELAY,
	TIME_FLASH_DELAY,
	TIME_FRAME_KEYS,
} from "../../constants/battle.js";
import { drawFrame } from "../../utils/context.js";

export class StatusBar {
	constructor(fighters) {
		this.image = document.getElementById("hud");
		this.fighters = fighters;
		this.time = 99;
		this.timeTimer = 0;

		this.timeFlashTimer = 0;
		this.useFlashFrames = false;
		[{ name: this.name1 }, { name: this.name2 }] = this.fighters;

		this.nameTags = [
			`tag-${this.name1.toLowerCase()}`,
			`tag-${this.name2.toLowerCase()}`,
		];

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

			// NUmbers
			["score-0", [17, 101, 10, 10]],
			["score-1", [29, 101, 10, 10]],
			["score-2", [41, 101, 10, 10]],
			["score-3", [53, 101, 10, 10]],
			["score-4", [65, 101, 11, 10]],
			["score-5", [77, 101, 10, 10]],
			["score-6", [89, 101, 10, 10]],
			["score-7", [101, 101, 10, 10]],
			["score-8", [113, 101, 10, 10]],
			["score-9", [125, 101, 10, 10]],

			// Alphabets
			["score-@", [17, 113, 10, 10]],
			["score-A", [29, 113, 11, 10]],
			["score-B", [41, 113, 10, 10]],
			["score-C", [53, 113, 10, 10]],
			["score-D", [65, 113, 10, 10]],
			["score-E", [77, 113, 10, 10]],
			["score-F", [89, 113, 10, 10]],
			["score-G", [101, 113, 10, 10]],
			["score-H", [113, 113, 10, 10]],
			["score-I", [125, 113, 9, 10]],
			["score-J", [136, 113, 10, 10]],
			["score-K", [149, 113, 10, 10]],
			["score-L", [161, 113, 10, 10]],
			["score-M", [173, 113, 10, 10]],
			["score-N", [185, 113, 11, 10]],
			["score-0", [197, 113, 10, 10]],
			["score-P", [17, 125, 10, 10]],
			["score-Q", [29, 125, 10, 10]],
			["score-R", [41, 125, 10, 10]],
			["score-S", [53, 125, 10, 10]],
			["score-T", [65, 125, 10, 10]],
			["score-U", [77, 125, 10, 10]],
			["score-V", [89, 125, 10, 10]],
			["score-W", [101, 125, 10, 10]],
			["score-X", [113, 125, 10, 10]],
			["score-Y", [125, 125, 10, 10]],
			["score-Z", [136, 125, 10, 10]],

			// Name tags
			["tag-ken", [128, 56, 30, 9]],
			["tag-ryu", [16, 56, 28, 9]],
		]);
	}

	drawFrame(context, frameKey, x, y, direction = 1) {
		drawFrame(context, this.image, this.frames.get(frameKey), x, y, direction);
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
		this.drawFrame(context, this.nameTags[0], 32, 33);
		this.drawFrame(context, this.nameTags[1], 322, 33);
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

	drawScoreLabel(context, label, x) {
		for (let i = 0; i < label.length; i++) {
			this.drawFrame(
				context,
				`score-${label.charAt(i).toUpperCase()}`,
				x + 12 * i,
				1
			);
		}
	}

	drawScore(context, score, x) {
		const str = new String(score);
		const offsetX = 6 * 12 - str.length * 12;
		for (let i = 0; i < str.length; i++) {
			this.drawFrame(
				context,
				`score-${str.charAt(i)}`,
				x + offsetX + 12 * i,
				1
			);
		}
	}

	drawScores(context) {
		this.drawScoreLabel(context, "P1", 4);
		this.drawScore(context, 37918, 45);

		this.drawScoreLabel(context, "May", 133);
		this.drawScore(context, 50000, 177);

		this.drawScoreLabel(context, "P2", 269);
		this.drawScore(context, 16126, 309);
	}

	draw(context) {
		this.drawScores(context);
		this.drawHealthBar(context);
		this.drawTime(context);
		this.drawNames(context);
	}
}
