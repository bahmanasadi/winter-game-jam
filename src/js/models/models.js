/* jshint node: true */
'use strict';

var Backbone = require('backbone'),
	engines = require('../engines/engines.js');

var Game = Backbone.Model.extend({
	timeLeft: 0,		// seconds
	player: undefined,  // Player
	scene: undefined,	// Scene
	obstacles: [],		// Obstacle
	menuUI: undefined, 	// MenuUI
	gameUI: undefined, 	// GameUI
	pauseUI: undefined, 	// PauseUI

	initialize: function() {

	},
	setup: function () {
		var canvas = document.createElement('canvas');
		canvas.width = this.get('width');
		canvas.height = this.get('height');
		document.body.appendChild(canvas);
		this.context = canvas.getContext('2d');
		//canvas.onclick = click;
		this.GameUI = new engines.UIScreen({ context: this.context });
		this.MenuUI = new engines.UIScreen({ context: this.context });
		this.PauseUI = new engines.UIScreen({ context: this.context });
	},
	pause: function () {

	},
	menu: function () {
		
	},
	game: function () {
		var player = new Player();
		
	}

});

var Player = Backbone.Model.extend({
	entity: undefined,

	initialize: function() {
	}
});

module.exports = {
	Game		: Game,
	Player 		: Player
};
