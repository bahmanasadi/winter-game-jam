"use strict";

if (!gc) {
	window.gc = {};
}

gc.models = (function () {

	var Game = Backbone.Model.extend({
		timeLeft: 0,		// seconds
		player: undefined,  // Player
		scene: undefined,	// Scene
		obstacles: [],		// Obstacle
		menuUI: undefined 	// MenuUI
		gameUI: undefined 	// GameUI
		pauseUI: undefined 	// PauseUI

		initialize: function() {
		}

	});

	var Player = Backbone.Model.extend({
		entity: undefined,

		initialize: function() {
		}
	});

	return {
		Game		: Game,
		Player 		: Player
	};

}) ();