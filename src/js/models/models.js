/* jshint node: true */
'use strict';

var Backbone = require('backbone');

var Game = Backbone.Model.extend({
	timeLeft: 0,
	player: undefined,
	scene: undefined,
	obstacles: [],

	initialize: function() {

	},
	setup: function () {
		var canvas = document.createElement('canvas');
		canvas.width = this.get('width');
		canvas.height = this.get('height');
		document.body.appendChild(canvas);
		this.ctx = canvas.getContext('2d');
		//canvas.onclick = click;
	},
	pause: function () {

	},
	menu: function () {
		
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
