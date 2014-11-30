/* jshint node: true */
'use strict';

var _ = require('lodash'),
	BBPromise = require('bluebird');

// Instances
// GameUI
// MenuUI
// PauseUI
var sound = {
	_soundCache: {},
	_musicCache: {},
	load: function (id, url, music) {
		var cache = music ? this._musicCache : this._soundCache;
		return new BBPromise(function (resolve, reject) {
			cache[id] = new Audio(url);
			console.log('GET', url);
			cache[id].addEventListener('canplaythrough', function () {
				resolve();
			});
			cache[id].onerror = function () {
				reject();
			};
		});
	},
	play: function (id) {
		console.log('sound', id);
		this._soundCache[id].play();	
	},
	music: function (id) {
		console.log('music', id);
		_.each(this._musicCache, function (audio, i) {
			if (id === i) {
				console.log('play')
				audio.play();
			} else {
				audio.pause();
				audio.currentTime = 0;
			}
		});
	}
};

module.exports = sound;