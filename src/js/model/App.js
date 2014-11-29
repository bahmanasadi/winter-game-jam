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
		var canvas = this.canvas = document.createElement('canvas');
		document.body.appendChild(canvas);

		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		
		this.context = canvas.getContext('2d');
		this.context.imageSmoothingEnabled = false;

		this.context.scaleFactor = canvas.width / this.width;
		
		canvas.onclick = function (e) {
			console.log('click', e);
			if (that.viewport) { that.viewport.click(e.x, e.y); }
		};

		return resources.load([
			'img/sprites/s_idle.png',
			'img/sprites/house1.png',
			'img/sprites/cloud1.png'
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
	_lastTime: Date.now(),
	render: function () {
		var that = this,
			time = Date.now(),
			timeDiff = (time - this._lastTime) / 1000;
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		if (this.viewport) { this.viewport.render(timeDiff, this.context); }
		this._lastTime = time;
		requestAnimationFrame(function () { that.render(); });
	}
});

module.exports = App;