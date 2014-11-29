/* jshint node: true */
'use strict';

var _ = require('lodash'),
	Sprite = require('../engine/Sprite.js'),
	resources = require('../engine/resources.js');

var ImageSprite = function () {
	Sprite.apply(this, arguments);
	console.log(this.url);
	this.image = resources.get(this.url);
};

_.extend(ImageSprite.prototype, Sprite.prototype, {
	url: undefined,
	animation : undefined,
	render: function (context, pos) {
		if (pos.crop) {
			context.drawImage(this.image, 
				pos.crop.x, pos.crop.y, pos.crop.width, pos.crop.height,
				pos.x, pos.y, pos.width, pos.height);
		} else {
			context.drawImage(this.image, pos.x, pos.y, pos.width, pos.height);
		}
	}
});

module.exports = ImageSprite;