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
		context.font = '20px "Press Start 2P"';
		context.fillStyle = this.fill;
		context.textAlign = 'center'; 
		context.fillText(this.text, pos.x, pos.y);
	}
});

module.exports = TextSprite;