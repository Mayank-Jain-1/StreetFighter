import { FighterDirection, FighterState } from "./constants/fighter.js";
import { STAGE_FLOOR } from "./constants/Stage.js";
import { Ken } from "./entitites/fighters/Ken.js";
import { Ryu } from "./entitites/fighters/Ryu.js";
import { FpsCounter } from "./entitites/FpsCounter.js";
import { Stage } from "./entitites/Stage.js";

const populateSelect = () => {
	const moveSelect = document.getElementById("MoveSelect");

	Object.entries(FighterState).forEach(([, value]) => {
		const option = document.createElement("option");
		option.setAttribute("value", value);
		option.innerText = value;
		moveSelect.appendChild(option);
	});
};

const handleFormSubmit = (event, fighters) => {
	event.preventDefault();

	const selectedCheckboxes = Array.from(
		event.target.querySelectorAll("input:checked")
	).map((checkbox) => checkbox.value);
	const selectedState = event.target.querySelector("select").value;
  fighters.forEach((fighter) => {
    selectedCheckboxes.includes(fighter.name) && fighter.changeState(selectedState)
  })
};

window.onload = () => {
	populateSelect();

	const canvasEL = document.querySelector("canvas");
	const context = canvasEL.getContext("2d");
	context.imageSmoothingEnabled = false;

	const fighters = [
		new Ken(180, STAGE_FLOOR, FighterDirection.RIGHT),
		new Ryu(250, STAGE_FLOOR, FighterDirection.LEFT),
	];

	const entities = [new Stage(), new FpsCounter(), ...fighters];

	let frameTime = {
		secondsPassed: 0,
		previous: 0,
	};

	const frame = (time) => {
		window.requestAnimationFrame(frame);

		frameTime = {
			secondsPassed: (time - frameTime.previous) / 1000,
			previous: time,
		};
		for (const entity of entities) {
			entity.update(frameTime, context);
		}
		for (const entity of entities) {
			entity.draw(context);
			context.drawImage;
		}
	};

	document.addEventListener("submit", (event) => handleFormSubmit(event, fighters));
	window.requestAnimationFrame(frame);
};
