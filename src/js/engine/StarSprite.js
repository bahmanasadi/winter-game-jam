/* jshint node: true */
'use strict';

var _ = require('lodash'),
	Sprite = require('../engine/Sprite.js');

var RectangleSprite = function () {
	Sprite.apply(this, arguments);
};

_.extend(RectangleSprite.prototype, Sprite.prototype, {
	render: function (context, pos) {
		var u = context.scaleFactor;
		context.fillStyle = this.fill;
		context.globalAlpha = 0.6;
		context.fillRect(pos.x, pos.y, pos.width, pos.height);
		context.globalAlpha = 0.2;
		context.fillRect(pos.x, pos.y + u, pos.width, pos.height);
		context.fillRect(pos.x + u, pos.y, pos.width, pos.height);
		context.fillRect(pos.x, pos.y - u, pos.width, pos.height);
		context.fillRect(pos.x - u, pos.y, pos.width, pos.height);
		context.globalAlpha = 1;
	}
});

module.exports = RectangleSprite;