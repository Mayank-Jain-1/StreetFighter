export const drawFrame = (context, image, dimensions, x, y, direction = 1) => {
	const [sourceX, sourceY, sourceWidth, sourceHeight] = dimensions;

	context.scale(direction, 1);
	context.drawImage(
		image,
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
};

export const getContext = () => {
	const canvasEL = document.querySelector('canvas');
	const context = canvasEL.getContext('2d');
	context.imageSmoothingEnabled = false;
	return context;
};
