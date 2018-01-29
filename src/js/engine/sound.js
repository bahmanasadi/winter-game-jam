const soundCache = {};
const musicCache = {};

const load = (id, url, music) => {
	var cache = music ? musicCache : soundCache;
	return new Promise(function (resolve, reject) {
		cache[id] = new Audio(url);
		console.log('GET', url);
		cache[id].addEventListener('canplaythrough', function () {
			resolve();
		});
		cache[id].onerror = function () {
			reject();
		};
	});
};

const play = id => {
	console.log('sound', id);
	soundCache[id].play();	
};

const music = id => {
	console.log('music', id);
	Object.entries(musicCache).forEach(([i, audio]) => {
		if (id === i) {
			console.log('play');
			audio.play();
		} else {
			audio.pause();
			audio.currentTime = 0;
		}
	});
};

export default { load, play, music };