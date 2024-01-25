import { Fighter } from "./Fighter.js";

export class Ryu extends Fighter {
	constructor(x, y, velocity) {
		super("Ryu", x, y, velocity);
		this.image = document.getElementById("RyuImage");
	}
}
