/* jshint node: true */
'use strict';

var _ = require('lodash'),
	resources = require('../engine/resources.js');

var Sprite = function (attributes) {
	_.extend(this, attributes);
	this.image = resources.get(this.url);
	console.log(this.image);
};

_.extend(Sprite.prototype, {
	type: undefined, //"image", "animation", "text"
	url: undefined,
	animation : undefined,
	text: '',
	render: function (context, pos) {
		if (this.image) {
			if (pos.crop) {
				context.drawImage(this.image, 
					pos.crop.x, pos.crop.y, pos.crop.width, pos.crop.height,
					pos.x, pos.y, pos.width, pos.height);
			} else {
				context.drawImage(this.image, pos.x, pos.y, pos.width, pos.height);
			}
		}
		if (this.gradient) {

		}
		if (this.text) {

		}
	}
});

module.exports = Sprite;