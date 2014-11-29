/* jshint node: true */
'use strict';

var _ = require('lodash');

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
		this.layers.forEach(function (layer) { layer.render(time, context); });
	}
});

module.exports = Viewport;
