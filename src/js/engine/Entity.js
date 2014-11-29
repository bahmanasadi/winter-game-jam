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
		var pos = this.absolute(context);
		if (this.sprite) { this.sprite.render(context, pos); }
	},
	absolute: function (context) {
		var sf = context.scaleFactor;
		return {
			x: (this.position.x - this.size.x / 2) * sf,
			y: (160 - this.position.y - this.size.y / 2) * sf,
			width: this.size.x * sf, 
			height: this.size.y * sf
		};
	}
});

module.exports = Entity;