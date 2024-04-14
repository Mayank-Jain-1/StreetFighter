const drawOriginCross = (context, camera, position) => {
	context.beginPath();
	context.strokeStyle = 'white';
	context.moveTo(
		Math.floor(position.x - camera.position.x) + 5,
		Math.floor(position.y - camera.position.y) - 0.5
	);
	context.lineTo(
		Math.floor(position.x - camera.position.x) - 4,
		Math.floor(position.y - camera.position.y) - 0.5
	);
	context.moveTo(
		Math.floor(position.x - camera.position.x) + 0.5,
		Math.floor(position.y - camera.position.y) - 5
	);
	context.lineTo(
		Math.floor(position.x - camera.position.x) + 0.5,
		Math.floor(position.y - camera.position.y) + 4
	);
	context.stroke();
};

export const drawDebugBox = (
	context,
	camera,
	position,
	direction,
	dimensions,
	color
) => {
	if (!Array.isArray(dimensions)) return;
	const [x, y, width, height] = dimensions;
	context.lineWidth = 1;
	context.beginPath();
	context.strokeStyle = color;
	context.fillStyle = color + '33';
	context.fillRect(
		Math.floor(position.x - camera.position.x + x * direction) + 0.5,
		Math.floor(position.y + y - camera.position.y) + 0.5,
		width * direction,
		height
	);
	context.rect(
		Math.floor(position.x - camera.position.x + x * direction) + 0.5,
		Math.floor(position.y + y - camera.position.y) + 0.5,
		width * direction,
		height
	);
	context.stroke();
};

export function DEBUG_drawCollisionInfo(fighter, context, camera) {
	const { position, direction, boxes } = fighter;

	// Push Box
	drawDebugBox(
		context,
		camera,
		position,
		direction,
		Object.values(boxes.push),
		'#55ff55'
	);

	//Hurt Boxes
	Object.values(boxes.hurt).map((box) => {
		drawDebugBox(context, camera, position, direction, box, '#5555ff');
	});

	// Hit Box
	drawDebugBox(
		context,
		camera,
		position,
		direction,
		Object.values(boxes.hit),
		'#ff0000'
	);

	// Origin
	drawOriginCross(context, camera, position);
}
