import {
	SCENE_WIDTH,
	STAGE_MID_POINT,
	STAGE_PADDING,
} from '../constants/Stage.js';
import {
	FighterAttackBaseData,
	FighterAttackStrength,
	FighterId,
} from '../constants/fighter.js';
import { Camera } from '../engine/Camera.js';
import { Ken, Ryu } from '../entitites/fighters/index.js';
import {
	HeavyHitSplash,
	LightHitSplash,
	MediumHitSplash,
	Shadow,
} from '../entitites/fighters/shared/index.js';
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
		this.overlays = [new StatusBar(this.fighters), new FpsCounter()];
		this.startRound();
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
		return new FighterClass(index, this.handleAttackHit.bind(this));
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

	getHitSplashClass = (strength) => {
		switch (strength) {
			case FighterAttackStrength.LIGHT:
				return LightHitSplash;
			case FighterAttackStrength.MEDIUM:
				return MediumHitSplash;
			case FighterAttackStrength.HEAVY:
				return HeavyHitSplash;
			default:
				return new Error('Invalid Strength Splash requested');
		}
	};

	handleAttackHit = (playerId, opponentId, position, strength) => {
		gameState.fighters[playerId].score += FighterAttackBaseData[strength].score;

		gameState.fighters[opponentId].hitPoints -=
			FighterAttackBaseData[strength].damage;

		const HitSplashClass = this.getHitSplashClass(strength);

		this.addEntity(HitSplashClass, position.x, position.y, playerId);
	};

	updateShadows = (time, context) => {
		this.shadows.map((shadow) => shadow.update(time, context));
	};

	startRound = () => {
		this.fighters = this.getFighterEntities();
		this.camera = new Camera(
			STAGE_PADDING + STAGE_MID_POINT - SCENE_WIDTH / 2,
			16,
			this.fighters
		);

		this.shadows = this.fighters.map((fighter) => new Shadow(fighter));
	};

	addEntity = (EntityClass, ...args) => {
		this.entities.push(new EntityClass(...args, this.removeEntity));
	};

	// Either use arrow function as i keeps the 'this' reference of parent always and doesnt have own 'this'
	// Or use normal function and use this.removeEntity.bind(this)

	removeEntity = (entity) => {
		this.entities = this.entities.filter((thisEntity) => thisEntity !== entity);
	};

	updateEntities = (time, context) => {
		for (const entity of this.entities) {
			entity.update(time, context);
		}
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
