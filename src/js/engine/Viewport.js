/* jshint node: true */
'use strict';

var _ = require('lodash');

// Instances
// GameUI
// MenuUI
// PauseUI
var Viewport = function (attributes) {
	_.extend(this, attributes);
	this.layers = {};
	this.pause = false;
	this.gameover = false;
};

_.extend(Viewport.prototype, {
	render: function (time, context) {
		var that = this;
		_.values(this.layers).forEach(function (layer) { 
			layer.pause = that.pause;
			layer.gameover = that.gameover;
			layer.render(time, context); 
		});
	},
	click: function () {}
});

module.exports = Viewport;
