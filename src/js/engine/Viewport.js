/* jshint node: true */
'use strict';

var _ = require('lodash'),
	Generator = require('../generator.js');

// Instances
// GameUI
// MenuUI
// PauseUI
var Viewport = function (attributes) {
	_.extend(this, attributes);
	this.layers = [];
};

_.extend(Viewport.prototype, {
	render: function (time, context) {
		var collidedEntity = Generator.DetectCollision(this.entities.player, this.layers[2].entities);
		if (collidedEntity) {
			console.log("Collision Detected!!!!!! YOU LOST");
		}
		this.layers.forEach(function (layer) { layer.render(time, context); });
	},
	click: function () {}
});

module.exports = Viewport;
