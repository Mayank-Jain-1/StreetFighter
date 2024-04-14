import { GLOBAL_VOLUME } from '../constants/sounds.js';

export const playSound = (sound, volume = GLOBAL_VOLUME) => {
	sound.volume = volume;
	if (!sound.paused && sound.currentTime > 0) {
		sound.currentTime = 0;
		sound.play();
	} else {
		sound.play();
	}
};

export const stopSound = (sound) => {
	sound.pause();
	sound.currentTime = 0;
};
