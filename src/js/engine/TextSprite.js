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
		context.font = '20px Arial';
		context.fillStyle = 'black';
		context.fillText(this.text, pos.x, pos.y);
	}
});

module.exports = TextSprite;