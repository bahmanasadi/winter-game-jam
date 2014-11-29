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
};
_.extend(Layer.prototype, Entity.prototype, {
	positionMutiplier: 0,	// (position is the player position * positionMultiplier)
	zIndex: 0,
	render: function (time, context) {
		this.entities.forEach(function (entity) { entity.render(time, context); });
		this.animate(time);
	},
	add: function (entity) {
		entity.layer = this;
		this.entities.push(entity);
	}
});

module.exports = Layer;