/* jshint node: true */
'use strict';

var _ = require('lodash'),
	Sprite = require('../engine/Sprite.js'),
	resources = require('../engine/resources.js');

var TextSprite = function () {
	Sprite.apply(this, arguments);
	this.image = resources.get(this.url);
};

_.extend(TextSprite.prototype, Sprite.prototype, {
	text: '',
	render: function (context, pos) {
		context.font = (10 * context.scaleFactor) + 'px "Press Start 2P"';
		context.textAlign = 'center';
		context.fillStyle = 'black';
		context.fillText(this.text, pos.x + context.scaleFactor, pos.y + context.scaleFactor);
		context.fillStyle = this.fill;
		context.fillText(this.text, pos.x, pos.y);
	}
});

module.exports = TextSprite;