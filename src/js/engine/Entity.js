/* jshint node: true */
'use strict';

var _ = require('lodash');

var Entity = function (attributes) {
	_.extend(this, attributes);
};
_.extend(Entity.prototype, {
	zIndex: 		0,
	position: 	{x:0, y:0},
	acceleration: {x:0, y:0},
	velocity: 	{x:0, y:0},
	render: function (time, context) {
		var pos = this.absolute();
		if (this.sprite) { this.sprite.render(context, pos); }
	},
	absolute: function () {
		return { x: 0, y: 0, width: 64, height: 64 };
	}
});

module.exports = Entity;