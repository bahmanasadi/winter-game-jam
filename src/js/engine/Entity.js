/* jshint node: true */
'use strict';

var _ = require('lodash');

var Entity = function (attributes) {
	_.extend(this, {
		zIndex: 0,
		position: {x:0, y:0},
		acceleration: {x:0, y:0},
		velocity: {x:0, y:0},
		size: {x:0, y:0},
		floorcollision: false,
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
		if (this.floorcollision && (this.position.y-this.size.y/2) < 0) {
			this.velocity.y = 0;
		}
	},
	absolute: function (context) {
		var sf = context.scaleFactor;
		return {
			x: Math.round((this.position.x + this.layer.position.x - this.size.x / 2)) * sf,
			y: Math.round((160 - this.position.y + this.layer.position.y - this.size.y / 2)) * sf,
			width: Math.round(this.size.x) * sf, 
			height: Math.round(this.size.y) * sf
		};
	}
});

module.exports = Entity;