/* jshint node: true */
'use strict';

var $ = require('jquery'),
	models = require('./models/models.js');

require('requestanimationframe');


var app = new models.App({ width: 256, height: 160 });

$(function () {
	console.log('ready')
	app.setup();
	app.game();
});
