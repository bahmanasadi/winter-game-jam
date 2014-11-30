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
		cloudLarge1: new ImageSprite({
			url: 'img/sprites/cloud-large1.png'
		}),
		cloudLarge2: new ImageSprite({
			url: 'img/sprites/cloud-large2.png'
		}),
		cloudSmall1: new ImageSprite({
			url: 'img/sprites/cloud-small1.png'
		}),
		cloudSmall2: new ImageSprite({
			url: 'img/sprites/cloud-small2.png'
		}),
		cloudSmall3: new ImageSprite({
			url: 'img/sprites/cloud-small3.png'
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
		}),
		present: [
			new ImageSprite({ url: 'img/sprites/gift1.png' }),
			new ImageSprite({ url: 'img/sprites/gift2.png' }),
			new ImageSprite({ url: 'img/sprites/gift3.png' }),
			new ImageSprite({ url: 'img/sprites/gift4.png' })
		],
		chimneyFace: {
			happyPleased: new ImageSprite({ url: 'img/sprites/chimney-face-happy-pleased.png' }),
			happySmiley: new ImageSprite({ url: 'img/sprites/chimney-face-happy-smiley.png' }),
			ouchOoo: new ImageSprite({ url: 'img/sprites/chimney-face-ouch-ooo.png' }),
			ouchSad: new ImageSprite({ url: 'img/sprites/chimney-face-ouch-sad.png' }),
			ouchShock: new ImageSprite({ url: 'img/sprites/chimney-face-ouch-shock.png' }),
			sleep: new ImageSprite({ url: 'img/sprites/chimney-face-sleep.png' }),
			surprised: new ImageSprite({ url: 'img/sprites/chimney-face-surprised.png' })
		}

		
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
	this.layers.fg2 = new Layer({
		position: { x: 0, y: 0 },
		velocity: { x: -baseSpeed },
		acceleration: { x: -baseAcceleration }
	}); // presents
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
		size: { x: 256, y: 160 },
		chimneyFaceSprites: sprites.chimneyFace
	});
	that.layers.fg.add(this.buildingGenerator);

	this.starGenerator = new Generator({
		size: { x: 256, y: 160 },
		position: { x: 128, y: 80 },
		sprites: [sprites.star1, sprites.star2, sprites.star3, sprites.star4],
		entitySize: { x: 1, y: 1 },
		blockSize: { x: 64 },
		entityCount: { min: 1, max: 6 }
	});
	that.layers.sky.add(this.starGenerator);

	this.cloudGenerator1 = new Generator({
		size: { x: 256, y: 100 },
		position: { x: 128, y: 130 },
		sprites: [sprites.cloudLarge1, sprites.cloudLarge2],
		blockSize: { x: 128 },
		entityCount: { min: 0, max: 2 }
	});
	that.layers.bgFar.add(this.cloudGenerator1);

	this.cloudGenerator2 = new Generator({
		size: { x: 256, y: 100 },
		position: { x: 128, y: 130 },
		sprites: [sprites.cloudSmall1, sprites.cloudSmall2, sprites.cloudSmall3],
		//entitySize: { x: 46, y: 24 },
		blockSize: { x: 128 },
		entityCount: { min: 0, max: 2 }
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
		var that = this;
		Viewport.prototype.render.apply(this, arguments);
		if (this.gameover) { return; }

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
				this.buildingGenerator.chimneys.forEach(function (chimney) {
					chimney.face.sprite = _.sample([
						that.sprites.chimneyFace.ouchOoo,
						that.sprites.chimneyFace.ouchSad,
						that.sprites.chimneyFace.ouchShock
					])
				})
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

		var chimneyJumped = utils.detectJumpingOver(this.entities.player, this.buildingGenerator.chimneys);
		if (chimneyJumped && !chimneyJumped.jumped) {
			chimneyJumped.jumped = true;
			console.log('Chimney jumped!');
			sound.play('point');
			var present = new Entity({
				sprite: _.sample(this.sprites.present),
				position: { x: chimneyJumped.position.x, y: this.entities.player.position.y - 15 },
				acceleration: { x: 0, y: -300 } 
			});
			this.layers.fg2.add(present);
			chimneyJumped.face.sprite = this.sprites.chimneyFace.surprised;
			setTimeout(function () {
				chimneyJumped.face.sprite = _.sample([ that.sprites.chimneyFace.happyPleased, that.sprites.chimneyFace.happySmiley ]);
			}, 400);
		}

	}
});

module.exports = GameViewport;