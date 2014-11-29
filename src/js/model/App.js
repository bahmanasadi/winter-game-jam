/* jshint node: true */
'use strict';

var _ = require('lodash'),
	GameViewport = require('../engine/GameViewport.js'),
	Game = require('../model/Game.js'),
	resources = require('../engine/resources.js');

var App = function (attributes) {
	_.extend(this, attributes);
};
_.extend(App.prototype, {
	ui: undefined,
	setup: function () {
		var that = this;
		console.log('setup');
		var canvas = document.createElement('canvas');
		canvas.width = this.width;
		canvas.height = this.height;
		document.body.appendChild(canvas);
		this.context = canvas.getContext('2d');
		//canvas.onclick = click;

		resources.load([
			'img/sprites/s_idle.png'
		]).then(function () {
			console.log('loaded resources');
			that.render();
		});	
	},
	pause: function () {
		//var pauseVp = new Viewport();
	},
	menu: function () {
		//var menuVp = new Viewport();
	},
	game: function () {
		var game = new Game(),
			viewport = new GameViewport({ game: game });
		this.setViewport(viewport);
	},
	setViewport: function (viewport) {
		if (this.viewport) { this.viewport.destroy(); }
		this.viewport = viewport;
	},
	render: function () {
		var that = this;
		this.context.clearRect(0, 0, this.width, this.height);
		this.viewport.render(undefined, this.context);
		requestAnimationFrame(function () { that.render(); });
	}
});

module.exports = App;