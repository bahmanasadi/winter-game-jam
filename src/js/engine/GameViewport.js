/* jshint node: true */
'use strict';

var _ = require('lodash'),
	Viewport = require('../engine/Viewport.js'),
	Entity = require('../engine/Entity.js'),
	Layer = require('../engine/Layer.js'),
	Sprite = require('../engine/Sprite.js');

// Instances
// GameUI
// MenuUI
// PauseUI
var GameViewport = function (attributes) {
	Viewport.apply(this, attributes); // super()

	var sprites = {
		idle: new Sprite({
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
		})
	};
	
	this.layers[2].entities.push(this.entities.player);
};

_.extend(GameViewport.prototype, Viewport.prototype, {
	click: function () {
		console.log('jump!')
		this.entities.player.velocity = { y: 150 };
		this.entities.player.acceleration = { y: -300 };
	}
});

module.exports = GameViewport;