/* jshint node: true */
'use strict';

var Backbone = require('backbone'),
	BBPromise = require('bluebird'),
	engines = require('../engines/engines.js');

var resources = {
	_cache: {},
	// Load an image url or an array of image urls
	get: function (url) {
		if (url instanceof Array) {
			return BBPromise.all(url.map(resources.load));
		}

		return new BBPromise(function (resolve, reject) {
			if (resources._cache[url]) {
				resolve(resources._cache[url]);
			} else {
				var img = new Image();
				img.onload = function () {
					resources._cache[url] = img;
					resolve(img);
				};
				img.onerror = function () {
					reject();
				};
				img.src = url;
			}
		});
    }
};


var App = Backbone.Model.extend({
	ui: undefined,
	setup: function () {
		var canvas = document.createElement('canvas');
		canvas.width = this.get('width');
		canvas.height = this.get('height');
		document.body.appendChild(canvas);
		this.context = canvas.getContext('2d');
		//canvas.onclick = click;

		this.sprites = {
			sIdle: engines.Sprite({
				type: 'image',
				url: 'img/sprites/s_idle.png'
			})
		};

		BBPromise.all(this.sprites.map(function (sprite) { 
			return sprite.load();
		})).then(function () {
			this.render();
		});	
	},
	pause: function () {
		var pauseUI = new engines.UIScreen();
	},
	menu: function () {
		var menuUI = new engines.UIScreen();
	},
	game: function () {
		var gameUI = new engines.UIScreen(),
			scene = new engines.Scene(),
			ePlayer = new engines.Entity({
				sprite: sprites.sIdle,
				position: { x: 0, y: 0 },
				scale: { x: 0.2, y: 0.2 }
			}),
			game = new Game();
		scene.entities.push(ePlayer);
		gameUI.scene = gameUI;
		gameUI.draw();
		this.setUI(gameUI);
	},
	setUI: function (ui) {
		if (this.ui) { this.ui.destroy(); }
		this.ui = ui;
	},
	render: function () {
		if (this.ui) { this.ui.render(undefined, this.context); }
		requestAnimationFrame(this.render);
	}
});

var Game = Backbone.Model.extend({
	timeLeft: 0,		// seconds
	player: undefined,  // Player
	scene: undefined,	// Scene
	obstacles: [],		// Obstacle
	initialize: function () {
		this.player = new Player();
	},
	setup: function () {

	},
	game: function () {
		
	}
})

var Player = Backbone.Model.extend({
	entity: undefined,

	initialize: function() {
	}
});

module.exports = {
	Game		: Game,
	Player 		: Player
};
