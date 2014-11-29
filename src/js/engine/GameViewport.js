/* jshint node: true */
'use strict';

var _ = require('lodash'),
	Viewport = require('../engine/Viewport.js'),
	Entity = require('../engine/Entity.js'),
	Layer = require('../engine/Layer.js'),
	ImageSprite = require('../engine/ImageSprite.js'),
	TextSprite = require('../engine/TextSprite.js'),
	RectangleSprite = require('../engine/RectangleSprite.js'),
	Generator = require('../generator.js');

// Instances
// GameUI
// MenuUI
// PauseUI
var GameViewport = function () {
	Viewport.apply(this, arguments); // super()

	var that = this;

	var sprites = {
		sky: new RectangleSprite({
			fill: '#0B4B97'
		}),
		idle: new ImageSprite({
			url: 'img/sprites/s_idle.png'
		}),
		run: new ImageSprite({
			url: 'img/sprites/s_run.png',
			animate: {
				speed: 10, // fps
				slice: { x: 23, y: 32 }
			}
		}),
		house1: new ImageSprite({
			url: 'img/sprites/house1.png'
		}),
		cloud1: new ImageSprite({
			url: 'img/sprites/cloud1.png'
		}),
		timeLeft: new TextSprite({
			text: '01:00',
			fill: 'white'
		})
		
		//jump: new Sprite({}),
		//tumble: new Sprite({})
	};

	var baseSpeed = 30,
		baseAccelaration = 10;
	this.layers = [
		new Layer({
			position: { x: 0, y: 0 }
		}), // sky
		new Layer({
			position: { x: 0, y: 0 },
			velocity: { x: -baseSpeed / 4 },
			acceleration: { x: -baseAccelaration / 4 }
		}), // clouds
		new Layer({
			position: { x: 0, y: 0 },
			velocity: { x: -baseSpeed / 2 },
			acceleration: { x: -baseAccelaration / 2 }
		}), // background -- landmarks
		new Layer({
			position: { x: 0, y: 0 },
			velocity: { x: -baseSpeed },
			acceleration: { x: -baseAccelaration }
		}), // foreground -- player + obstacles
		new Layer({
			position: { x: 0, y: 0 }
		}) // ui
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
	
	// this.layers[3].entities.push(eCloud);
	// this.layers[3].entities.push(eHouse);
	// this.layers[3].entities.push(ePlayer);
	this.entities = {
		player: new Entity({
			sprite: sprites.run,
			position: { x: 20, y: 20 },
			size: { x: 18, y: 32 },
			velocity: { x: -this.layers[3].velocity.x },
			acceleration: { x: -this.layers[3].acceleration.x },
			floorcollision: true
		}),
		sky: new Entity({
			sprite: sprites.sky,
			position: { x: 128, y: 80 },
			size: { x: 256, y: 160 }
		}),
		timeLeft: new Entity({
			sprite: sprites.timeLeft,
			position: { x: 128, y: 140 },
			size: { x: 0, y: 0 }
		})
	};
	
	this.layers[0].add(this.entities.sky);
	this.layers[3].add(this.entities.player);

	var obstacles = Generator.GenerateEntity([sprites.house1], 1000.0);
	_.each(obstacles, function (entity) {
		that.layers[3].add(entity);
	});

	var clouds = Generator.GenerateEntity([sprites.cloud1], 1000.0, 160);
	_.each(clouds, function (entity) {
		// that.layers[2].add(entity);
	});

	var clouds2 = Generator.GenerateEntity([sprites.cloud1], 1000.0, 160);
	_.each(clouds2, function (entity) {
		// that.layers[1].add(entity);
	});

	that.layers[4].add(this.entities.timeLeft);
};

_.extend(GameViewport.prototype, Viewport.prototype, {
	click: function () {
		// console.log('jump!');
		this.entities.player.velocity.y = 150;
		this.entities.player.acceleration.y = -300;
	}
});

module.exports = GameViewport;