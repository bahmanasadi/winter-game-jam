"use strict";

if (!gc) {
	window.gc = {};
}

gc.engines = (function () {
	
	var Scene = Backbone.Model.extend({
		layers: [],

		initialize: function() {
		}
	});

	var Entity = Backbone.Model.extend({
		zIndex: 		0,
		position: 	{x:0, y:0},
		acceleration: {x:0, y:0},
		velocity: 	{x:0, y:0},

		initialize: function() {
		}
	});

	var BaseLayer = Backbone.Model.extend({
		entities: [],			// (big ben, millenium wheel)
		positionMutiplier: 0,	// (position is the player position * positionMultiplier)

		initialize: function() {
		}
	});

	return {
		Scene 		: Scene,
		Entity 		: Entity,
		BaseLayer 	: BaseLayer
	};

});