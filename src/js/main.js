/* jshint node: true */
'use strict';

var $ = require('jquery'),
	BBPromise = require('bluebird'),
	_ = require('lodash'),
	models = require('./models/models.js');

require('requestanimationframe');


var game = new models.Game({ width: 256, height: 160 });

$(function () {
	game.setup();
	game.menu();
});
