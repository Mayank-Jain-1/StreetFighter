export const playSound = (sound, volume = 1) => {
	sound.volume = volume;
	console.log(sound.paused);
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
