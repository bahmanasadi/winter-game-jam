/* jshint node: true */
'use strict';

var _ = require('lodash');

var Sprite = function (attributes) {
	_.extend(this, attributes);
};

_.extend(Sprite.prototype, {});

module.exports = Sprite;