/* jshint node: true */
'use strict';

var _ = require('lodash'),
	Sprite = require('../engine/Sprite.js');

var RectangleSprite = function () {
	Sprite.apply(this, arguments);
};

_.extend(RectangleSprite.prototype, Sprite.prototype, {
	render: function (context, pos) {
		context.fillStyle = this.fill;
		context.fillRect(pos.x, pos.y, pos.width, pos.height);
	}
});

module.exports = RectangleSprite;