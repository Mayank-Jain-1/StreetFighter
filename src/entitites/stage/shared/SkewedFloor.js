import {
	STAGE_MID_POINT,
	STAGE_PADDING,
	STAGE_WIDTH,
} from "../../../constants/Stage.js";

export class SkewedFloor {
	constructor(image, dimensions) {
		this.image = image;
		this.dimensions = dimensions;
	}

	draw = (context, camera, y) => {
		const [sourceX, sourceY, width, height] = this.dimensions;

		context.save();
		context.setTransform(
			1,
			0,
			-5.15 - (camera.position.x - (STAGE_WIDTH + STAGE_PADDING)) / 112,
			1,
			32 - camera.position.x / 1.55,
			y - camera.position.y
		);

		context.drawImage(
			this.image,
			sourceX,
			sourceY,
			width,
			height,
			0,
			0,
			width,
			height
		);

		context.restore();
	};
}
