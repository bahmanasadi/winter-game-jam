/* jshint node: true */
'use strict';

var $ = require('jquery'),
	App = require('./model/App.js');

var app = new App({ width: 256, height: 160 });

$(function () {
	console.log('ready');
	require('requestanimationframe');
	app.setup().then(function () {
		app.game();
	});
});