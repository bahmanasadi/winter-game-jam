/* jshint node: true */
'use strict';

var _ = require('lodash'),
	Entity = require('../engine/Entity.js');

// Instances
// SkyLayer - tiled background image, e.g. gradient dark sky, clouds, moon, stars - procedurally placed
// BackgroundLayer - big ben, millenium wheel
// ForegroundLayer - player
var Layer = function () {
	Entity.apply(this, arguments);
	this.entities = [];
	this.pause = false;
	this.gameover = false;
};
_.extend(Layer.prototype, Entity.prototype, {
	positionMutiplier: 0,	// (position is the player position * positionMultiplier)
	zIndex: 0,
	render: function (time, context) {
		var that = this;
		this.entities.forEach(function (entity) { 
			// Overwrite outer variable time
			if (entity.type === Entity.prototype.types.player && that.gameover) {

			} else if (that.pause) {
				time = 0;
			} else if (that.gameover) {
				time = 0;
			} else {
			}
			entity.render(time, context); 
		});
		this.animate(time);
	},
	add: function (entity) {
		entity.layer = this;
		this.entities.push(entity);
	},
	remove: function (entity) {
		entity.layer = undefined;
		_.remove(this.entities, function (e) { return e == entity; } );
	}
});

module.exports = Layer;