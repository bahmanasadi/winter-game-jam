/* jshint node: true */
'use strict';

var _ = require('lodash'),
	Viewport = require('../engine/Viewport.js'),
	Entity = require('../engine/Entity.js'),
	Layer = require('../engine/Layer.js'),
	ImageSprite = require('../engine/ImageSprite.js'),
	TextSprite = require('../engine/TextSprite.js'),
	RectangleSprite = require('../engine/RectangleSprite.js'),
	utils = require('../utils.js'),
	Generator = require('../engine/Generator.js'),
	BuildingGenerator = require('../engine/BuildingGenerator.js'),
	moment = require('moment');

// Instances
// GameUI
// MenuUI
// PauseUI
var GameViewport = function () {
	Viewport.apply(this, arguments); // super()

	var that = this;

	var sprites = this.sprites = {
		sky: new RectangleSprite({
			fill: '#0B4B97'
		}),
		star1: new RectangleSprite({
			fill: '#FFFFFF'
		}),
		star2: new RectangleSprite({
			fill: '#1F61B0'
		}),
		star3: new RectangleSprite({
			fill: '#CCCCCC'
		}),
		star4: new RectangleSprite({
			fill: '#EEEEEE'
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
		jump: new ImageSprite({
			url: 'img/sprites/s_jump.png',
			animate: {
				speed: 10, // fps
				slice: { x: 23, y: 32 },
				repeat: false
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

	var pad = function (n, size) {
		n = String(n).substr(0, size);
		var i = 0, 
			l = size - n.length;
		for (; i < l; i++) {
			n = '0' + n;
		}
		return n;
	};
	var startTime = Date.now();
	setInterval(function () {
		var duration = moment.duration(Date.now() - startTime, 'ms');
		sprites.timeLeft.text = pad(duration.minutes(), 2) + ':' + pad(duration.seconds(), 2) + '.' + pad(duration.milliseconds(), 1);
	}, 100);

	var baseSpeed = 100,
		baseAcceleration = 0.1;

	this.layers.sky = new Layer({
		position: { x: 0, y: 0 }
	}); // sky
	this.layers.bgFar = new Layer({
		position: { x: 0, y: 0 },
		velocity: { x: -baseSpeed / 8 },
		acceleration: { x: -baseAcceleration / 8 }
	}); // clouds
	this.layers.bgClose = new Layer({
		position: { x: 0, y: 0 },
		velocity: { x: -baseSpeed / 4 },
		acceleration: { x: -baseAcceleration / 4 }
	}); // background -- landmarks
	this.layers.fg = new Layer({
		position: { x: 0, y: 0 },
		velocity: { x: -baseSpeed },
		acceleration: { x: -baseAcceleration }
	}); // foreground -- player + obstacles
	this.layers.ui = new Layer({
		position: { x: 0, y: 0 }
	}); // ui

	this.entities = {
		player: new Entity({
			sprite: sprites.run,
			position: { x: 100, y: 120 },
			size: { x: 18, y: 32 },
			acceleration: { x: baseAcceleration, y: -300 },
			velocity: { x: baseSpeed, y: 0 },
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
	
	this.layers.sky.add(this.entities.sky);
	this.layers.fg.add(this.entities.player);
	that.layers.ui.add(this.entities.timeLeft);

	this.buildingGenerator = new BuildingGenerator({
		size: { x: 256, y: 160 }
	});
	that.layers.fg.add(this.buildingGenerator);

	this.starGenerator = new Generator({
		size: { x: 256, y: 160 },
		sprites: [sprites.star1, sprites.star2, sprites.star3, sprites.star4],
		entitySize: { x: 1, y: 1 },
		blockSize: { x: 5 },
		entityCount: { min: 13, max: 18 }
	});
	that.layers.sky.add(this.starGenerator);

	this.cloudGenerator1 = new Generator({
		size: { x: 256, y: 160 },
		sprites: [sprites.cloud1],
		entitySize: { x: 78, y: 40 },
		blockSize: { x: 256 },
		entityCount: { min: 3, max: 8 }
	});
	that.layers.bgFar.add(this.cloudGenerator1);

	this.cloudGenerator2 = new Generator({
		size: { x: 256, y: 160 },
		sprites: [sprites.cloud1],
		entitySize: { x: 46, y: 24 },
		blockSize: { x: 256 },
		entityCount: { min: 3, max: 8 }
	});
	that.layers.bgClose.add(this.cloudGenerator2);
};


_.extend(GameViewport.prototype, Viewport.prototype, {
	click: function () {
		console.log('jump!');
		this.entities.player.velocity.y = 150;
		this.entities.player.sprite = this.sprites.jump;
	},
	render: function () {
		Viewport.prototype.render.apply(this, arguments);

		var collidedEntity = utils.detectVerticalCollision(this.entities.player, this.layers.fg.entities);
		if (collidedEntity) {
			this.entities.player.velocity.y = 0;
			this.entities.player.position.y = collidedEntity.position.y + collidedEntity.size.y / 2 + this.entities.player.size.y / 2;
			console.log('Collision with ground');
		}
		collidedEntity = utils.detectHorizontalCollision(this.entities.player, this.layers.fg.entities);
		if (collidedEntity) {
			//this.entities.player.velocity.x = 0;
			//this.entities.player.position.x = collidedEntity.position.x + collidedEntity.size.x / 2 + this.entities.player.size.x / 2;
			console.log('Collision Detected!!!!!! YOU LOST');
		}

	}
});

module.exports = GameViewport;