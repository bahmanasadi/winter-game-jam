"use strict";

if (!gc) {
	window.gc = {};
}

gc.models = (function () {

	var Game = Backbone.Model.extend({
		timeLeft: 0,
		player: undefined,
		scene: undefined,
		obstacles: [],

		initialize: function() {
		}

	});

	var Player = Backbone.Model.extend({
		entity: undefined,

		initialize: function() {
		}
	});

	var Sprite = Backbone.Model.extend({
		url: undefined,
		animation : undefined,

		initialize: function () {

		}
	});

	return {
		Game		: Game,
		Player 		: Player,
		Sprite 		: Sprite
	};

}) ();