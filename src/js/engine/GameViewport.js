/* jshint node: true */
'use strict';

var _ = require('lodash'),
	Viewport = require('../engine/Viewport.js'),
	Entity = require('../engine/Entity.js'),
	Layer = require('../engine/Layer.js'),
	ImageSprite = require('../engine/ImageSprite.js'),
	TextSprite = require('../engine/TextSprite.js'),
	RectangleSprite = require('../engine/RectangleSprite.js'),
	StarSprite = require('../engine/StarSprite.js'),
	utils = require('../utils.js'),
	Generator = require('../engine/Generator.js'),
	BuildingGenerator = require('../engine/BuildingGenerator.js'),
	moment = require('moment'),
	sound = require('../engine/sound');

// Instances
// GameUI
// MenuUI
// PauseUI
var GameViewport = function () {
	Viewport.apply(this, arguments); // super()
	console.log(this.game.player);
	var that = this;

	var sprites = this.sprites = {
		sky: new RectangleSprite({
			fill: '#0B4B97'
		}),
		star1: new StarSprite({
			fill: '#FFFFFF'
		}),
		star2: new StarSprite({
			fill: '#1F61B0'
		}),
		star3: new StarSprite({
			fill: '#CCCCCC'
		}),
		star4: new StarSprite({
			fill: '#EEEEEE'
		}),
		idle: new ImageSprite({
			url: 'img/sprites/s_idle.png'
		}),
		moon: new ImageSprite({
			url: 'img/sprites/moon.png',
			rotation: 0.3
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
		score: new TextSprite({
			text: 'Score',
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
			type: Entity.prototype.types.player
		}),
		sky: new Entity({
			sprite: sprites.sky,
			position: { x: 128, y: 80 },
			size: { x: 256, y: 160 }
		}),
		moon: new Entity({
			sprite: sprites.moon,
			position: { x: 220, y: 140 },
			size: { x: 79, y: 78 }
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
		score: new Entity({
			sprite: sprites.score,
			position: { x: 128, y: 60 },
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
	
	this.layers.sky.add(this.entities.sky);
	that.layers.sky.add(this.entities.moon);
	this.layers.fg.add(this.entities.player);
	that.layers.ui.add(this.entities.timeLeft);
	that.layers.ui.add(this.entities.pauseButton);

	this.buildingGenerator = new BuildingGenerator({
		size: { x: 256, y: 160 }
	});
	that.layers.fg.add(this.buildingGenerator);

	this.starGenerator = new Generator({
		size: { x: 256, y: 160 },
		sprites: [sprites.star1, sprites.star2, sprites.star3, sprites.star4],
		entitySize: { x: 1, y: 1 },
		blockSize: { x: 15 },
		entityCount: { min: 2, max: 6 }
	});
	that.layers.sky.add(this.starGenerator);

	this.cloudGenerator1 = new Generator({
		size: { x: 256, y: 160 },
		sprites: [sprites.cloud1],
		blockSize: { x: 256 },
		entityCount: { min: 2, max: 6 }
	});
	that.layers.bgFar.add(this.cloudGenerator1);

	this.cloudGenerator2 = new Generator({
		size: { x: 256, y: 160 },
		sprites: [sprites.cloud1],
		entitySize: { x: 46, y: 24 },
		blockSize: { x: 256 },
		entityCount: { min: 1, max: 3 }
	});
	that.layers.bgClose.add(this.cloudGenerator2);

	sound.music('game');
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
			// Jump only if velocity is less than 10 (not in a jump motion).
			// Volecity is changing constantly but is less than 10
			if (Math.abs(this.entities.player.velocity.y) < 10) {
				console.log('jump!', x, y);
				this.entities.player.velocity.y = 150;
				this.entities.player.sprite = this.sprites.jump;
				sound.play('jump');
			}
		}
	},
	render: function () {
		Viewport.prototype.render.apply(this, arguments);


		//var collidedEntity = utils.detectVerticalCollision(this.entities.player, this.layers.fg.entities);

		var collidedEntity = utils.detectCollision(this.entities.player, this.layers.fg.entities);

		if (collidedEntity) {
			var playerY = Math.ceil(this.entities.player.position.y);
			var collidedEntityY = collidedEntity.position.y + collidedEntity.size.y / 2.0 + this.entities.player.size.y / 2.0 ;
			if (Math.abs(collidedEntityY - playerY)  > 5 ) {
				this.entities.player.sprite = this.sprites.idle;
				this.entities.player.velocity.y = -100;
				this.entities.player.velocity.x = 0;
				this.gameover = true;
				sound.music('gameover');
				this.layers.ui.add(this.entities.gameover);
				//this.entities.score.sprite.text = 'Score: ' + (this.game.player.score-1);
				//this.layers[4].add(this.entities.score);
			} else {
				this.entities.player.sprite = this.sprites.run;
				this.entities.player.velocity.y = 0;
				this.entities.player.position.y = collidedEntity.position.y + collidedEntity.size.y / 2 + this.entities.player.size.y / 2;				
			}
		} else if ((this.entities.player.position.y-this.entities.player.size.y/2) < 5) {
			// Floor collision
			this.entities.player.sprite = this.sprites.run;
			this.entities.player.velocity.y = 0;
			//this.entities.player.position.y = collidedEntity.position.y + collidedEntity.size.y / 2 + this.entities.player.size.y / 2;
			console.log('Collision with ground');
		}

	}
});

module.exports = GameViewport;