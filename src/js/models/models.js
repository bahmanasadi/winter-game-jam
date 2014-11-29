/* jshint node: true */
'use strict';

var Backbone = require('backbone'),
	_ = require('lodash'),
	BBPromise = require('bluebird'),
	engines = require('../engines/engines.js');

var App = Backbone.Model.extend({
	ui: undefined,
	initialize: function (options) {
		this.width = options.width;
		this.height = options.height;
	},
	setup: function () {
		var that = this;
		console.log('setup');
		var canvas = document.createElement('canvas');
		canvas.width = this.get('width');
		canvas.height = this.get('height');
		document.body.appendChild(canvas);
		this.context = canvas.getContext('2d');
		//canvas.onclick = click;

		this.sprites = {
			sIdle: new engines.Sprite({
				type: 'image',
				url: 'img/sprites/s_idle.png'
			})
		};

		BBPromise.all(_(this.sprites).map(function (sprite) { 
			return sprite.load();
		})).then(function () {
			console.log('loaded sprites');
			that.render();
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
				sprite: this.sprites.sIdle,
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
	Player 		: Player,
	App : App
};
