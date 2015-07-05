/* jshint node: true */
'use strict';

var _ = require('lodash');

var Player = function (attributes) {
	this.score = 0;
	_.extend(this, attributes);
};
_.extend(Player.prototype, {
});

module.exports = Player;