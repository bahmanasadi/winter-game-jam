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
		context.save();
		context.translate(pos.x, pos.y);
		if (this.rotation) {
			context.rotate(this.rotation || 0);
		}
		if (this.animate) {
			context.drawImage(this.image, 
				this.currentFrame * this.animate.slice.x, 0, this.animate.slice.x, this.animate.slice.y,
				0, 0, pos.width, pos.height);
		} else {
			context.drawImage(this.image, 0, 0, pos.width, pos.height);
		}
		context.restore();
	}
});

module.exports = ImageSprite;