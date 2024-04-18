import {
	SCENE_WIDTH,
	STAGE_MID_POINT,
	STAGE_PADDING,
} from '../constants/Stage.js';
import {
	FighterAttackBaseData,
	FighterAttackStrength,
	FighterId,
	FighterState,
	FighterStruckDelay,
} from '../constants/fighter.js';
import { FRAME_TIME, GAME_SPEED } from '../constants/game.js';
import { Camera } from '../engine/Camera.js';
import { EntityList } from '../engine/EntityList.js';
import { Ken, Ryu } from '../entitites/fighters/index.js';
import {
	HeavyHitSplash,
	LightHitSplash,
	MediumHitSplash,
	Shadow,
} from '../entitites/fighters/shared/index.js';
import { Fireball } from '../entitites/fighters/special/Fireball.js';
import { FpsCounter } from '../entitites/overlays/FpsCounter.js';
import { StatusBar } from '../entitites/overlays/StatusBar.js';
import { KenStage } from '../entitites/stage/KenStage.js';
import { gameState, resetGameState } from '../states/gameState.js';
import { StartScene } from './StartScene.js';

export class BattleScene {
	image = document.getElementById('Winner');
	fighters = [];
	camera = undefined;
	shadows = [];
	FighterDrawOrder = [0, 1];
	hurtTimer = 0;
	battleEnded = false;
	winnerId = undefined;

	constructor(changeScene) {
		this.changeScene = changeScene;
		this.stage = new KenStage();
		this.entities = new EntityList();
		this.overlays = [
			new StatusBar(this.fighters, this.onTimeEnd),
			new FpsCounter(),
		];
		resetGameState();
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
		return new FighterClass(index, this.handleAttackHit, this.entities);
	};

	getFighterEntities = () => {
		const fighterEntities = gameState.fighters.map(({ id }, index) => {
			const fighterEntity = this.getFighterEntitiy(id, index);
			gameState.fighters[index].instance = fighterEntity;
			return fighterEntity;
		});

		fighterEntities[0].opponent = fighterEntities[1];
		fighterEntities[1].opponent = fighterEntities[0];

		return fighterEntities;
	};

	updateFighters = (time, context) => {
		this.fighters.map((fighter) => {
			if (this.hurtTimer > time.previous) {
				fighter.updateHurtShake(time, this.hurtTimer);
			} else fighter.update(time, this.camera);
		});
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

	handleAttackHit = (time, playerId, opponentId, position, strength) => {
		this.FighterDrawOrder = [opponentId, playerId];
		gameState.fighters[playerId].score += FighterAttackBaseData[strength].score;

		gameState.fighters[opponentId].hitPoints -=
			FighterAttackBaseData[strength].damage;

		const HitSplashClass = this.getHitSplashClass(strength);

		if (gameState.fighters[opponentId].hitPoints <= 0) {
			this.fighters[opponentId].changeState(FighterState.KO, time);
		}

		this.fighters[opponentId].direction =
			this.fighters[playerId].direction * -1;

		position &&
			this.entities.add(HitSplashClass, position.x, position.y, playerId);

		this.hurtTimer = time.previous + FighterStruckDelay * FRAME_TIME;
	};

	updateShadows = (time) => {
		this.shadows.map((shadow) => shadow.update(time));
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

	goToStartScene = () => {
		setTimeout(() => {
			this.changeScene(StartScene);
		}, 6000);
	};

	drawWinnerText = (context, id) => {
		context.drawImage(this.image, 0, 11 * id, 70, 9, 120, 60, 140, 30);
	};

	onTimeEnd = (time) => {
		if (gameState.fighters[0].hitPoints >= gameState.fighters[1].hitPoints) {
			this.fighters[0].victory = true;
			this.fighters[1].changeState(FighterState.KO, time);
			this.winnerId = 0;
		} else {
			this.fighters[1].victory = true;
			this.fighters[0].changeState(FighterState.KO, time);
			this.winnerId = 1;
		}
		this.goToStartScene();
	};

	updateOverlays = (time) => {
		this.overlays.map((overlay) => overlay.update(time));
	};

	updateFighterHP = (time) => {
		gameState.fighters.map((fighter, index) => {
			if (fighter.hitPoints <= 0 && !this.battleEnded) {
				this.fighters[index].opponent.victory = true;
				this.winnerId = 1 - index;
				this.battleEnded = true;
				this.goToStartScene();
			}
		});
	};

	update = (time) => {
		this.updateFighters(time);
		this.updateShadows(time);
		this.stage.update(time);
		this.entities.update(time, this.camera);
		this.camera.update(time);
		this.updateOverlays(time);
		this.updateFighterHP(time);
	};

	drawFighters(context) {
		this.FighterDrawOrder.map((id) =>
			this.fighters[id].draw(context, this.camera)
		);
	}

	drawShadows(context) {
		this.shadows.map((shadow) => shadow.draw(context, this.camera));
	}

	drawOverlays(context) {
		this.overlays.map((overlay) => overlay.draw(context, this.camera));
		if (this.winnerId !== undefined) {
			this.drawWinnerText(context, this.winnerId);
		}
	}

	draw = (context) => {
		this.stage.drawBackground(context, this.camera);
		this.drawShadows(context);
		this.drawFighters(context);
		this.entities.draw(context, this.camera);
		this.stage.drawForeground(context, this.camera);
		this.drawOverlays(context);
	};
}
