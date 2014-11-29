/* jshint node: true */
'use strict';

var _ = require('lodash'),
	Viewport = require('../engine/Viewport.js'),
	Entity = require('../engine/Entity.js'),
	Layer = require('../engine/Layer.js'),
	ImageSprite = require('../engine/ImageSprite.js'),
	RectangleSprite = require('../engine/RectangleSprite.js');

// Instances
// GameUI
// MenuUI
// PauseUI
var GameViewport = function (attributes) {
	Viewport.apply(this, arguments); // super()

	var sprites = {
		sky: new RectangleSprite({
			fill: '#0D0D31'
		}),
		idle: new ImageSprite({
			url: 'img/sprites/s_idle.png'
		}),
		//run: new Sprite({}),
		//jump: new Sprite({}),
		//tumble: new Sprite({})
	};

	this.layers = [
		new Layer(), // sky
		new Layer(), // background -- landmarks
		new Layer()  // foreground -- player + obstacles
	];

	this.entities = {
		player: new Entity({
			sprite: sprites.idle,
			position: { x: 20, y: 20 },
			size: { x: 18, y: 32 }
		}),
		sky: new Entity({
			sprite: sprites.sky,
			position: { x: 128, y: 80 },
			size: { x: 256, y: 160 }
		})
	};
	
	this.layers[0].entities.push(this.entities.sky);
	this.layers[2].entities.push(this.entities.player);
};

_.extend(GameViewport.prototype, Viewport.prototype, {
	click: function () {
		console.log('jump!');
		this.entities.player.velocity = { y: 150 };
		this.entities.player.acceleration = { y: -300 };
	}
});

module.exports = GameViewport;