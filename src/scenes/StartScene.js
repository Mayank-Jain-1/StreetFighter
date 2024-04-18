import { SCENE_WIDTH } from '../constants/Stage.js';
import { LOGO_FLASH_DELAY } from '../constants/battle.js';
import { BattleScene } from './BattleScene.js';

export class StartScene {
	image = document.getElementById('Controls');
	logoImg = document.getElementById('Logo');

	text = 'CLICK ANYWHERE TO START';
	repeatTime = 3;
	position = 10;
	logoFlash = false;
	flashTimer = 0;
	brightness = 0;
	contrast = 3;
	sceneEnded = false;

	endStartScene = () => {
		this.changeScene(BattleScene);
		window.removeEventListener('click', this.endStartScene);
	};

	constructor(changeScene) {
		this.changeScene = changeScene;
		window.removeEventListener('click', this.endStartScene);
		window.addEventListener('click', this.endStartScene);
	}

	updateLogo = (time) => {
		if (this.flashTimer > time.previous) return;
		this.flashTimer = time.previous + LOGO_FLASH_DELAY[Number(!this.logoFlash)];
		this.logoFlash = !this.logoFlash;
	};

	updateTextPosition = (time) => {
		this.position -= time.secondsPassed * 100;
	};

	update = (time) => {
		this.updateLogo(time);
		this.updateTextPosition(time);
	};

	drawText = (context) => {
		context.fillStyle = 'white';
		context.font = '12px Arial';
		const textWidth = context.measureText(this.text).width;

		for (let i = 0; i < this.repeatTime; i++) {
			context.fillText(this.text, this.position + i * (textWidth + 30), 18);
		}

		if (this.position < (-textWidth + -30) * this.repeatTime) {
			this.position = SCENE_WIDTH;
		}
	};

	drawLogo = (context) => {
		if (this.logoFlash) {
			context.fillStyle = 'black';
			context.fillRect(112, 22, 170, 80);
			return;
		}
		context.drawImage(
			this.logoImg,
			0,
			0,
			this.logoImg.width,
			this.logoImg.height,
			112,
			22,
			170,
			80
		);
	};

	draw = (context) => {
		context.drawImage(this.image, 0, 0);
		this.drawLogo(context);
		this.drawText(context);
	};
}
