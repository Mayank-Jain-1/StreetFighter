export class Camera {
	constructor(x, y, fighters) {
		this.position = { x: x, y: y };
		this.fighters = fighters;

		this.speed = 100;
	}

	update = (time, context) => {
		console.log(
			Math.floor(
				Math.min(this.fighters[1].position.y, this.fighters[0].position.y) / 15
			)
		);
		this.position.y =
			-6 + 
			Math.floor(
				Math.min(this.fighters[1].position.y, this.fighters[0].position.y) / 10
			);
	};
}
