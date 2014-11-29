/* jshint node: true */
'use strict';

var Backbone = require('backbone'),
	engines = require('../engines/engines.js');

var App = Backbone.Model.extend({
	ui: undefined,
	setup: function () {
		var canvas = document.createElement('canvas');
		canvas.width = this.get('width');
		canvas.height = this.get('height');
		document.body.appendChild(canvas);
		this.context = canvas.getContext('2d');
		//canvas.onclick = click;
	},
	pause: function () {
		var pauseUI = new engines.UIScreen({ context: this.context });
	},
	menu: function () {
		var menuUI = new engines.UIScreen({ context: this.context });
	},
	game: function () {
		var gameUI = new engines.UIScreen({ context: this.context }),
			scene = new engines.Scene(),
			ePlayer = new engines.Entity(),
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
		if (this.ui) { this.ui.render(); }
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
