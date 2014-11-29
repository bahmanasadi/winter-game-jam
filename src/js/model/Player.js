/* jshint node: true */
'use strict';

var _ = require('lodash');

var Player = function (attributes) {
	_.extend(this, attributes);
};
_.extend(Player.prototype, {
});

module.exports = Player;