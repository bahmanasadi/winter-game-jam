/* jshint node: true */
'use strict';

var _ = require('lodash'),
	Sprite = require('../engine/Sprite.js'),
	resources = require('../engine/resources.js');

var ImageSprite = function () {
	Sprite.apply(this, arguments);
	var that = this;
	this.image = resources.get(this.url);
	if (this.animate) {
		this.frameCount = Math.floor(this.image.width / this.animate.slice.x);
		this.currentFrame = 0;
		setInterval(function () {
			that.currentFrame++;
			if (that.currentFrame === that.frameCount) {
				that.currentFrame = 0;
			}
		}, (1 / this.animate.speed) * 1000);
	}
};

_.extend(ImageSprite.prototype, Sprite.prototype, {
	url: undefined,
	animation : undefined,
	render: function (context, pos) {
		if (this.animate) {
			context.drawImage(this.image, 
				this.currentFrame * this.animate.slice.x, 0, this.animate.slice.x, this.animate.slice.y,
				pos.x, pos.y, pos.width, pos.height);
		} else {
			context.drawImage(this.image, pos.x, pos.y, pos.width, pos.height);
		}
	}
});

module.exports = ImageSprite;