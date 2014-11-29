/* jshint node: true */
'use strict';

var _ = require('lodash');

// Instances
// SkyLayer - tiled background image, e.g. gradient dark sky, clouds, moon, stars - procedurally placed
// BackgroundLayer - big ben, millenium wheel
// ForegroundLayer - player
var Layer = function (attributes) {
	_.extend(this, attributes);
	this.entities = [];
};
_.extend(Layer.prototype, {
	positionMutiplier: 0,	// (position is the player position * positionMultiplier)
	zIndex: 0,
	render: function (time, context) {
		this.entities.forEach(function (entity) { entity.render(time, context); });
	}
});

module.exports = Layer;