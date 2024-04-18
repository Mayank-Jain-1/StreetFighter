import { FRAME_TIME } from './game.js';

export const BATTLE_TIME = 99;

export const TIME_DELAY = 40 * FRAME_TIME;
export const TIME_FLASH_DELAY = 3 * FRAME_TIME;
export const TIME_FRAME_KEYS = ['time', 'time-flash'];

export const KO_FLASH_DELAY = [4 * FRAME_TIME, 7 * FRAME_TIME];
export const KO_FLASH_KEYS = ['ko-white', 'ko-black'];

export const LOGO_FLASH_DELAY = [100 * FRAME_TIME, 20 * FRAME_TIME];

export const HEALTH_MAX_HIT_POINTS = 200;

const HEALTH_CRITICAL_HIT_POINTS_PERCENTAGE = 0.4;

export const HEALTH_CRITICAL_HIT_POINTS =
	HEALTH_CRITICAL_HIT_POINTS_PERCENTAGE * HEALTH_MAX_HIT_POINTS;

export const HEALTH_COLOR = '#f3f300'; //Not being used
export const HEALTH_DAMAGE_COLOR = '#f30000';

export const HIT_SPLASH_RANDOMNESS = 10;

export const DRAW_DEBUG = false;
