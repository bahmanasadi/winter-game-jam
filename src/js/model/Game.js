/* jshint node: true */
'use strict';

var _ = require('lodash'),
	Player = require('../model/Player.js');

var Game = function () {
	this.player = new Player();
};
_.extend(Game.prototype, {
	timeLeft: 0,		// seconds
	player: undefined,  // Player
	scene: undefined,	// Scene
	obstacles: [],		// Obstacle
});

module.exports = Game;