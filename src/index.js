import { StreetFighterGame } from './StreetFighterGame.js';

window.onload = () => {
	new StreetFighterGame().start();
	// window.addEventListener(
	// 	'click',
	// 	() => {
	// 		new StreetFighterGame().start();
	// 	},
	// 	{ once: true }
	// );
};
