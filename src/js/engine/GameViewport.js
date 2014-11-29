/* jshint node: true */
'use strict';

var _ = require('lodash'),
	Viewport = require('../engine/Viewport.js'),
	Entity = require('../engine/Entity.js'),
	Layer = require('../engine/Layer.js'),
	ImageSprite = require('../engine/ImageSprite.js'),
	RectangleSprite = require('../engine/RectangleSprite.js'),
	Generator = require('../generator.js');

// Instances
// GameUI
// MenuUI
// PauseUI
var GameViewport = function () {
	Viewport.apply(this, arguments); // super()

	var sprites = {
		sky: new RectangleSprite({
			fill: '#0D0D31'
		}),
		idle: new ImageSprite({
			url: 'img/sprites/s_idle.png'
		}),
		house1: new ImageSprite({
			url: 'img/sprites/house1.png'
		}),
		cloud1: new ImageSprite({
			url: 'img/sprites/cloud1.png'
		})
		//run: new Sprite({}),
		//jump: new Sprite({}),
		//tumble: new Sprite({})
	};

	this.layers = [
		new Layer(), // sky
		new Layer(), // background -- landmarks
		new Layer({
			position: { x: 0, y: 0 },
			velocity: { x: -30 },
			acceleration: { x: -10 }
		})  // foreground -- player + obstacles
	];


	var eHouse = new Entity({
		sprite: sprites.house1,
		position: {x: 25, y: 60},
		size: {x: 50, y: 44}
	});

	var eCloud = new Entity({
		sprite: sprites.cloud1,
		position: {x: 25, y: 100},
		size: {x: 50, y: 15}
	});
	
	// this.layers[2].entities.push(eCloud);
	// this.layers[2].entities.push(eHouse);
	// this.layers[2].entities.push(ePlayer);
	this.entities = {
		player: new Entity({
			sprite: sprites.idle,
			position: { x: 20, y: 20 },
			size: { x: 18, y: 32 },
			velocity: { x: -this.layers[2].velocity.x },
			acceleration: { x: -this.layers[2].acceleration.x },
		}),
		sky: new Entity({
			sprite: sprites.sky,
			position: { x: 128, y: 80 },
			size: { x: 256, y: 160 }
		})
	};
	
	this.layers[0].add(this.entities.sky);
	this.layers[2].add(this.entities.player);

	var obstacles = Generator.GenerateEntity([sprites.house1, sprites.cloud1], 1000.0);
	var that = this;
	_.each(obstacles, function (entity) {
		that.layers[2].add(entity);
	});
};

_.extend(GameViewport.prototype, Viewport.prototype, {
	click: function () {
		// console.log('jump!');
		this.entities.player.velocity.y = 150;
		this.entities.player.acceleration.y = -300;
	}
});

module.exports = GameViewport;