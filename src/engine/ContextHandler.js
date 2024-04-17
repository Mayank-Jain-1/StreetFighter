export class ContextHandler {
	brightness = 1;
	contrast = 1;

	minBrightness = 0;
	maxContrast = 2;

	dimDown = false;
	glowUp = false;

	constructor(context) {
		this.context = context;
	}

	startGlowUp = () => {
		this.glowUp = true;
		this.brightness = this.minBrightness;
		this.contrast = this.maxContrast;
	};

	startDimDown = () => {
		this.dimDown = true;
	};

	updateGlowUp = (time) => {
		if (this.brightness === 1 && this.contrast === 1) return true;
		this.brightness = Math.min(1, this.brightness + 1 * time.secondsPassed);
		this.contrast = Math.max(1, this.contrast - 2 * time.secondsPassed);
		return false;
	};

	updateDimDown = (time) => {
		if (
			this.brightness === this.minBrightness &&
			this.contrast === this.maxContrast
		) {
			this.dimDown = false;
			return;
		}
		this.brightness = Math.max(
			this.minBrightness,
			this.brightness - 1 * time.secondsPassed
		);
		this.contrast = Math.min(
			this.contrast + 2 * time.secondsPassed,
			this.maxContrast
		);
	};

	update = (time) => {
		if (this.dimDown) this.updateDimDown(time);
		else if (this.glowUp) this.updateGlowUp(time);
	};
	draw = () => {};
}
