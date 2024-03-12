export class StatusBar {
	constructor(fighters) {
		this.image = document.getElementById("hud");
		this.fighters = fighters;
		this.time = 99;
		this.timeTimer = 0;
		this.frames = new Map([
			["health-bar", [16, 18, 145, 11]],
			["ko-white", [161, 16, 32, 14]],
			//Time
			["time-0", [16, 32, 14, 16]],
			["time-1", [32, 32, 14, 16]],
			["time-2", [48, 32, 14, 16]],
			["time-3", [64, 32, 14, 16]],
			["time-4", [80, 32, 14, 16]],
			["time-5", [96, 32, 14, 16]],
			["time-6", [112, 32, 14, 16]],
			["time-7", [128, 32, 14, 16]],
			["time-8", [144, 32, 14, 16]],
			["time-9", [160, 32, 14, 16]],

			// Time Flash
			["time-flash-0", [16, 192, 14, 16]],
			["time-flash-1", [32, 192, 14, 16]],
			["time-flash-2", [48, 192, 14, 16]],
			["time-flash-3", [64, 192, 14, 16]],
			["time-flash-4", [80, 192, 14, 16]],
			["time-flash-5", [96, 192, 14, 16]],
			["time-flash-6", [112, 192, 14, 16]],
			["time-flash-7", [128, 192, 14, 16]],
			["time-flash-8", [144, 192, 14, 16]],
			["time-flash-9", [160, 192, 14, 16]],

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
		const timeString = String(this.time).padStart(2, "0");
		this.drawFrame(context, `time-${timeString.charAt(0)}`, 178, 33);
		this.drawFrame(context, `time-${timeString.charAt(1)}`, 194, 33);
	}

	drawNames(context) {
		const [{ name: name1 }, { name: name2 }] = this.fighters;
		this.drawFrame(context, `tag-${name1.toLowerCase()}`, 32, 33);
		this.drawFrame(context, `tag-${name2.toLowerCase()}`, 322, 33);
	}

	updateTime(time) {
		if (time.previous > this.timeTimer + 664) {
			if (this.time > 0) this.time -= 1;
			this.timeTimer = time.previous;
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
