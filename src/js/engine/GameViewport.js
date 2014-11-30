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
		}),
		gameover: new TextSprite({
			text: 'Game Over',
			fill: 'white'
		}),
		paused: new TextSprite({
			text: 'Puased',
			fill: 'white'
		}),
		pauseButton: new TextSprite({
			text: 'Pause',
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

	// Game Timer
	var startTime = Date.now();
	var gameTimer = function () {
		if (that.pause || that.gameover) {
			clearInterval(timeIntervalID);
		}
		var duration = moment.duration(Date.now() - startTime, 'ms');
		sprites.timeLeft.text = pad(duration.minutes(), 2) + ':' + pad(duration.seconds(), 2) + '.' + pad(duration.milliseconds(), 1);
	};
	var timeIntervalID;

	this.resumeGameTime = function () {
		timeIntervalID = setInterval(gameTimer, 100);
	};
	this.resumeGameTime();

	// Speeds and layers
	var baseSpeed = 100,
		baseAcceleration = 0.1;
	this.layers = [
		new Layer({
			position: { x: 0, y: 0 }
		}), // sky
		new Layer({
			position: { x: 0, y: 0 },
			velocity: { x: -baseSpeed / 8 },
			acceleration: { x: -baseAcceleration / 8 }
		}), // clouds
		new Layer({
			position: { x: 0, y: 0 },
			velocity: { x: -baseSpeed / 4 },
			acceleration: { x: -baseAcceleration / 4 }
		}), // background -- landmarks
		new Layer({
			position: { x: 0, y: 0 },
			velocity: { x: -baseSpeed },
			acceleration: { x: -baseAcceleration }
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
			position: { x: 100, y: 120 },
			size: { x: 18, y: 32 },
			acceleration: { x: baseAcceleration, y: -300 },
			velocity: { x: baseSpeed, y: 0 },
			floorcollision: true,
			type: Entity.prototype.types.player
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
		}),
		gameover: new Entity({
			sprite: sprites.gameover,
			position: { x: 128, y: 80 },
			size: { x: 0, y: 0 }
		}),
		paused: new Entity({
			sprite: sprites.paused,
			position: { x: 128, y: 80 },
			size: { x: 0, y: 0 }
		}),
		pauseButton: new Entity({
			sprite: sprites.pauseButton,
			position: { x: 40, y: 140 },
			size: { x: 0, y: 0 }
		})
	};
	
	this.layers[0].add(this.entities.sky);
	this.layers[3].add(this.entities.player);

	var obstacles = utils.generateEntity([sprites.house1], 1000.0);
	_.each(obstacles, function (entity) {
		//that.layers[3].add(entity);
	});
	console.log(obstacles);

	var clouds = utils.generateEntity([sprites.cloud1], 1000.0, 160);
	_.each(clouds, function (entity) {
		that.layers[2].add(entity);
	});

	var clouds2 = utils.generateEntity([sprites.cloud1], 1000.0, 160);
	_.each(clouds2, function (entity) {
		that.layers[1].add(entity);
	});

	that.layers[4].add(this.entities.timeLeft);
	that.layers[4].add(this.entities.pauseButton);

	this.buildingGenerator = new BuildingGenerator({
		size: { x: 256, y: 160 }
		//velocity: { x: baseSpeed },
		//acceleration: { x: baseAcceleration }
	});
	that.layers[3].add(this.buildingGenerator);

	this.starGenerator = new Generator({
		size: { x: 256, y: 160 }
	});
	that.layers[1].add(this.starGenerator);
};


_.extend(GameViewport.prototype, Viewport.prototype, {
	click: function (x, y) {
		if (x>0 && x<75 && y>0 && y<40) {
			if (!this.pause) {
				this.layers[4].add(this.entities.paused);
			} else {
				this.layers[4].remove(this.entities.paused);
				this.resumeGameTime();
			}
			this.pause = !this.pause;
		} else {
			console.log('jump!', x, y);
			this.entities.player.velocity.y = 150;
			this.entities.player.sprite = this.sprites.jump;
		}
	},
	render: function () {
		Viewport.prototype.render.apply(this, arguments);

		var collidedEntity = utils.detectCollision(this.entities.player, this.layers[3].entities);
		if (collidedEntity) {
			var playerY = Math.ceil(this.entities.player.position.y);
			var collidedEntityY = collidedEntity.position.y + collidedEntity.size.y / 2.0 + this.entities.player.size.y / 2.0 ;
			if (Math.abs(collidedEntityY - playerY)  > 5 ) {
				this.entities.player.sprite = this.sprites.idle;
				this.entities.player.velocity.y = -100;
				this.entities.player.velocity.x = 0;
				this.gameover = true;
				this.layers[4].add(this.entities.gameover);
			} else {
				this.entities.player.sprite = this.sprites.run;
				this.entities.player.velocity.y = 0;
				this.entities.player.position.y = collidedEntity.position.y + collidedEntity.size.y / 2 + this.entities.player.size.y / 2;				
			}
		}
	}
});

module.exports = GameViewport;