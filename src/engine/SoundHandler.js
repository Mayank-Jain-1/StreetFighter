import { GLOBAL_VOLUME } from '../constants/sounds.js';

//[FIXED] using https://stackoverflow.com/questions/36803176/how-to-prevent-the-play-request-was-interrupted-by-a-call-to-pause-error TODO: Proabably there is a race condition between play() and pause() giving error 'The play() request was interrupted by a call to pause()' in the consol.

export const playSound = (sound, volume = GLOBAL_VOLUME) => {
	sound.volume = volume;
	if (
		!sound.paused &&
		sound.currentTime > 0 &&
		!sound.ended &&
		sound.readyState > sound.HAVE_CURRENT_DATA
	) {
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
