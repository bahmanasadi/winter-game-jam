/* jshint node: true */
'use strict';

var _ = require('lodash');

var Entity = function (attributes) {
	_.extend(this, {
		zIndex: 0,
		position: {x:0, y:0},
		acceleration: {x:0, y:0},
		velocity: {x:0, y:0}
	}, attributes);
};
_.extend(Entity.prototype, {
	render: function (time, context) {
		var pos = this.absolute(context);
		if (this.sprite) { this.sprite.render(context, pos); }
		this.animate(time);
	},
	animate: function (time) {
		this.position.x += (this.velocity.x || 0) * time;
		this.position.y += (this.velocity.y || 0) * time;
		this.velocity.x += (this.acceleration.x || 0) * time;
		this.velocity.y += (this.acceleration.y || 0) * time;
	},
	absolute: function (context) {
		var sf = context.scaleFactor;
		return {
			x: Math.ceil((this.position.x + this.layer.position.x - this.size.x / 2) * sf),
			y: Math.ceil((160 - this.position.y + this.layer.position.y - this.size.y / 2) * sf),
			width: Math.ceil(this.size.x * sf), 
			height: Math.ceil(this.size.y * sf)
		};
	}
});

module.exports = Entity;