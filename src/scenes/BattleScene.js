import {
	SCENE_WIDTH,
	STAGE_MID_POINT,
	STAGE_PADDING,
} from '../constants/Stage.js';
import { FighterId } from '../constants/fighter.js';
import { Camera } from '../engine/Camera.js';
import { Shadow } from '../entitites/Shadow.js';
import { Ken } from '../entitites/fighters/Ken.js';
import { Ryu } from '../entitites/fighters/Ryu.js';
import { FpsCounter } from '../entitites/overlays/FpsCounter.js';
import { StatusBar } from '../entitites/overlays/StatusBar.js';
import { KenStage } from '../entitites/stage/KenStage.js';
import { gameState } from '../states/gameState.js';

export class BattleScene {
	fighters = [];
	camera = undefined;
	shadows = [];
	entities = [];

	constructor() {
		this.stage = new KenStage();

		this.fighters = this.getFighterEntities();
		this.camera = new Camera(
			STAGE_PADDING + STAGE_MID_POINT - SCENE_WIDTH / 2,
			16,
			this.fighters
		);

		this.shadows = this.fighters.map((fighter) => new Shadow(fighter));

		this.overlays = [new StatusBar(this.fighters), new FpsCounter()];
	}

	getFighterClass = (id) => {
		switch (id) {
			case FighterId.KEN:
				return Ken;
			case FighterId.RYU:
				return Ryu;
			default:
				return new Error('Invalid Fighter Id');
		}
	};

	getFighterEntitiy = (id, index) => {
		const FighterClass = this.getFighterClass(id);
		return new FighterClass(index);
	};

	getFighterEntities = () => {
		const fighterEntities = gameState.fighters.map(({ id }, index) =>
			this.getFighterEntitiy(id, index)
		);

		fighterEntities[0].opponent = fighterEntities[1];
		fighterEntities[1].opponent = fighterEntities[0];

		return fighterEntities;
	};

	updateFighters = (time, context) => {
		this.fighters.map((fighter) => fighter.update(time, context, this.camera));
	};

	updateShadows = (time, context) => {
		this.shadows.map((shadow) => shadow.update(time, context));
	};

	updateEntities = (time, context) => {
		this.entities.map((entity) => entity.update(time, context));
	};

	updateOverlays = (time, context) => {
		this.overlays.map((overlay) => overlay.update(time, context));
	};

	update = (time, context) => {
		this.updateFighters(time, context);
		this.updateShadows(time, context);
		this.stage.update(time);
		this.updateEntities(time, context);
		this.camera.update(time);
		this.updateOverlays(time, context);
	};

	drawFighters(context) {
		this.fighters.map((fighter) => fighter.draw(context, this.camera));
	}

	drawShadows(context) {
		this.shadows.map((shadow) => shadow.draw(context, this.camera));
	}

	drawEntities(context) {
		this.entities.map((entity) => entity.draw(context, this.camera));
	}

	drawOverlays(context) {
		this.overlays.map((overlay) => overlay.draw(context, this.camera));
	}

	draw = (context) => {
		this.stage.drawBackground(context, this.camera);
		this.drawShadows(context);
		this.drawFighters(context);
		this.drawEntities(context);
		this.stage.drawForeground(context, this.camera);
		this.drawOverlays(context);
	};
}
